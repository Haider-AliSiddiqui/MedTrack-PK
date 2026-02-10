import { Box, Paper, Typography } from "@mui/material";
import { Medicine } from "../lib/firestore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";

interface StatsCardsProps {
  medicines?: Medicine[];
}

// Define icons outside to avoid recreation
const totalIcon = <WarningIcon sx={{ fontSize: 40, color: "#1976d2" }} />;
const availableIcon = <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50" }} />;
const outOfStockIcon = <CancelIcon sx={{ fontSize: 40, color: "#f44336" }} />;
const lowStockIcon = <WarningIcon sx={{ fontSize: 40, color: "#ff9800" }} />;

/*  Move StatCard outside to avoid recreation on render */
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      minWidth: { xs: 140, md: 180 },
      textAlign: "center",
      borderRadius: 3,
      border: `2px solid ${color}`,
      bgcolor: `${color}10`, // light background
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
      {icon}
    </Box>
    <Typography variant="subtitle1" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold" color={color}>
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
  const lowStock = medicines.filter(
    (m) => m.status === "Low"
  ).length;

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 2, md: 3 },
        justifyContent: "center",
        flexWrap: "wrap",
        mt: 2,
        mb: 4,
      }}
    >
      <StatCard
        title="Total Medicines"
        value={total}
        icon={totalIcon}
        color="#1976d2"
      />
      <StatCard
        title="Available"
        value={available}
        icon={availableIcon}
        color="#4caf50"
      />
      <StatCard
        title="Out of Stock"
        value={outOfStock}
        icon={outOfStockIcon}
        color="#f44336"
      />
      <StatCard
        title="Low Stock"
        value={lowStock}
        icon={lowStockIcon}
        color="#ff9800"
      />
    </Box>
  );
}


