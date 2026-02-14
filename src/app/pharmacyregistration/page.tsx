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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  PersonAdd,
  Store,
  Dashboard,
  Security,
  LocationOn,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";
import { useState } from "react";
import Link from 'next/link';
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from 'next/navigation';
import { registerPharmacy } from '../../lib/firestore';
import { checkFirebaseServices } from '../../lib/test-firebase';

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
    state: "",
    zipCode: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    agreeToTerms: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleNext = () => {
    setError(null);
    if (currentStep === 0) {
      if (!formData.pharmacyName || !formData.ownerName || !formData.email || !formData.phone || !formData.licenseNumber || !formData.licenseExpiryDate) {
        setError("Please fill in all required fields.");
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setError("Please fill in all required fields.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
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
      // First check Firebase services
      console.log("🔍 Checking Firebase services before registration...");
      const firebaseStatus = await checkFirebaseServices();

      if (!firebaseStatus.firestore) {
        setError("Firebase Firestore is not accessible. Please check your Firebase configuration.");
        setLoading(false);
        return;
      }

      console.log("✅ Firebase services are working. Proceeding with registration...");

      await registerPharmacy({
        pharmacyName: formData.pharmacyName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        licenseNumber: formData.licenseNumber,
        licenseExpiryDate: formData.licenseExpiryDate,
      });

      console.log("✅ Registration successful! Redirecting to login...");
      // Redirect to login page
      router.push("/pharmacy-login");
    } catch (error) {
      console.error("❌ Registration failed:", error);
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, md: 2 },
      }}
    >
      <Box sx={{ 
        mb: { xs: 2, md: 3 }, 
        width: '100%', 
        maxWidth: 1200,
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
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
            display: { xs: 'none', md: 'flex' },
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

            <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Basic Information</StepLabel>
              </Step>
              <Step>
                <StepLabel>Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Password</StepLabel>
              </Step>
            </Stepper>

            {error && (
              <div style={{ marginBottom: '16px', color: 'red', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <Box component="form" onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()} sx={{ width: "100%" }}>
              {currentStep === 0 && (
                <>
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
                    label="License Expiry Date"
                    name="licenseExpiryDate"
                    type="date"
                    value={formData.licenseExpiryDate}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </>
              )}

              {currentStep === 1 && (
                <>
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
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={loading}
                  />
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={loading}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
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
                </>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                  disabled={currentStep === 0 || loading}
                  sx={{ color: "#0d9488", borderColor: "#0d9488" }}
                >
                  Back
                </Button>
                {currentStep < 2 && (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                    sx={{
                      backgroundColor: "#0d9488",
                      "&:hover": { backgroundColor: "#0f766e" },
                      fontFamily: "plus-jakarta-sans, sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
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