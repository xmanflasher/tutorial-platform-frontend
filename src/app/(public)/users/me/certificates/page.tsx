'use client';

import React, { useEffect, useState } from 'react';
import { achievementService } from '@/services';
import { Certificate } from '@/types';
import { Award, ExternalLink, ShieldCheck, Search } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useJourney } from '@/context/JourneyContext';

/**
 * 證書畫廊頁面 (Private Profile)
 * 展示學員獲得的所有 Journey 結業證書
 */
export default function CertificatesPage() {
    const { activeJourney } = useJourney();
    const { setIsLoading } = useLoading();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        achievementService.getMyAchievements()
            .then(data => setCertificates(data.certificates))
            .catch(err => console.error("Failed to load certificates", err))
            .finally(() => {
                setLoading(false);
                setIsLoading(false);
            });
    }, [setIsLoading]);

    if (loading) return null;

    if (certificates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-card/20 rounded-3xl border border-dashed border-border-ui text-center animate-fadeIn">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Award size={40} className="text-gray-700 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">尚未獲得證書</h3>
                <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                    完成一個 Journey 的所有道館挑戰即可獲得結業證書。證書具備區塊鏈級別的防偽驗證，助您在求職市場脫穎而出。
                </p>
                <Link 
                    href={activeJourney ? `/journeys/${activeJourney.slug}/roadmap` : "/journeys"} 
                    className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all border border-white/5"
                >
                    開始挑戰
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        CERTIFICATE GALLERY
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">您在 Waterball Academy 取得的專業認證</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Securely Verified
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificates.map((cert, index) => (
                    <motion.div 
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-[#1e1f24]/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 shadow-2xl"
                    >
                        {/* Interactive gradient edge */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        <div className="p-8 lg:p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Award className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Verify Code</p>
                                    <p className="text-[11px] font-mono text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">{cert.verificationCode}</p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                                    {cert.metadata.journeyName}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">結業證書 • Certificate of Completion</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                <div className="text-xs text-gray-500">
                                    Issued: <span className="text-gray-400 font-bold">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                                </div>
                                <Link 
                                    href={`/verify/${cert.verificationCode}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-500/0 hover:shadow-indigo-500/20"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    驗證真實性
                                </Link>
                            </div>
                        </div>

                        {/* Background watermark */}
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                            <Award size={160} className="text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}