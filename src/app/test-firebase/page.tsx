"use client";

import { useState } from "react";
import { Button, Box, Typography, Alert, Paper } from "@mui/material";
import { checkFirebaseServices, testFirebaseConnection } from "../../lib/test-firebase";
import { registerPharmacy } from "../../lib/firestore";

export default function TestFirebase() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus("");
    setError("");

    try {
      const result = await checkFirebaseServices();
      if (result.firestore) {
        setStatus("✅ Firebase Firestore is working correctly!");
      } else {
        setError("❌ Firebase Firestore is not accessible: " + result.error);
      }
    } catch (err) {
      setError("❌ Test failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRegistration = async () => {
    setLoading(true);
    setStatus("");
    setError("");

    try {
      // Test data
      const testData = {
        pharmacyName: "Test Pharmacy",
        ownerName: "Test Owner",
        email: `test${Date.now()}@example.com`,
        phone: "03001234567",
        password: "testpassword123",
        address: "Test Address, Karachi, Sindh, 12345",
        city: "Karachi",
        licenseNumber: "TEST123456",
        licenseExpiryDate: "2025-12-31",
      };

      console.log("🧪 Testing pharmacy registration with data:", testData);
      await registerPharmacy(testData);
      setStatus("✅ Test registration successful! Check Firebase Console for 'pharmacies' collection.");
    } catch (err) {
      setError("❌ Test registration failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Firebase Test Page
      </Typography>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Firebase Connection
        </Typography>
        <Button
          variant="contained"
          onClick={handleTestConnection}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? "Testing..." : "Test Firebase Connection"}
        </Button>

        <Typography variant="h6" gutterBottom>
          Test Pharmacy Registration
        </Typography>
        <Button
          variant="contained"
          onClick={handleTestRegistration}
          disabled={loading}
          color="secondary"
        >
          {loading ? "Registering..." : "Test Registration"}
        </Button>
      </Paper>

      {status && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {status}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        Open browser console (F12) to see detailed logs. After successful registration, check Firebase Console → Firestore Database → Data → pharmacies collection.
      </Typography>
    </Box>
  );
}
