"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  PersonAdd,
  Store,
  Dashboard,
  CheckCircle,
  Security,
  LocationOn,
} from "@mui/icons-material";
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerPharmacy } from '../../lib/firestore';

export default function PharmacyRegistration() {
  const [formData, setFormData] = useState({
    pharmacyName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    licenseNumber: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions!");
      setLoading(false);
      return;
    }

    try {
      await registerPharmacy({
        pharmacyName: formData.pharmacyName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        licenseNumber: formData.licenseNumber,
      });

      // Redirect to login page
      router.push("/pharmacy-login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 1200,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          minHeight: 600,
        }}
      >
        {/* Left Side - Instructions */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(175deg, #0f766e, #0284c7)",
            color: "white",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
          >
            Join MedTrack PK
          </Typography>
          <Typography
            variant="body1"
            mb={4}
            sx={{
              opacity: 0.9,
              fontFamily: "plus-jakarta-sans, sans-serif",
              lineHeight: 1.6,
            }}
          >
            Register your pharmacy and help patients find medicines during shortages. Be part of Pakistan&apos;s largest medicine availability network.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mb={2}>
            Registration Benefits:
          </Typography>
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Store />
              </ListItemIcon>
              <ListItemText
                primary="List your pharmacy in our network"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Dashboard />
              </ListItemIcon>
              <ListItemText
                primary="Access comprehensive dashboard"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <LocationOn />
              </ListItemIcon>
              <ListItemText
                primary="Reach customers across Pakistan"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Secure data management"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
          </List>
        </Box>

        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >
          <Box sx={{ maxWidth: 450, mx: "auto" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={1}
              sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
            >
              Pharmacy Registration
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={4}
              sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
            >
              Create your pharmacy account to get started
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                autoFocus
                fullWidth
                label="Pharmacy Name"
                name="pharmacyName"
                value={formData.pharmacyName}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Complete Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={2}
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                select
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              >
                <MenuItem value="Karachi">Karachi</MenuItem>
                <MenuItem value="Lahore">Lahore</MenuItem>
                <MenuItem value="Islamabad">Islamabad</MenuItem>
                <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
                <MenuItem value="Faisalabad">Faisalabad</MenuItem>
                <MenuItem value="Multan">Multan</MenuItem>
                <MenuItem value="Peshawar">Peshawar</MenuItem>
                <MenuItem value="Quetta">Quetta</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                variant="outlined"
                disabled={loading}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="I agree to the Terms and Conditions"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  backgroundColor: "#0d9488",
                  "&:hover": { backgroundColor: "#0f766e" },
                  fontFamily: "plus-jakarta-sans, sans-serif",
                  fontWeight: "bold",
                  mb: 2,
                }}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Pharmacy"}
              </Button>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", fontFamily: "plus-jakarta-sans, sans-serif" }}
            >
              Already have an account?{" "}
              <Link
                href="/pharmacy-login"
                style={{
                  color: "#0d9488",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
