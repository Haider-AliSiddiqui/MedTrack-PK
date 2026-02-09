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
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMedicines, Medicine } from "../../lib/firestore";
import { useAuth } from "../../context/AuthContext";

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
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
      getMedicines().then(setMedicines);
    }
  }, [user, role]);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>Loading...</Box>;
  }

  if (!user || role !== "pharmacy") {
    return null; // Will redirect
  }

  // Toggle medicine status
  const toggleStatus = (id: string) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === "Available" ? "Out of Stock" : "Available",
            }
          : m
      )
    );
    const med = medicines.find((m) => m.id === id);
    showToast(`${med?.name} status updated`);
  };

  // Open Add Medicine Modal
  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setOpenModal(true);
  };

  // Open Edit Medicine Modal
  const handleEditMedicine = (med: Medicine) => {
    setEditingMedicine(med);
    setOpenModal(true);
  };

  // Save medicine (add/edit)
  const handleSaveMedicine = () => {
    if (editingMedicine) {
      // Edit existing
      showToast(`${editingMedicine.name} updated`);
    } else {
      // Add new
      setMedicines(prev => [...prev, {
        id: crypto.randomUUID(),
        name: "New Medicine",
        status: "Available",
      }]);
      showToast("New medicine added");
    }
    setOpenModal(false);
  };

  // Show Toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setOpenToast(true);
  };

  // Stats cards
  const totalAvailable = medicines.filter((m) => m.status === "Available").length;
  const lowStock = 5; // Example
  const outOfStock = medicines.filter((m) => m.status === "Out of Stock").length;
  const todayViews = 156; // Example

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#e0f2f1" }}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Pharmacy Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#ecfdf5" }}>
            <CardContent>
              <Typography variant="subtitle2" color="success.main">
                +12%
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {totalAvailable}
              </Typography>
              <Typography color="text.secondary">Available Medicines</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#fffbeb" }}>
            <CardContent>
              <Typography variant="subtitle2" color="warning.main">
                Low
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {lowStock}
              </Typography>
              <Typography color="text.secondary">Low Stock Items</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#fef2f2" }}>
            <CardContent>
              <Typography variant="subtitle2" color="error.main">
                -3
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {outOfStock}
              </Typography>
              <Typography color="text.secondary">Out of Stock</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#ecfeff" }}>
            <CardContent>
              <Typography variant="subtitle2" color="info.main">
                Today
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {todayViews}
              </Typography>
              <Typography color="text.secondary">Search Views</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ mb: 2, bgcolor: "#10b981" }} onClick={handleAddMedicine}>
        Add Medicine
      </Button>

      {/* Medicines Table */}
      <TableContainer component={Paper}>
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
                <TableCell
                  sx={{
                    color: med.status === "Available" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {med.status}
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{editingMedicine ? "Edit Medicine" : "Add Medicine"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Medicine Name"
            value={editingMedicine?.name || ""}
            onChange={(e) =>
              setEditingMedicine((prev) => prev && { ...prev, name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMedicine}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}