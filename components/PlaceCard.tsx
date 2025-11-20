import React from 'react';
import { GroundingChunk } from '../types';

interface PlaceCardProps {
  chunk: GroundingChunk;
  index: number;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ chunk, index }) => {
  const mapData = chunk.maps;
  
  if (!mapData || !mapData.title) return null;

  // Extract review snippet if available
  const review = mapData.placeAnswerSources?.reviewSnippets?.[0]?.content;

  // Generate a deterministic placeholder image based on index
  const bgImage = `https://picsum.photos/400/200?random=${index + 10}`;

  return (
    <a 
      href={mapData.uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
    >
      <div className="h-32 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <img 
          src={bgImage} 
          alt="Restaurant Ambience" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-3 left-3 z-20">
           <h3 className="text-xl font-bold text-white leading-tight">{mapData.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
          </span>
          <span className="text-sm text-blue-200 font-medium">在 Google 地圖上查看</span>
        </div>

        {review && (
          <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-300 italic border-l-2 border-primary">
            "{review.length > 60 ? review.substring(0, 60) + '...' : review}"
          </div>
        )}
      </div>
    </a>
  );
};

export default PlaceCard;