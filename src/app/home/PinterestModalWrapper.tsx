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
