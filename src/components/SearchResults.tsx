"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchResultsProps {
  searchTerm: string;
  resultCount: number;
}

export default function SearchResults({ searchTerm, resultCount }: SearchResultsProps) {
  if (!searchTerm) return null;

  return (
    <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", py: { xs: 2, md: 3 }, px: { xs: 2, md: 4 }, flexDirection: { xs: 'column', md: 'row' } }}>
        <SearchIcon sx={{ mr: { xs: 0, md: 2 }, mb: { xs: 1, md: 0 }, color: "#0d9488" }} />
        <Box textAlign={{ xs: 'center', md: 'left' }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", color: "#0d9488", fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Results for: "{searchTerm}"
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Found {resultCount} available medicine{resultCount !== 1 ? 's' : ''} in your area.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
