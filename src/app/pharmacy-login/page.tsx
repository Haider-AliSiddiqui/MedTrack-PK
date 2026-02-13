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
} from "@mui/material";
import Swal from 'sweetalert2';
import {
  Lock,
  Security,
  Dashboard,
  CheckCircle,
} from "@mui/icons-material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

export default function PharmacyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, role } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "pharmacies", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "pharmacy") {
          await Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome to your pharmacy dashboard.',
            timer: 2000,
            showConfirmButton: false
          });
          router.push("/pharmacydashboard");
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Only pharmacy accounts can log in here.'
          });
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Profile Not Found',
          text: 'User profile not found. Please contact support.'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please check your credentials.";
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Email Sent',
        text: 'Check your email for instructions to reset your password.'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send password reset email.";
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
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
        animation: 'fadeIn 0.8s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
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
      <Paper
        elevation={10}
        sx={{
          maxWidth: { xs: '95%', md: 1000 },
          width: "100%",
          borderRadius: { xs: 2, md: 4 },
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: { xs: 'auto', md: 500 },
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
          },
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
            Help patients find
            medicines faster
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
            Join 500+ pharmacies across Pakistan helping people during medicine shortages.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mb={2}>
            Benefits of Logging In:
          </Typography>
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Dashboard />
              </ListItemIcon>
              <ListItemText
                primary="Manage your pharmacy inventory"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <CheckCircle />
              </ListItemIcon>
              <ListItemText
                primary="Update medicine availability in real-time"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Secure access to your pharmacy data"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              />
            </ListItem>
          </List>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={1}
              sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
            >
              Pharmacy Login
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={4}
              sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
            >
              Enter your credentials to access your dashboard
            </Typography>

            {error && (
              <div style={{ marginBottom: '16px', color: 'red', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
              <TextField
                autoFocus
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                variant="outlined"
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Lock />}
                sx={{
                  py: 1.5,
                  backgroundColor: "#0d9488",
                  "&:hover": { backgroundColor: "#0f766e" },
                  fontFamily: "plus-jakarta-sans, sans-serif",
                  fontWeight: "bold",
                }}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, fontFamily: "plus-jakarta-sans, sans-serif" }}
              >
                <Button
                  variant="text"
                  onClick={handleForgotPassword}
                  sx={{
                    color: "#0d9488",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  Forgot Password?
                </Button>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "plus-jakarta-sans, sans-serif" }}
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/pharmacyregistration"
                  style={{
                    color: "#0d9488",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  Register here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
