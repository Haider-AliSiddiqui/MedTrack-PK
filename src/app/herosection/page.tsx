"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import logo from '../../images/logo.png';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const router = useRouter();

  const [cityError, setCityError] = useState(false);

  const handleSearch = () => {
    // Check if search term is empty
    if (!searchTerm.trim()) {
      return;
    }
    
    // Check if city is selected
    if (!selectedCity) {
      setCityError(true);
      return;
    }
    
    setCityError(false);
    router.push(`/search-results?searchTerm=${encodeURIComponent(searchTerm)}&city=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(-45deg, #0284c7, #0f766e, #0284c7, #0f766e)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 5s ease infinite",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        color: "white",
        pt: { xs: 2, md: 3 },
        pb: { xs: 20, md: 30 },
        px: 0,
        position: "relative",
        width: "100vw",
        left: "49.5%",
        right: "49.5%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        marginTop: "-0.5vw",
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
          mb: { xs: 4, md: 6 },
          px: { xs: 2, md: 5 },
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 },
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} flexDirection={{ xs: 'column', md: 'row' }}>
          <Box sx={{
            width: { xs: 150, md: 200 },
            height: { xs: 70, md: 90 },
            position: 'relative',
            animation: 'fadeInUp 1s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}>
            <Image src={logo} alt="MedTrack PK Logo" fill style={{ objectFit: 'contain' }} />
          </Box>
          <Box textAlign={{ xs: 'center', md: 'left' }}>
            <Typography
              fontSize={{ xs: 20, md: 24 }}
              fontWeight="bold"
              sx={{
                animation: 'fadeInUp 1s ease-out 0.2s both',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              MedTrack PK
            </Typography>
            <Typography
              fontSize={{ xs: 12, md: 15 }}
              variant="caption"
              sx={{
                opacity: 0.8,
                animation: 'fadeInUp 1s ease-out 0.4s both',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              Medicine Availability Tracker
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} flexDirection={{ xs: 'column', md: 'row' }}>
          <Link href="/pharmacy-login" passHref>
            <Button
              sx={{
                color: "#FFFFFFE6",
                fontSize: { xs: "12px", md: "14px" },
                fontFamily: "plus-jakarta-sans, sans-serif",
                padding: { xs: "8px 12px", md: "10px 16px" },
                bgcolor: { xs: "rgba(255,255,255,0.2)", md: "transparent" },
                border: { xs: "1px solid rgba(255,255,255,0.5)", md: "none" },
                ":hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              For Pharmacies
            </Button>
          </Link>
          <Chip
            icon={<LocationOnIcon />}
            label="Pakistan"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
              fontSize: { xs: 12, md: 14 },
              fontFamily: "plus-jakarta-sans, sans-serif",
              backgroundColor: "#FFFFFF33",
              padding: { xs: "16px 12px", md: "20px 16px" },
              ":hover": { backgroundColor: "#FFFFFF55" },
            }}
          />
        </Box>
      </Box>

      {/* 🔹 Center Content */}
      <Box textAlign="center" maxWidth={800} mx="auto" px={{ xs: 2, md: 0 }}>
        <Chip
          icon={<FiberManualRecordIcon />}
          label="Tracking 500+ pharmacies across Pakistan"
          sx={{
            mb: 3,
            bgcolor: "rgba(255,255,255,0.15)",
            fontSize: { xs: 12, md: 14 },
            fontFamily: "plus-jakarta-sans, sans-serif",
            padding: { xs: "6px 12px", md: "8px 16px" },
            color: "#FFFFFFE6",
          }}
        />

        <Typography
          variant="h3"
          fontWeight="bold"
          mb={2}
          sx={{
            fontSize: { xs: 32, md: 48 },
            color: "#FFFFFF",
            fontFamily: "plus-jakarta-sans, sans-serif",
            animation: 'fadeInUp 1s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          Find Medicines Near You
        </Typography>

        <Typography sx={{
          opacity: 0.9, mb: 6,
          color: "#CCFBF1",
          fontFamily: "plus-jakarta-sans, sans-serif",
          margin: { xs: '0 16px 40px', md: '0 96px 40px' },
          fontSize: { xs: '14px', md: '16px' },
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
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: { xs: -100, md: -90 },
          width: { xs: "95%", md: "90%" },
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 10,
            transform: 'translateX(-50%) translateY(-5px)',
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 1000,
            mx: "auto",
            display: "flex",
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            borderRadius: 50,
          }}
        >
          <TextField
            autoFocus
            fullWidth
            placeholder="Search medicine"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: '#666' }} />
              ),
              endAdornment: searchTerm && (
                <IconButton onClick={() => setSearchTerm("")} sx={{ p: 0 }}>
                  <ClearIcon sx={{ color: '#666' }} />
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 50,
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#0d9488',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0d9488',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0d9488',
              },
              '& .MuiInputBase-input': {
                color: 'black',
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Select City / Area"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setCityError(false);
            }}
            error={cityError}
            helperText={cityError ? "Please select a city" : ""}
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
            onClick={handleSearch}
            sx={{
              px: 5,
              borderRadius: 20,
              bgcolor: "#0d9488",
              "&:hover": { bgcolor: "#0f766e" },
              transition: 'all 0.3s ease',
              '&:active': {
                transform: 'scale(0.95)',
              },
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
              <Chip
                key={item}
                label={item}
                variant="outlined"
                onClick={() => setSearchTerm(item)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>

  );
}