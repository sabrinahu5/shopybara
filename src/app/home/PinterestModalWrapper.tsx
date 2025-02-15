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
      fetch('/api/pinterest/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pinterestUrl })
      })
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error saving Pinterest URL:', error);
      });
    } else {
      setShowModal(false);
    }
  };

  return <PinterestModal isOpen={showModal} onClose={handleModalClose} />;
} 