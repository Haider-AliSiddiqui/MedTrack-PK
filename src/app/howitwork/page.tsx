"use client";
import { Typography, Card, CardContent, Box, Grid } from "@mui/material";

export default function HowItWorks() {
    return (
        <Box sx={{ textAlign: "center", padding: { xs: 2, md: 4 } }}>
            <Typography
                variant="h3"
                fontWeight="bold"
                mb={4}
                sx={{
                    fontSize: { xs: 32, md: 48 },
                    marginTop: { xs: "100px", md: "150px" },
                    color: "black",
                    fontFamily: "plus-jakarta-sans, sans-serif",
                }}
            >
                How It Works
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
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'translateY(-5px)'
                        }
                    }}>
                        <CardContent>
                            <Typography variant="h2" color="primary" gutterBottom>
                                1
                            </Typography>
                            <Typography variant="h4" component="div" sx={{
                                color: "rgb(30, 41, 59)",
                                fontFamily: "plus-jakarta-sans, sans-serif",
                                fontSize: "20px",
                                fontWeight: "bold",
                            }} gutterBottom>
                                Search Medicine
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                               Enter the medicine name you're looking for and select your city.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'translateY(-5px)'
                        }
                    }}>
                        <CardContent>
                            <Typography variant="h2" color="primary" gutterBottom>
                                2
                            </Typography>
                            <Typography variant="h5" component="div" sx={{
                                color: "rgb(30, 41, 59)",
                                fontFamily: "plus-jakarta-sans, sans-serif",
                                fontSize: "20px",
                                fontWeight: "bold",
                            }} gutterBottom>
                                Check Availability
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                View real-time availability at nearby pharmacies.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'translateY(-5px)'
                        }
                    }}>
                        <CardContent>
                            <Typography variant="h2" color="primary" gutterBottom>
                                3
                            </Typography>
                            <Typography variant="h5" component="div" sx={{
                                color: "rgb(30, 41, 59)",
                                fontFamily: "plus-jakarta-sans, sans-serif",
                                fontSize: "20px",
                                fontWeight: "bold",
                            }} gutterBottom>
                                Purchase
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Complete your purchase securely and conveniently.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
