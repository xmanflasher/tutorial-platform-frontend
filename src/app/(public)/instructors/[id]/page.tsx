'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types/User';
import ReactMarkdown from 'react-markdown';
import { Youtube, Link2, MapPin, Loader2, UserRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InstructorPage() {
  const params = useParams();
  const idValue = params?.id;
  const id = Array.isArray(idValue) ? idValue[0] : idValue;

  const [instructor, setInstructor] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchInstructor = async () => {
      setLoading(true);
      const user = await userService.getUserProfile(id);
      // Optional check: ensure they actually have INSTRUCTOR role or just display anyway
      setInstructor(user);
      setLoading(false);
    };
    fetchInstructor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-black flex justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">找不到該講師資訊</h1>
        <Link href="/" className="text-primary hover:text-yellow-300">返回首頁</Link>
      </div>
    );
  }

  // Parse social links if it's a URL
  let socialUrl = instructor.socialLinks || '';
  const isYoutube = socialUrl.includes('youtube.com') || socialUrl.includes('youtu.be');

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link href="/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} /> 返回課程列表
        </Link>
        
        {/* Hero Section */}
        <div className="bg-[#1e1f24] border border-border-ui rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-900/20 blur-[100px] rounded-full pointer-events-none" />

          <img 
            src={instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`} 
            alt={instructor.name}
            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-primary/30 object-cover z-10"
          />
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              {instructor.nickName || instructor.name}
            </h1>
            <p className="text-xl text-primary font-medium mb-6">
              {instructor.jobTitle || '專業講師'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 mb-6">
              {instructor.region && (
                <span className="flex items-center gap-1"><MapPin size={16} /> {instructor.region}</span>
              )}
            </div>

            {socialUrl && (
              <a 
                href={socialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors border border-gray-700 hover:border-gray-500"
              >
                {isYoutube ? <Youtube size={18} className="text-red-500" /> : <Link2 size={18} />}
                <span>{isYoutube ? '訂閱 YouTube 頻道' : '個人專頁連結'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-card border border-border-ui rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-border-ui pb-4">關於講師</h2>
          
          <div className="prose prose-invert prose-yellow max-w-none prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-yellow-300">
            {instructor.instructorBio ? (
              <ReactMarkdown>{instructor.instructorBio}</ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">該講師尚未填寫簡介...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
