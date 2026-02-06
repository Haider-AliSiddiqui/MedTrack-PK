import { Box, Paper, Typography } from "@mui/material";
import { Medicine } from "../lib/firestore";

interface StatsCardsProps {
  medicines?: Medicine[];
}

/* ✅ Rename Card → StatCard */
const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      minWidth: 180,
      textAlign: "center",
      borderRadius: 3,
    }}
  >
    <Typography variant="subtitle1" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

export default function StatsCards({ medicines = [] }: StatsCardsProps) {
  const total = medicines.length;
  const available = medicines.filter(
    (m) => m.status === "Available"
  ).length;
  const outOfStock = medicines.filter(
    (m) => m.status === "Out of Stock"
  ).length;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        justifyContent: "center",
        flexWrap: "wrap",
        mt: -6,
        mb: 6,
      }}
    >
      <StatCard title="Total Medicines" value={total} />
      <StatCard title="Available" value={available} />
      <StatCard title="Out of Stock" value={outOfStock} />
    </Box>
  );
}

// abhi bhi wohi error a raha hai k 
// cannot create commponent during render commponent create during render will reset their state each time they are created ..... agy or bhi hai
