

import { AuthProvider } from "../context/AuthContext";
import Head from "next/head";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedTrack PK",
  description: "Online Medicine Tracking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>MedTrack PK</title>
      </Head>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
