"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PinterestModal from "../ui/LandingPage/PinterestModal";

export default function PinterestModalWrapper() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isNewUser = searchParams.get("newUser") === "true";
    if (isNewUser) {
      setShowModal(true);
    }
  }, [searchParams]);

  const handleModalClose = async (pinterestUrl?: string) => {
    if (pinterestUrl) {
      try {
        // Get Pinterest analysis
        const pinterestResponse = await fetch("/api/pinterest/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: pinterestUrl }),
        });
        const pinterestData = await pinterestResponse.json();

        // Get Spotify analysis with demo token
        const spotifyResponse = await fetch("/api/spotify/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: "demo_token" }),
        });
        const spotifyData = await spotifyResponse.json();

        // Combine both analyses
        const combinedResponse = await fetch("/api/combine-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spotifyData: spotifyData.data,
            pinterestData: pinterestData.data,
          }),
        });

        setShowModal(false);
      } catch (error) {
        console.error("Error processing analyses:", error);
      }
    } else {
      setShowModal(false);
    }
  };

  return <PinterestModal isOpen={showModal} onClose={handleModalClose} />;
}
