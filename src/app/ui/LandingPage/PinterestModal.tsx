'use client';

import { useState } from 'react';

interface PinterestModalProps {
  isOpen: boolean;
  onClose: (pinterestUrl?: string) => void;
}

export default function PinterestModal({ isOpen, onClose }: PinterestModalProps) {
  const [pinterestUrl, setPinterestUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose(pinterestUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Add Your Pinterest Board
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          To personalize your experience, please add a link to your Pinterest board that represents your room style inspiration.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={pinterestUrl}
            onChange={(e) => setPinterestUrl(e.target.value)}
            placeholder="https://pinterest.com/username/board-name"
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white rounded-lg py-3 hover:bg-teal-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
} 