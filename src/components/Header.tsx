"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../images/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Code IDE", href: "/code-ide" },
    { label: "Simulation", href: "/simulation" },
    { label: "Export", href: "/export" },
    { label: user ? "Dashboard" : "Login", href: user ? "/pharmacydashboard" : "/pharmacy-login" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(13, 148, 136, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%", px: { xs: 2, md: 3 } }}>
        {/* Logo */}
        <Link href="/" passHref style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.02)",
                transition: "transform 0.2s ease",
              },
            }}
          >
            <Box sx={{ width: { xs: 40, md: 50 }, height: { xs: 20, md: 25 }, position: "relative" }}>
              <Image src={logo} alt="MedTrack PK Logo" fill style={{ objectFit: "contain" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "16px", md: "20px" },
              }}
            >
              MedTrack PK
            </Typography>
          </Box>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} passHref>
                <Button
                  sx={{
                    color: "#1e293b",
                    fontWeight: 500,
                    fontSize: "14px",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(13, 148, 136, 0.08)",
                      color: "#0d9488",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(13, 148, 136, 0.15)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{
                color: "#1e293b",
                "&:hover": {
                  backgroundColor: "rgba(13, 148, 136, 0.08)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(13, 148, 136, 0.1)",
                },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={handleClose}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(13, 148, 136, 0.08)",
                    },
                  }}
                >
                  <Link href={item.href} passHref style={{ textDecoration: "none", color: "inherit", width: "100%" }}>
                    <Typography sx={{ fontWeight: 500 }}>{item.label}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
