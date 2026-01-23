"use client";

import { Box, Typography } from "@mui/material";
import SearchForm from "./SearchForm";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export default function HeroSection({ searchTerm, setSearchTerm }: HeroSectionProps) {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d9488, #14b8a6)",
        color: "white",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Decorative Circles */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          bgcolor: "rgba(255,255,255,0.15)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 220,
          height: 220,
          bgcolor: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <Box sx={{ zIndex: 2, maxWidth: 600 }}>
        <Typography variant="h3" fontWeight={700} mb={1}>
          MedTrack PK
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Find medicine availability during shortages
        </Typography>

        {/* Search Form */}
        <Box sx={{ mt: 6 }}>
          <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Box>
      </Box>
    </Box>
  );
}
