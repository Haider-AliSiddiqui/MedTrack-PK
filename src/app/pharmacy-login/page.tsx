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
  Alert,
} from "@mui/material";
import {
  Lock,
  Security,
  Dashboard,
  CheckCircle,
} from "@mui/icons-material";
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "pharmacy") {
          router.push("/pharmacydashboard");
        } else {
          setError("Access denied. Only pharmacy accounts can log in here.");
        }
      } else {
        setError("User profile not found. Please contact support.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please check your credentials.";
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
          maxWidth: 1000,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          minHeight: 500,
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
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
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

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 3, textAlign: "center", fontFamily: "plus-jakarta-sans, sans-serif" }}
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
      </Paper>
    </Box>
  );
}
