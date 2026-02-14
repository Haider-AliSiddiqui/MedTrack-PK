"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Swal from 'sweetalert2';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMedicinesForPharmacy, addMedicine, updateMedicine, deleteMedicine, Medicine } from "../../lib/firestore";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import StatsCards from "../../components/StatsCards";
import Loader from "../loader";

interface PharmacyDetails {
  pharmacyName: string;
  ownerName: string;
}

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacyDetails, setPharmacyDetails] = useState<PharmacyDetails | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineStatus, setNewMedicineStatus] = useState<"Available" | "Out of Stock" | "Low">("Available");

  const { user, role, loading } = useAuth();
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (!loading && (!user || role !== "pharmacy")) {
      router.push("/pharmacy-login");
    }
  }, [user, role, loading, router]);

  // get medicines from Firebase
  useEffect(() => {
    if (user && role === "pharmacy") {
      getMedicinesForPharmacy(user.uid).then(setMedicines);
    }
  }, [user, role]);

  // Fetch pharmacy details for the title
  useEffect(() => {
    if (user && role === "pharmacy") {
      const fetchPharmacyDetails = async () => {
        try {
          const pharmacyDoc = await getDoc(doc(db, "pharmacies", user.uid));
          const pharmacyData = pharmacyDoc.data();
          if (pharmacyData) {
            setPharmacyDetails({
              pharmacyName: pharmacyData.pharmacyName || "",
              ownerName: pharmacyData.ownerName || "",
            });
          }
        } catch (error) {
          console.error("Error fetching pharmacy details:", error);
        }
      };
      fetchPharmacyDetails();
    }
  }, [user, role]);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><Loader /></Box>;
  }

  if (!user || role !== "pharmacy") {
    return null; // Will redirect
  }

  // Toggle medicine status
  const toggleStatus = async (id: string) => {
    if (!user) return;
    try {
      const med = medicines.find((m) => m.id === id);
      if (!med) return;

      const newStatus = med.status === "Available" ? "Out of Stock" : "Available";
      await updateMedicine(user.uid, id, { status: newStatus });

      setMedicines((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: newStatus,
              }
            : m
        )
      );

      await Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `${med.name} status updated to ${newStatus}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating status:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update medicine status'
      });
    }
  };

  // Open Add Medicine Modal
  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setNewMedicineName("");
    setNewMedicineStatus("Available");
    setOpenModal(true);
  };

  // Open Edit Medicine Modal
  const handleEditMedicine = (med: Medicine) => {
    setEditingMedicine(med);
    setNewMedicineName(med.name);
    setNewMedicineStatus(med.status);
    setOpenModal(true);
  };

  // Delete medicine
  const handleDeleteMedicine = async (med: Medicine) => {
    if (!user) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${med.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#0d9488',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteMedicine(user.uid, med.id);
        setMedicines(prev => prev.filter(m => m.id !== med.id));

        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${med.name} has been deleted successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error deleting medicine:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete medicine. Please try again.'
        });
      }
    }
  };

  // Save medicine (add/edit)
  const handleSaveMedicine = async () => {
    if (!user) return;
    const trimmedName = newMedicineName.trim();
    try {
      if (editingMedicine) {
        // Edit existing
        await updateMedicine(user.uid, editingMedicine.id, { name: trimmedName, status: newMedicineStatus });
        setMedicines(prev =>
          prev.map(m =>
            m.id === editingMedicine.id
              ? { ...m, name: trimmedName, status: newMedicineStatus }
              : m
          )
        );
        // showToast(`${trimmedName} updated`);
      } else {
        // Check for duplicate medicine name (case-insensitive)
        const isDuplicate = medicines.some(m => m.name.toLowerCase() === trimmedName.toLowerCase());
        if (isDuplicate) {
          setOpenModal(false);
          // Small delay to ensure modal closes before showing alert
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Duplicate Medicine',
              text: 'A medicine with this name already exists in your pharmacy.'
            });
          }, 100);
          return;
        }

        // Add new
        // Fetch pharmacy details to get pharmacyName and location
        const pharmacyDoc = await getDoc(doc(db, "pharmacies", user.uid));
        const pharmacyData = pharmacyDoc.data();
        const newMed = {
          name: trimmedName,
          status: newMedicineStatus,
          pharmacyName: pharmacyData?.pharmacyName || "",
          location: `${pharmacyData?.address || ""}, ${pharmacyData?.city || ""}`,
          phone: pharmacyData?.phone || "",
          city: pharmacyData?.city || ""
        };
        const id = await addMedicine(user.uid, newMed);
        setMedicines(prev => [...prev, {
          id,
          name: trimmedName,
          status: newMedicineStatus,
          pharmacyName: pharmacyData?.pharmacyName || "",
          location: `${pharmacyData?.address || ""}, ${pharmacyData?.city || ""}`,
          phone: pharmacyData?.phone || "",
          city: pharmacyData?.city || ""
        }]);
        await Swal.fire({
          icon: 'success',
          title: 'Medicine Added',
          text: 'New medicine has been added successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving medicine:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Failed to save medicine. Please try again.'
      });
    }
  };

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: "100vh",
      bgcolor: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
      animation: 'fadeIn 0.8s ease-out',
      '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
    }}>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
<Link href="/" passHref>
              <Button
                variant="contained"
startIcon={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    '& .icon-bg': {
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: '50%',
                      p: 0.6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }
                  }}>
                    <Box className="icon-bg">
                      <HomeIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    </Box>
                  </Box>
                }
                sx={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0284c7 100%)',
                  color: 'white',
                  borderRadius: 50,
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 1.2, md: 1.8 },
                  fontSize: { xs: '13px', md: '15px' },
                  fontWeight: '700',
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4), 0 2px 6px rgba(0,0,0,0.1)',
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0369a1 100%)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 12px 30px rgba(13, 148, 136, 0.5), 0 4px 12px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px) scale(1.01)',
                    boxShadow: '0 4px 15px rgba(13, 148, 136, 0.4)',
                  },
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-3px)' },
                  },
                }}
              >
                Back to Home
              </Button>
            </Link>
          </Box>
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        sx={{
          fontSize: { xs: '1.8rem', sm: '2rem', md: '2.125rem' },
          textAlign: { xs: 'center', md: 'left' },
          color: '#1e293b',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {pharmacyDetails ? `${pharmacyDetails.pharmacyName} Dashboard` : "Pharmacy Dashboard"}
      </Typography>
      {pharmacyDetails && (
        <Typography
          variant="h6"
          mb={4}
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            textAlign: { xs: 'center', md: 'left' },
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          Owner: {pharmacyDetails.ownerName}
        </Typography>
      )}

      {/* Stats Cards */}
      <StatsCards medicines={medicines} />

      <Button
        variant="contained"
        sx={{
          mb: 2,
          bgcolor: "#10b981",
          '&:hover': {
            bgcolor: "#059669",
            transform: 'scale(1.05)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
          },
          borderRadius: 2,
          px: { xs: 2, md: 3 },
          py: { xs: 1, md: 1.5 },
          fontSize: { xs: '12px', md: '14px' },
          fontWeight: 'bold',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
        }}
        onClick={handleAddMedicine}
      >
        Add Medicine
      </Button>

      {/* Medicines Table */}
      <TableContainer
        component={Paper}
        sx={{
          overflowX: 'auto',
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(13, 148, 136, 0.15)',
          '&:hover': {
            boxShadow: '0 16px 50px rgba(0,0,0,0.15)',
            transition: 'box-shadow 0.3s ease',
          },
        }}
      >
        <Table sx={{ minWidth: { xs: 600, md: 650 } }}>
          <TableHead sx={{ bgcolor: 'rgba(13, 148, 136, 0.05)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '14px', md: '16px' } }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '14px', md: '16px' } }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '14px', md: '16px' } }}>Toggle</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '14px', md: '16px' } }}>Edit</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '14px', md: '16px' } }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((med) => (
              <TableRow
                key={med.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(13, 148, 136, 0.02)',
                    transition: 'background-color 0.3s ease',
                  }
                }}
              >
                <TableCell sx={{ fontSize: { xs: '14px', md: '16px' } }}>{med.name}</TableCell>
                <TableCell>
                  <Chip
                    icon={
                      med.status === "Available" ? (
                        <CheckCircleIcon />
                      ) : med.status === "Out of Stock" ? (
                        <CancelIcon />
                      ) : (
                        <WarningIcon />
                      )
                    }
                    label={med.status}
                    color={
                      med.status === "Available"
                        ? "success"
                        : med.status === "Out of Stock"
                        ? "error"
                        : "warning"
                    }
                    variant="outlined"
                    sx={{
                      border: `2px solid ${
                        med.status === "Available"
                          ? "#4caf50"
                          : med.status === "Out of Stock"
                          ? "#f44336"
                          : "#ff9800"
                      }`,
                      fontWeight: "bold",
                      fontSize: { xs: '12px', md: '14px' },
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={med.status === "Available"}
                    onChange={() => toggleStatus(med.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#0d9488',
                        '&:hover': {
                          bgcolor: 'rgba(13, 148, 136, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        bgcolor: '#0d9488',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditMedicine(med)}
                    sx={{
                      fontSize: { xs: '12px', md: '14px' },
                      px: { xs: 1, md: 2 },
                      py: { xs: 0.5, md: 1 },
                      borderRadius: 2,
                      textTransform: 'none',
                      bgcolor: '#1976d2',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1565c0',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.2s ease',
                      },
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteMedicine(med)}
                    sx={{
                      fontSize: { xs: '12px', md: '14px' },
                      px: { xs: 1, md: 2 },
                      py: { xs: 0.5, md: 1 },
                      borderRadius: 2,
                      textTransform: 'none',
                      bgcolor: '#d32f2f',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#b71c1c',
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease',
                      },
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Medicine Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMedicine ? "Edit Medicine" : "Add Medicine"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Medicine Name"
            value={newMedicineName}
            onChange={(e) => setNewMedicineName(e.target.value)}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newMedicineStatus}
              label="Status"
              onChange={(e) => setNewMedicineStatus(e.target.value as "Available" | "Out of Stock" | "Low")}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMedicine} disabled={!newMedicineName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
