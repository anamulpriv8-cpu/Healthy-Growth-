
import React, { useState, useRef, useEffect } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodItem } from '../types';

interface ScannerProps {
  onFoodLogged: (foods: FoodItem[]) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onFoodLogged }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setPreview(null);
        setResults([]);
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Could not access camera. Please use file upload.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPreview(dataUrl);
        stopCamera();
        processImage(dataUrl.split(',')[1], 'image/jpeg');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreview(reader.result as string);
      processImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string, mimeType: string) => {
    setLoading(true);
    try {
      const items = await analyzeFoodImage(base64, mimeType);
      const itemsWithIds = items.map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setResults(itemsWithIds);
    } catch (error) {
      console.error(error);
      alert('Problem analyzing food.');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = () => {
    onFoodLogged(results);
    setResults([]);
    setPreview(null);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-black text-gray-800">Smart Scan</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Real-time Calorie Engine</p>
      </header>

      <div className="relative w-full h-80 rounded-[3rem] overflow-hidden bg-black shadow-2xl group border-4 border-white">
        {isCameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white/50">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-widest">Camera Offline</p>
          </div>
        )}

        {/* Camera Controls Overlaid */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
          {!isCameraActive && !loading && (
            <button 
              onClick={startCamera}
              className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              Open Camera
            </button>
          )}
          {isCameraActive && (
            <button 
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-emerald-500 active:scale-90 transition-all"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-full"></div>
            </button>
          )}
        </div>
        
        {!isCameraActive && !preview && !loading && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*" 
      />

      {loading && (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin"></div>
          <p className="text-emerald-600 font-black text-xs uppercase tracking-widest animate-pulse">Deep AI Analysis...</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="bg-white rounded-[2.5rem] p-7 shadow-xl border border-emerald-50 space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-800">Detected Nutrients</h3>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Verified</span>
          </div>
          <div className="space-y-4">
            {results.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-black text-gray-800 text-lg">{item.name}</p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase">Estimated {item.portion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-800">{item.calories}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Kcal</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-2 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Prot</p>
                    <p className="font-black text-blue-500">{item.protein}g</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Carb</p>
                    <p className="font-black text-orange-500">{item.carbs}g</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Fats</p>
                    <p className="font-black text-pink-500">{item.fats}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleLog}
            className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm shadow-xl hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            Add to Journal
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
