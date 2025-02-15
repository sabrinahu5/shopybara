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
      // Only analyze the Pinterest board
      fetch('/api/pinterest/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pinterestUrl })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Pinterest Analysis Response:', data);
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error processing Pinterest board:', error);
      });
    } else {
      setShowModal(false);
    }
  };

  return <PinterestModal isOpen={showModal} onClose={handleModalClose} />;
} 