import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-200"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
          🍽️
        </div>
      </div>
      <h3 className="text-xl font-bold text-white animate-pulse">正在搜尋附近美食...</h3>
      <p className="text-gray-400 mt-2">AI 正在翻閱地圖評價</p>
    </div>
  );
};

export default Loading;