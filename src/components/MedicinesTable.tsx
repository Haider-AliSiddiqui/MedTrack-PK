import { Medicine } from "../lib/firestore";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  medicines?: Medicine[];
}

export default function MedicinesTable({ medicines = [] }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box>
        {medicines.map((medicine) => (
          <Card key={medicine.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0d9488", mb: 1 }}>
                {medicine.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pharmacy:</strong> {medicine.pharmacyName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Address:</strong> {medicine.location}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                <Chip
                  label={medicine.status}
                  color={medicine.status === "Available" ? "success" : "error"}
                  variant="outlined"
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Available:</Typography>
                  <input
                    type="checkbox"
                    checked={medicine.status === "Available"}
                    readOnly
                    style={{ cursor: "not-allowed" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400, borderRadius: 2, boxShadow: 2 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0d9488" }}>
              Medicine Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0d9488" }}>
              Pharmacy Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0d9488" }}>
              Address
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0d9488" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0f2fe", color: "#0d9488" }}>
              Available
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medicines.map((medicine) => (
            <TableRow key={medicine.id}>
              <TableCell>{medicine.name}</TableCell>
              <TableCell>{medicine.pharmacyName}</TableCell>
              <TableCell>{medicine.location}</TableCell>
              <TableCell>
                <Chip
                  label={medicine.status}
                  color={medicine.status === "Available" ? "success" : "error"}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <input
                  type="checkbox"
                  checked={medicine.status === "Available"}
                  readOnly
                  style={{ cursor: "not-allowed" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
