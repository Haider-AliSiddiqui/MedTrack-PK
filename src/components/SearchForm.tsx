"use client";

import React from "react";
import { Box, Button, Card, TextField, MenuItem } from "@mui/material";

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchForm({ searchTerm, setSearchTerm }: SearchFormProps) {
  const [city, setCity] = React.useState("");

  const handleSearch = () => {
    console.log("Search:", searchTerm, "City:", city);
    // Later: Firebase integration
  };

  return (
    <Box>
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          label="Medicine name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ mb: 3 }}
        >
          <MenuItem value="Karachi">Karachi</MenuItem>
          <MenuItem value="Lahore">Lahore</MenuItem>
          <MenuItem value="Islamabad">Islamabad</MenuItem>
        </TextField>

        <Button variant="contained" fullWidth onClick={handleSearch}>
          Search Medicine
        </Button>
      </Card>
    </Box>
  );
}
