'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PinterestModal from '../ui/Home/PinterestModal';

export default function PinterestModalWrapper() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isNewUser = searchParams.get('newUser') === 'true';
    if (isNewUser) {
      setShowModal(true);
    }
  }, [searchParams]);

  const handleModalClose = (pinterestUrl?: string) => {
    if (pinterestUrl) {
      // First, analyze the Pinterest board
      fetch('/api/pinterest/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pinterestUrl })
      })
      .then(response => response.json())
      .then(pinterestData => {
        // Get the Spotify analysis from localStorage (saved during onboarding)
        const spotifyData = JSON.parse(localStorage.getItem('spotifyAnalysis') || '{}');
        
        // Combine both analyses
        return fetch('/api/combine-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spotifyData,
            pinterestData: pinterestData.data
          })
        });
      })
      .then(response => response.json())
      .then(finalAnalysis => {
        console.log('Combined Analysis:', finalAnalysis);
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error processing analyses:', error);
      });
    } else {
      setShowModal(false);
    }
  };

  return <PinterestModal isOpen={showModal} onClose={handleModalClose} />;
} 