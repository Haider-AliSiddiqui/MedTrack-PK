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
import { getMedicinesForPharmacy, addMedicine, updateMedicine, Medicine } from "../../lib/firestore";
import { useAuth } from "../../context/AuthContext";
import StatsCards from "../../components/StatsCards";
import Loader from "../loader";

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
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

  // Save medicine (add/edit)
  const handleSaveMedicine = async () => {
    if (!user) return;
    try {
      if (editingMedicine) {
        // Edit existing
        await updateMedicine(user.uid, editingMedicine.id, { name: newMedicineName, status: newMedicineStatus });
        setMedicines(prev =>
          prev.map(m =>
            m.id === editingMedicine.id
              ? { ...m, name: newMedicineName, status: newMedicineStatus }
              : m
          )
        );
        // showToast(`${newMedicineName} updated`);
      } else {
        // Add new
        const newMed = { name: newMedicineName, status: newMedicineStatus };
        const id = await addMedicine(user.uid, newMed);
        setMedicines(prev => [...prev, {
          id,
          name: newMedicineName,
          status: newMedicineStatus,
          pharmacyName: "",
          location: "",
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
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", bgcolor: "#e0f2f1" }}>
      <Box sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <Button variant="outlined" sx={{ color: "#0d9488", borderColor: "#0d9488" }}>
            Back to Home
          </Button>
        </Link>
      </Box>
      <Typography variant="h4" mb={4} fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
        Pharmacy Dashboard
      </Typography>

      {/* Stats Cards */}
      <StatsCards medicines={medicines} />

      <Button variant="contained" sx={{ mb: 2, bgcolor: "#10b981" }} onClick={handleAddMedicine}>
        Add Medicine
      </Button>

      {/* Medicines Table */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Toggle</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((med) => (
              <TableRow key={med.id}>
                <TableCell>{med.name}</TableCell>
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
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={med.status === "Available"}
                    onChange={() => toggleStatus(med.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEditMedicine(med)}>Edit</Button>
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