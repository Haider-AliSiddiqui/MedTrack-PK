"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import HeroSection from "./herosection/page";
import StatsCards from "../components/StatsCards";
import { getMedicines, Medicine } from "../lib/firestore";

export default function Page() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getMedicines().then(setMedicines);
  }, []);

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <StatsCards medicines={medicines} />

      <Container maxWidth="md">
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Medicines
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          {filteredMedicines.length === 0 ? (
            <Typography color="text.secondary" align="center" py={4}>
              Start by adding medicines to your pharmacy inventory
            </Typography>
          ) : (
            filteredMedicines.map((med) => (
              <Typography key={med.id}>
                {med.name} — {med.status}
              </Typography>
            ))
          )}
        </Paper>
      </Container>
    </>
  );
}
