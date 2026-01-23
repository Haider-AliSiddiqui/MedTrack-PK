"use client";

import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

interface MedicineCardProps {
  medicine: string;
  pharmacy: string;
  city: string;
  available: boolean;
}

export default function MedicineCard({ medicine, pharmacy, city, available }: MedicineCardProps) {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          {medicine}
        </Typography>
        <Typography color="text.secondary">
          {pharmacy} • {city}
        </Typography>
        <Stack mt={2}>
          <Chip
            label={available ? "In Stock" : "Out of Stock"}
            color={available ? "success" : "error"}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
