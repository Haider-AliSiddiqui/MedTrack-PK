"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

interface SearchResultsProps {
  searchTerm: string;
  resultCount: number;
  city: string;
}

export default function SearchResults({ searchTerm, resultCount, city }: SearchResultsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!searchTerm) return null;

  return (
    <Card
      sx={{
        mb: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        border: '1px solid rgba(13, 148, 136, 0.2)',
        transition: 'all 0.5s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        },
        animation: 'fadeInUp 0.6s ease-out',
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          py: { xs: 3, md: 4 },
          px: { xs: 3, md: 5 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <SearchIcon
          sx={{
            mr: { xs: 0, md: 3 },
            mb: { xs: 2, md: 0 },
            color: "#0d9488",
            fontSize: { xs: '2rem', md: '2.5rem' },
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
          }}
        />
        <Box textAlign={{ xs: 'center', md: 'left' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #0d9488, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 1,
            }}
          >
            Results for: {searchTerm}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: '1rem', md: '1.125rem' },
              fontWeight: 500,
            }}
          >
            Found {resultCount} available medicine{resultCount !== 1 ? 's' : ''} in {city}.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
