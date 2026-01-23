"use client";

import { Box, Typography } from "@mui/material";
import MedicineCard from "./MedicineCard";

interface SearchResultsProps {
  searchTerm: string;
}

const dummyData = [
  { medicine: "Panadol", pharmacy: "Al-Shifa Pharmacy", city: "Karachi", available: true },
  { medicine: "Brufen", pharmacy: "Health Plus", city: "Lahore", available: false },
  { medicine: "Paracetamol", pharmacy: "City Pharma", city: "Islamabad", available: true },
];

export default function SearchResults({ searchTerm }: SearchResultsProps) {
  const filtered = dummyData.filter((m) =>
    m.medicine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={4} textAlign="center">
        Available Medicines
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, justifyItems: 'center' }}>
        {filtered.map((m, i) => (
          <MedicineCard key={i} {...m} />
        ))}
      </Box>
    </Box>
  );
}
