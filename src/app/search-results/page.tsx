"use client";

import { useEffect, useState, Suspense, useMemo } from "react";

export const dynamic = 'force-dynamic';
import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
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
                sx={{
                  bgcolor: "#0d9488",
                  "&:hover": {
                    bgcolor: "#0b7a6f",
                    transform: 'scale(1.05)',
                  },
                  borderRadius: 2,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.5 },
                  fontSize: { xs: '12px', md: '14px' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                ← Back to Home
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
                No medicines found for "{searchTerm}"
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
