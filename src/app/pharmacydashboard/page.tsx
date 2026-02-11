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
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Swal from 'sweetalert2';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  const [toastMessage, setToastMessage] = useState("");
  const [openToast, setOpenToast] = useState(false);
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
          phone: pharmacyData?.phone || ""
        };
        const id = await addMedicine(user.uid, newMed);
        setMedicines(prev => [...prev, {
          id,
          name: trimmedName,
          status: newMedicineStatus,
          pharmacyName: pharmacyData?.pharmacyName || "",
          location: `${pharmacyData?.address || ""}, ${pharmacyData?.city || ""}`,
          phone: pharmacyData?.phone || ""
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

  // Stats cards
  const totalAvailable = medicines.filter((m) => m.status === "Available").length;
  const lowStock = 5; // Example
  const outOfStock = medicines.filter((m) => m.status === "Out of Stock").length;
  const todayViews = 156; // Example

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
      <Box sx={{ mb: { xs: 1, md: 2 } }}>
        <Link href="/" passHref>
          <Button
            variant="outlined"
            sx={{
              color: "#0d9488",
              borderColor: "#0d9488",
              borderRadius: 2,
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '12px', md: '14px' },
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.1)',
              '&:hover': {
                backgroundColor: "#0d9488",
                color: "white",
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(13, 148, 136, 0.3)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            ← Back to Home
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
