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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Link href="/" passHref>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#0d9488",
                  "&:hover": { bgcolor: "#0b7a6f" },
                  borderRadius: 2,
                  px: 3,
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
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Image
                src="/images/medicine-not-found.png"
                alt="No available medicines found"
                width={300}
                height={200}
                style={{ marginBottom: 16 }}
              />
              <Typography variant="body1" color="text.secondary">
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
