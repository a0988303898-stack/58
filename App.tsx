import React, { useState, useEffect } from 'react';
import { GeoLocation, AppStep, MoodOption, GeminiResult } from './types';
import { fetchDinnerRecommendations } from './services/geminiService';
import MoodSelector from './components/MoodSelector';
import PlaceCard from './components/PlaceCard';
import Loading from './components/Loading';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [result, setResult] = useState<GeminiResult | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);

  // Handle Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("您的瀏覽器不支援地理位置功能。");
      setStep(AppStep.ERROR);
      return;
    }

    setStep(AppStep.LOCATION_PERMISSION);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setStep(AppStep.MOOD_SELECTION);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "無法取得您的位置。";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "請允許存取位置資訊以尋找附近餐廳。";
        }
        setErrorMsg(msg);
        setStep(AppStep.ERROR);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Mood Selection & API Call
  const handleMoodSelect = async (mood: MoodOption) => {
    if (!location) return;
    
    setSelectedMood(mood);
    setStep(AppStep.LOADING);
    
    try {
      const data = await fetchDinnerRecommendations(location, mood.promptMod);
      setResult(data);
      setStep(AppStep.RESULTS);
    } catch (err) {
      console.error(err);
      setErrorMsg("AI 連線發生錯誤，請稍後再試。");
      setStep(AppStep.ERROR);
    }
  };

  const resetApp = () => {
    setStep(AppStep.MOOD_SELECTION);
    setResult(null);
    setErrorMsg('');
  };

  // Markdown-ish renderer for the main text (simple line breaks)
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2 leading-relaxed text-gray-200">
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white font-sans selection:bg-primary selection:text-white pb-20">
      
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-slate-900/80">
        <div className="flex items-center gap-2" role="button" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-lg shadow-lg shadow-primary/50">
            🍴
          </div>
          <h1 className="font-bold text-xl tracking-tight">Dinner Vibe</h1>
        </div>
        {step === AppStep.RESULTS && (
           <button 
             onClick={resetApp}
             className="text-sm text-gray-400 hover:text-white transition-colors"
           >
             重選心情
           </button>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-[80vh]">
        
        {/* Step 1: Landing */}
        {step === AppStep.LANDING && (
          <div className="text-center flex flex-col items-center animate-fade-in mt-10 md:mt-20">
            <div className="relative mb-8 group cursor-pointer" onClick={handleGetLocation}>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-700 group-hover:scale-105 transition-transform">
                📍
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              晚餐吃什麼？
            </h2>
            <p className="text-lg text-gray-400 max-w-md mb-10">
              不知道該吃什麼嗎？讓我們根據你的位置和心情，推薦最適合你的餐廳。
            </p>
            <button
              onClick={handleGetLocation}
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
            >
              <span>開啟定位開始探索</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        {/* Step 2: Permission Wait */}
        {step === AppStep.LOCATION_PERMISSION && (
          <div className="text-center mt-20 animate-pulse">
             <h3 className="text-2xl font-bold">正在取得位置...</h3>
             <p className="text-gray-400">請在瀏覽器提示中點擊「允許」</p>
          </div>
        )}

        {/* Step 3: Mood Selection */}
        {step === AppStep.MOOD_SELECTION && (
          <MoodSelector onSelect={handleMoodSelect} />
        )}

        {/* Step 4: Loading */}
        {step === AppStep.LOADING && (
          <Loading />
        )}

        {/* Step 5: Results */}
        {step === AppStep.RESULTS && result && (
          <div className="w-full max-w-6xl animate-fade-in">
            
            {/* AI Commentary Section */}
            <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 md:p-10 mb-12 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                  🤖
                </div>
                <h2 className="text-2xl font-bold text-white">AI 美食嚮導建議</h2>
              </div>
              <div className="prose prose-invert max-w-none text-lg text-gray-300">
                {renderText(result.text)}
              </div>
            </div>

            {/* Map Cards Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-6 pl-2 border-l-4 border-secondary flex items-center gap-2">
                <span>📍</span>
                <span>探索地點</span>
              </h3>
              
              {result.places && result.places.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.places.map((place, idx) => (
                    <PlaceCard key={idx} chunk={place} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white/5 rounded-xl border border-dashed border-white/20">
                  <p className="text-gray-400">AI 提供了建議，但沒有返回具體的地圖資料卡片。請參考上方的文字說明。</p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-12">
               <button 
                 onClick={resetApp}
                 className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-gray-300 flex items-center gap-2"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                 </svg>
                 再找一次
               </button>
            </div>
          </div>
        )}

        {/* Step 6: Error */}
        {step === AppStep.ERROR && (
          <div className="text-center mt-20 max-w-md bg-red-500/10 p-8 rounded-2xl border border-red-500/30">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">發生錯誤</h3>
            <p className="text-gray-300 mb-6">{errorMsg}</p>
            <button 
              onClick={() => setStep(AppStep.LANDING)}
              className="px-6 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              重試
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;