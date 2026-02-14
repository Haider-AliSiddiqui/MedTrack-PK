"use client";
import { Typography, Card, CardContent, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';

export default function HowItWorks() {
    return (
        <Box sx={{
            textAlign: "center",
            padding: { xs: 2, md: 4 },
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            py: { xs: 4, md: 8 },
            mt: { xs: 8, md: 10 }
        }}>
            <Typography
                variant="h3"
                fontWeight="bold"
                mb={4}
                sx={{
                    fontSize: { xs: 28, sm: 36, md: 48 },
                    marginTop: { xs: "50px", md: "100px" },
                    color: "#1e293b",
                    fontFamily: "plus-jakarta-sans, sans-serif",
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 1s ease-out',
                    '@keyframes fadeInUp': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                How It Works
            </Typography>

            <Typography sx={{
                opacity: 0.9, mb: 6,
                color: "#475569",
                fontFamily: "plus-jakarta-sans, sans-serif",
                margin: { xs: '0 16px 40px', md: '0 96px 40px' },
                fontSize: { xs: '14px', md: '18px' },
                lineHeight: 1.6,
                animation: 'fadeInUp 1s ease-out 0.2s both',
            }}
            >
                Check real-time medicine availability at pharmacies in your area during shortages
            </Typography>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: 2, md: 4 },
                mt: 4,
                px: { xs: 2, md: 0 }
            }}>
                <Box sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 250px" },
                    maxWidth: { xs: "100%", md: "320px" },
                    animation: 'fadeInUp 1s ease-out 0.4s both',
                }}>
                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: { xs: 1.5, md: 2 },
                        transition: 'all 0.3s ease',
                        border: '1px solid #e2e8f0',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        '&:hover': {
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transform: 'translateY(-8px)',
                        }
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                mx: 'auto'
                            }}>
                                <SearchIcon sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
                            <Typography variant="h5" component="div" sx={{
                                color: "#1e293b",
                                fontFamily: "plus-jakarta-sans, sans-serif",
                                fontSize: { xs: "18px", md: "20px" },
                                fontWeight: "bold",
                                mb: 1
                            }}>
                                Search Medicine
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: { xs: '14px', md: '16px' },
                                lineHeight: 1.5
                            }}>
                               Enter the medicine name you&apos;re looking for and select your city.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 250px" },
                    maxWidth: { xs: "100%", md: "320px" },
                    animation: 'fadeInUp 1s ease-out 0.6s both',
                }}>
                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: { xs: 1.5, md: 2 },
                        transition: 'all 0.3s ease',
                        border: '1px solid #e2e8f0',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        '&:hover': {
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transform: 'translateY(-8px)',
                        }
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                mx: 'auto'
                            }}>
                                <CheckCircleIcon sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
                            <Typography variant="h5" component="div" sx={{
                                color: "#1e293b",
                                fontFamily: "plus-jakarta-sans, sans-serif",
                                fontSize: { xs: "18px", md: "20px" },
                                fontWeight: "bold",
                                mb: 1
                            }}>
                                Check Availability
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: { xs: '14px', md: '16px' },
                                lineHeight: 1.5
                            }}>
                                See real-time stock status at pharmacies near you.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 250px" },
                    maxWidth: { xs: "100%", md: "320px" },
                    animation: 'fadeInUp 1s ease-out 0.8s both',
                }}>
                    <Card sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: { xs: 1.5, md: 2 },
                        transition: 'all 0.3s ease',
                        border: '1px solid #e2e8f0',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        '&:hover': {
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transform: 'translateY(-8px)',
                        }
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                mx: 'auto'
                            }}>
                                <PhoneIcon sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
                            <Typography variant="h5" component="div" sx={{
                                color: "#1e293b",
                                fontFamily: "plus-jakarta-sans, sans-serif",
                                fontSize: { xs: "18px", md: "20px" },
                                fontWeight: "bold",
                                mb: 1
                            }}>
                               Contact Pharmacy
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: { xs: '14px', md: '16px' },
                                lineHeight: 1.5
                            }}>
                               Call or WhatsApp the pharmacy directly to confirm and purchase.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
