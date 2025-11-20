import React from 'react';
import { MoodOption } from '../types';

interface MoodSelectorProps {
  onSelect: (mood: MoodOption) => void;
}

const MOODS: MoodOption[] = [
  { id: 'casual', label: '隨便吃吃', emoji: '🍜', promptMod: 'affordable, quick, casual local food, tasty but simple', color: 'bg-orange-500' },
  { id: 'fancy', label: '有點儀式感', emoji: '🍷', promptMod: 'upscale, nice ambiance, good for a date or treat, slightly expensive', color: 'bg-purple-500' },
  { id: 'healthy', label: '健康清爽', emoji: '🥗', promptMod: 'healthy, light, salads, poke bowls, or clean eating', color: 'bg-green-500' },
  { id: 'comfort', label: '療癒美食', emoji: '🍔', promptMod: 'comfort food, fried chicken, burgers, pizza, rich flavors', color: 'bg-yellow-500' },
  { id: 'group', label: '朋友聚餐', emoji: '🍻', promptMod: 'good for groups, izakaya, hot pot, or sharing plates, lively atmosphere', color: 'bg-blue-500' },
  { id: 'cafe', label: '文青咖啡', emoji: '☕', promptMod: 'cafe serving dinner, quiet, aesthetic, good for reading or talking', color: 'bg-stone-500' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">今晚想來點什麼？</h2>
      <p className="text-gray-400 text-center mb-8">選擇一種感覺，讓我們為你推薦</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood)}
            className={`${mood.color} hover:brightness-110 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg group border border-white/10`}
          >
            <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
              {mood.emoji}
            </span>
            <span className="font-bold text-white text-lg tracking-wide">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;