"use client";
import { Typography, Card, CardContent, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function HowItWorks() {
    return (
        <Box sx={{ textAlign: "center", padding: 4 }}>
            <Typography
                variant="h3"
                fontWeight="bold"
                mb={4}
                sx={{
                    fontSize: 48,
                    marginTop: "150px",
                    color: "black",
                    fontFamily: "plus-jakarta-sans, sans-serif",
                }}
            >
                How It Works
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
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
                <Grid xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
                        <CardContent>
                            <Typography variant="h2" color="primary" gutterBottom>
                                2
                            </Typography>
                            <Typography variant="h5" component="div" sx={{}} gutterBottom>
                                Search Medicines
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Find the medicines you need quickly and easily.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
                        <CardContent>
                            <Typography variant="h2" color="primary" gutterBottom>
                                3
                            </Typography>
                            <Typography variant="h5" component="div" gutterBottom>
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
