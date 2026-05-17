'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { achievementService } from '@/services';
import { Certificate } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, ShieldCheck, Calendar, User, BookOpen } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

/**
 * 證書查驗頁面 (Public)
 * 提供第三方驗證學員結業資格
 */
export default function VerifyPage() {
    const params = useParams();
    const code = params.code as string;
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { setIsLoading } = useLoading();

    useEffect(() => {
        if (code) {
            setIsLoading(true);
            achievementService.verifyCertificate(code)
                .then(setCertificate)
                .catch(() => setError(true))
                .finally(() => {
                    setLoading(false);
                    setIsLoading(false);
                });
        }
    }, [code, setIsLoading]);

    if (loading) return null;

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">驗證失敗</h1>
                <p className="text-slate-400 max-w-md">找不到此驗證碼對應的證書，請確認驗證連結是否正確。</p>
                <a href="/" className="mt-8 text-indigo-400 hover:text-indigo-300 underline underline-offset-4">返回首頁</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-6 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-wide">官方驗證成功</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">榮譽證書查詢</h1>
                    <p className="text-slate-400 text-lg">此頁面僅供第三方查驗 Waterball Academy 學員結業資格</p>
                </motion.div>

                {/* Certificate Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative group"
                >
                    {/* Decorative Background Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Certificate Header Decoration */}
                        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        
                        <div className="p-8 md:p-12 lg:p-16">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 italic">Certificate of Completion</h2>
                                    <p className="text-indigo-400 font-medium tracking-[0.3em] uppercase text-xs">Official Recognition</p>
                                </div>
                                <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                                    <Award className="w-12 h-12 text-amber-500" />
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="border-l-4 border-indigo-500 pl-8 py-2">
                                    <p className="text-slate-500 text-sm mb-2 uppercase tracking-widest font-semibold">Awarded To</p>
                                    <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {certificate.metadata.memberDisplayName}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                <BookOpen className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">完成課程</p>
                                                <p className="font-semibold text-white text-lg">{certificate.metadata.journeyName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                <User className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">授課導師</p>
                                                <p className="font-semibold text-white text-lg">{certificate.metadata.instructorName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                <Calendar className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">發放日期</p>
                                                <p className="font-semibold text-white text-lg">
                                                    {new Date(certificate.issuedAt).toLocaleDateString('zh-TW', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">驗證編號</p>
                                                <p className="font-mono text-indigo-300 font-bold tracking-wider">{certificate.verificationCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="text-center md:text-left opacity-60">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mb-2 font-bold">Authenticated Authority</p>
                                    <p className="font-serif text-3xl text-white italic tracking-tighter">Waterball Academy</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white blur-xl opacity-10"></div>
                                    <div className="relative bg-white p-3 rounded-xl">
                                        <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 text-center font-bold border-2 border-slate-200 border-dashed rounded-lg">
                                            VERIFIED<br/>SCAN ME
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Link */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-500 text-sm">
                        此證書由 Waterball Academy 官方加密簽署。任何篡改均會導致驗證失敗。
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
