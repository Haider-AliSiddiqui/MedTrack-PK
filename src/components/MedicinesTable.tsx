import { Medicine } from "../lib/firestore";
import { useState, useEffect } from "react";
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
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicationIcon from "@mui/icons-material/Medication";

interface Props {
  medicines?: Medicine[];
}

export default function MedicinesTable({ medicines = [] }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    medicines.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 150);
    });
  }, [medicines]);

  if (isMobile) {
    return (
      <Box sx={{ px: 1 }}>
        {medicines.map((medicine, index) => (
          <Card
            key={medicine.id}
            sx={{
              mb: 3,
              borderRadius: 4,
              boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              border: '1px solid rgba(13, 148, 136, 0.15)',
              transition: 'all 0.4s ease',
              opacity: visibleCards.includes(index) ? 1 : 0,
              transform: visibleCards.includes(index) ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              '&:hover': {
                transform: 'translateY(-6px) scale(1.03)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                border: '1px solid rgba(13, 148, 136, 0.4)',
              },
              animation: visibleCards.includes(index) ? 'slideIn 0.6s ease-out' : 'none',
              '@keyframes slideIn': {
                '0%': { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
                '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MedicationIcon sx={{ color: "#0d9488", mr: 1.5, fontSize: '1.8rem' }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0d9488", fontSize: '1.2rem' }}>
                  {medicine.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                  <LocalPharmacyIcon sx={{ fontSize: 18, color: "#0d9488", mr: 1 }} />
                  <strong style={{ color: '#374151' }}>Pharmacy:</strong> {medicine.pharmacyName}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: "#0d9488", mr: 1 }} />
                  <strong style={{ color: '#374151' }}>Address:</strong> {medicine.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                <Chip
                  label={medicine.status}
                  color={medicine.status === "Available" ? "success" : "error"}
                  variant="filled"
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: 2,
                    py: 0.5,
                    fontSize: '0.8rem',
                    animation: medicine.status === "Available" ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
                    },
                  }}
                />
                <Tooltip title="Contact via WhatsApp">
                  <IconButton
                    component="a"
                    href={`https://wa.me/${medicine.phone}?text=Hello, I am interested in ${medicine.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "#25d366",
                      color: "white",
                      '&:hover': {
                        bgcolor: "#128c7e",
                        transform: 'scale(1.2)',
                        boxShadow: '0 6px 16px rgba(37, 211, 102, 0.5)',
                      },
                      transition: 'all 0.3s ease',
                      p: 1.5,
                    }}
                  >
                    <WhatsAppIcon sx={{ fontSize: '1.5rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{
      maxHeight: 500,
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      overflowX: 'auto',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(13, 148, 136, 0.1)',
    }}>
      <Table stickyHeader sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            '& th': {
              fontWeight: "bold",
              color: "#0d9488",
              fontSize: '0.95rem',
              borderBottom: '2px solid rgba(13, 148, 136, 0.2)',
              py: 2,
            }
          }}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicationIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Medicine Name
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalPharmacyIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Pharmacy Name
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Address
              </Box>
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Contact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medicines.map((medicine, index) => (
            <TableRow
              key={medicine.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(13, 148, 136, 0.05)',
                  transform: 'scale(1.01)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                '& td': {
                  borderBottom: '1px solid rgba(13, 148, 136, 0.1)',
                  py: 2,
                },
                animation: `fadeInRow 0.5s ease-out ${index * 0.1}s both`,
                '@keyframes fadeInRow': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <TableCell sx={{ fontWeight: 'medium', color: '#0d9488' }}>
                {medicine.name}
              </TableCell>
              <TableCell sx={{ fontWeight: 'medium' }}>
                {medicine.pharmacyName}
              </TableCell>
              <TableCell sx={{ color: '#6b7280' }}>
                {medicine.location}
              </TableCell>
              <TableCell>
                <Chip
                  label={medicine.status}
                  color={medicine.status === "Available" ? "success" : "error"}
                  variant="filled"
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    animation: medicine.status === "Available" ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Contact via WhatsApp">
                  <Button
                    component="a"
                    href={`https://wa.me/${medicine.phone}?text=Hello, I am interested in ${medicine.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      bgcolor: "#25d366",
                      color: "white",
                      '&:hover': {
                        bgcolor: "#128c7e",
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                    }}
                  >
                    WhatsApp
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}