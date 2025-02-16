'use client';

import { useEffect, useState } from 'react';
import { PinContainer } from './Pin';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from './TextGenerate';

interface Track {
  album: {
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
  };
  name: string;
  artists: { name: string }[];
}

interface AnalysisResponse {
  success: boolean;
  data: {
    vibeAnalysis: string;
    roomCuration: string;
  };
}

export default function SpotifyAlbumDemo() {
  const [track, setTrack] = useState<Track | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchTrackAndAnalysis = async () => {
      try {
        const trackResponse = await fetch('/api/spotify/featured-track');
        const trackData = await trackResponse.json();
        setTrack(trackData);

        const analysisResponse = await fetch('/api/spotify/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: 'demo_token' }),
        });
        const analysisData: AnalysisResponse = await analysisResponse.json();
        setAnalysis(analysisData.data.vibeAnalysis);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackAndAnalysis();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!track) {
    return null;
  }

  return (
    <div className="h-[40rem] w-full flex items-center justify-center relative">
      <motion.div
        animate={{
          x: isHovered ? -200 : 0,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <PinContainer
          title="Vibe Analysis"
          className="w-[288px]"
          containerClassName="w-[288px]"
        >
          <div className="flex flex-col gap-2">
            <img
              src={track.album.images[0].url}
              alt={`${track.name} album artwork`}
              width={288}
              height={288}
              className="rounded-lg"
            />
            <div className="flex flex-col text-white">
              <h3 className="font-bold text-lg">{track.name}</h3>
              <p className="text-sm opacity-70">{track.artists[0].name}</p>
            </div>
          </div>
        </PinContainer>
      </motion.div>

      <motion.div
        className="absolute left-[calc(50%-0px)] top-1/2 -translate-y-1/2 max-w-[550px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          transition: { duration: 0.2 }
        }}
      >
        {isHovered && analysis && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-black">AI Analysis</h2>
            <TextGenerateEffect 
              words={analysis}
              className="text-lg"
              duration={0.5}
            />
          </>
        )}
      </motion.div>
    </div>
  );
} 