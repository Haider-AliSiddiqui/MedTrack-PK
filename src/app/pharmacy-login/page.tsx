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
      }}
    >
      <Box sx={{ alignSelf: "flex-start", mb: 2 }}>
        <Link href="/" passHref>
          <Button variant="outlined" sx={{ color: "#0d9488", borderColor: "#0d9488" }}>
            Back to Home
          </Button>
        </Link>
      </Box>
      <Paper
        elevation={10}
        sx={{
          maxWidth: 1000,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: { xs: 'auto', md: 500 },
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
