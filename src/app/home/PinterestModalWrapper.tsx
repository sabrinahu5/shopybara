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

  const handleModalClose = async (pinterestUrl?: string) => {
    if (pinterestUrl) {
      try {
        const spotifyToken = localStorage.getItem('spotifyToken');
        
        if (!spotifyToken) {
          throw new Error('No Spotify token found');
        }

        // Fetch both analyses in parallel
        const [pinterestResponse, spotifyResponse] = await Promise.all([
          fetch('/api/pinterest/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: pinterestUrl })
          }),
          fetch('/api/spotify/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: spotifyToken })
          })
        ]);

        const [pinterestData, spotifyData] = await Promise.all([
          pinterestResponse.json(),
          spotifyResponse.json()
        ]);

        const combinedResponse = await fetch('/api/combine-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spotifyData: spotifyData.data,
            pinterestData: pinterestData.data
          })
        });

        const finalAnalysis = await combinedResponse.json();
        console.log('Combined Analysis:', finalAnalysis);
        setShowModal(false);
      } catch (error) {
        console.error('Error processing analyses:', error);
      }
    } else {
      setShowModal(false);
    }
  };

  return <PinterestModal isOpen={showModal} onClose={handleModalClose} />;
} 