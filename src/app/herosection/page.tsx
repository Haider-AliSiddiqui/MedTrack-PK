"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScienceIcon from "@mui/icons-material/Science";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Link from 'next/link';



export default function HeroSection() {
  const [city, setCity] = useState("");

  return (
    <Box
      sx={{
        background: "linear-gradient(175deg, #0f766e, #0284c7)",
        color: "white",
        pt: 3,
        pb: 30,
        px: 5,
        position: "relative",
        
      }}
    >
      {/* 🔹 Top Bar */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Box display="flex" alignItems="center" gap={2.5}>
          <ScienceIcon sx={{ bgcolor: "rgba(255,255,255,0.15)", p: 1, borderRadius: 2 }} />
          <Box>
            <Typography fontSize={24} fontWeight="bold">MedTrack PK</Typography>
            <Typography fontSize={15} variant="caption" sx={{ opacity: 0.8 }}>
              Medicine Availability Tracker
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={<LocationOnIcon />}
            label="Pakistan"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "plus-jakarta-sans, sans-serif",
              backgroundColor: "#FFFFFF33",
              padding: "20px 16px",
              ":hover": { backgroundColor: "#FFFFFF55" },
            }}
          />
          <Link href="/pharmacy-login" passHref>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontFamily: "plus-jakarta-sans, sans-serif",
                padding: "10px 16px",
                ":hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
            >
              Pharmacy Login
            </Button>
          </Link>
        </Box>
      </Box>

      {/* 🔹 Center Content */}
      <Box textAlign="center" maxWidth={800} mx="auto">
        <Chip
          icon={<FiberManualRecordIcon />}
          label="Tracking 500+ pharmacies across Pakistan"
          sx={{
            mb: 3,
            bgcolor: "rgba(255,255,255,0.15)",
            fontSize: 14,
            fontFamily: "plus-jakarta-sans, sans-serif",
            padding: "8px 16px",
            color: "#FFFFFFE6",
          }}
        />

        <Typography
          variant="h3"
          fontWeight="bold"
          mb={2}
          sx={{
            fontSize: 48,
            color: "#FFFFFF",
            fontFamily: "plus-jakarta-sans, sans-serif",
          }}
        >
          Find Medicines Near You
        </Typography>

        <Typography sx={{ 
          opacity: 0.9, mb: 6,
          color: "#CCFBF1",
          fontFamily: "plus-jakarta-sans, sans-serif",
          margin: '0 96px 40px',
           }}
           >
          Check real-time medicine availability at pharmacies in your area during shortages
        </Typography>
      </Box>

      {/* 🔹 Search Card */}
      <Paper
        elevation={6}
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 8,
          p: 3,
          borderRadius: 4,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: -90,
          width: "90%",
        }}
      >
        <Box
          sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          borderRadius: 50,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search medicine name..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />

   <TextField
  fullWidth
  select
  label="Select City / Area"
  defaultValue={city}
  InputProps={{
    startAdornment: <LocationOnIcon sx={{ mr: 1 }} />,
  }}
>
  <MenuItem value="Karachi">Karachi</MenuItem>
  <MenuItem value="Lahore">Lahore</MenuItem>
  <MenuItem value="Islamabad">Islamabad</MenuItem>
  <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
  <MenuItem value="Faisalabad">Faisalabad</MenuItem>
  <MenuItem value="Multan">Multan</MenuItem>
  <MenuItem value="Peshawar">Peshawar</MenuItem>
  <MenuItem value="Quetta">Quetta</MenuItem>
</TextField>



          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              borderRadius: 20,
              bgcolor: "#0d9488",
              "&:hover": { bgcolor: "#0f766e" },
            }}
          >
            Search
          </Button>
        </Box>

        {/* 🔹 Popular */}
        <Box mt={3}>
          <Typography variant="subtitle2" mb={1}>
            Popular:
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap">
            {[
              "Panadol",
              "Augmentin",
              "Brufen",
              "Flagyl",
              "Cipro",
              "Metformin",
              "Amoxicillin",
              "Aspirin",
            ].map((item) => (
              <Chip key={item} label={item} variant="outlined" />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
