"use client";

import { useEffect, useState, Suspense, useMemo } from "react";

export const dynamic = 'force-dynamic';
import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import Image from "next/image";
import { getMedicines, Medicine } from "../../lib/firestore";
import SearchResults from "../../components/SearchResults";
import MedicinesTable from "../../components/MedicinesTable";
import Loader from "../loader";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      const allMedicines = await getMedicines();
      setMedicines(allMedicines);
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    if (searchTerm) {
      return medicines.filter(
        (med) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          med.status === "Available"
      );
    } else {
      return [];
    }
  }, [medicines, searchTerm]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)",
      py: { xs: 1, md: 4 },
      animation: 'fadeIn 0.6s ease-out',
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230d9488\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        pointerEvents: 'none',
      },
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, md: 2 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: { xs: 2, md: 3 },
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(13, 148, 136, 0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
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
          <SearchResults searchTerm={searchTerm} resultCount={filteredMedicines.length} />
          {filteredMedicines.length > 0 ? (
            <MedicinesTable medicines={filteredMedicines} />
          ) : (
            <Box sx={{
              textAlign: "center",
              py: { xs: 4, md: 6 },
              px: { xs: 2, md: 0 }
            }}>
              <Box sx={{
                width: { xs: 200, md: 300 },
                height: { xs: 150, md: 200 },
                position: 'relative',
                mx: 'auto',
                mb: 3,
                animation: 'bounceIn 1s ease-out',
                '@keyframes bounceIn': {
                  '0%': { opacity: 0, transform: 'scale(0.3)' },
                  '50%': { opacity: 1, transform: 'scale(1.05)' },
                  '70%': { transform: 'scale(0.9)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}>
                <Image
                  src="/images/medicine-not-found.png"
                  alt="No available medicines found"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: '500',
                  mb: 2
                }}
              >
                No medicines found for {searchTerm}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '12px', md: '14px' },
                  opacity: 0.8
                }}
              >
                Try searching for a different medicine or check back later.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchResultsContent />
    </Suspense>
  );
}
