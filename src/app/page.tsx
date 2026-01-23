"use client";

import { useState } from "react";
import HeroSection from "../components/HeroSection";
import SearchResults from "../components/SearchResults";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <SearchResults searchTerm={searchTerm} />
    </>
  );
}
