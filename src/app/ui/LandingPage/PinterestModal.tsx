'use client';

import { useState } from 'react';
import Loader from './Loader';

interface PinterestModalProps {
  isOpen: boolean;
  onClose: (pinterestUrl?: string) => void;
}

export default function PinterestModal({ isOpen, onClose }: PinterestModalProps) {
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call onClose with the Pinterest URL
      await onClose(pinterestUrl);
    } catch (error) {
      console.error('Error processing Pinterest URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <>
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
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-0.5 border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
                  Continue
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 