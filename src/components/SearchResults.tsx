"use client";

import { Box, Typography } from "@mui/material";

interface SearchResultsProps {
  searchTerm: string;
}

export default function SearchResults({ searchTerm }: SearchResultsProps) {
  if (!searchTerm) return null;

  return (
    <Box sx={{ py: 6, px: 4 }}>
      <Typography variant="h5" mb={2}>
        Results for: {searchTerm}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {/* Replace this with actual firestore results */}
        Showing available pharmacies in your city.
      </Typography>
    </Box>
  );
}
