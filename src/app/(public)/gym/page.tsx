'use client';

import { useEffect, useState } from 'react';
import { Lock, Check, Star, Play } from 'lucide-react'; // 記得安裝 lucide-react

interface GymNode {
  gymId: number;
  name: string;
  status: 'LOCKED' | 'OPEN' | 'PASSED';
  stars: number; // 0 ~ 3
}

export default function GymMapPage() {
  const [gyms, setGyms] = useState<GymNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 呼叫後端 API (這裡用 fetch，如果你有 Axios 也可用)
    fetch('http://localhost:8080/api/gyms')
      .then(res => res.json())
      .then(data => {
        setGyms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch gyms:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">軟體設計模式精通之旅</h1>
        <p className="text-gray-400">挑戰地圖 - 驗證你的學習成果</p>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* 中央連接線 */}
        <div className="absolute left-8 top-4 bottom-4 w-1 bg-gray-800 rounded-full md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-8">
          {loading ? <div className="text-white text-center">載入地圖中...</div> : gyms.map((gym, index) => {
            const isRight = index % 2 === 0; // 左右交錯排列 (僅限桌機版)
            
            return (
              <div key={gym.gymId} className={`relative flex items-center md:justify-between ${isRight ? 'md:flex-row-reverse' : ''}`}>
                
                {/* 1. 狀態節點 (圓圈) */}
                {/* 手機版固定在左側，桌機版在中間 */}
                <div className={`
                  absolute left-8 -translate-x-1/2 z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg
                  md:left-1/2 
                  ${gym.status === 'PASSED' ? 'bg-green-500 border-green-600 text-white' : 
                    gym.status === 'OPEN' ? 'bg-yellow-400 border-yellow-500 text-black animate-pulse' : 
                    'bg-gray-800 border-gray-700 text-gray-500'}
                `}>
                  {gym.status === 'PASSED' && <Check size={20} strokeWidth={3} />}
                  {gym.status === 'OPEN' && <Play size={20} fill="currentColor" />}
                  {gym.status === 'LOCKED' && <Lock size={18} />}
                </div>

                {/* 2. 內容卡片 */}
                {/* 加上 pl-20 讓出左側空間給圓圈 (手機版) */}
                <div className={`w-full pl-20 md:pl-0 md:w-[45%] ${isRight ? 'md:text-left' : 'md:text-right'}`}>
                  <div className={`
                    p-5 rounded-lg border transition-all duration-300
                    ${gym.status === 'LOCKED' 
                      ? 'bg-gray-900/50 border-gray-800 opacity-50 cursor-not-allowed' 
                      : 'bg-[#1e1f24] border-gray-700 hover:border-yellow-400 cursor-pointer shadow-md hover:shadow-yellow-400/10 hover:-translate-y-1'}
                  `}>
                    <div className={`flex flex-col gap-2 ${isRight ? 'items-start' : 'md:items-end items-start'}`}>
                      <h3 className="font-bold text-lg text-white">{gym.name}</h3>
                      
                      {/* 星星顯示區 */}
                      {gym.status === 'PASSED' && (
                        <div className="flex gap-1">
                          {[1, 2, 3].map((star) => (
                            <Star 
                              key={star} 
                              size={16} 
                              className={star <= gym.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} 
                            />
                          ))}
                        </div>
                      )}
                      
                      {gym.status === 'OPEN' && (
                        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                          可挑戰
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. 空白佔位 (為了讓 Flex 左右平衡) */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}