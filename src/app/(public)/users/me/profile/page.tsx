'use client';

import { useState } from 'react';
import { Github, Disc, Link2, Info, Receipt, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import OrderHistory from '@/components/courses/OrderHistory';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nickName: user?.nickName || '',
    jobTitle: user?.jobTitle || '',
    region: user?.region || '',
    avatar: user?.avatar || '',
    instructorBio: (user as any)?.instructorBio || '',
    socialLinks: (user as any)?.socialLinks || ''
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await userService.updateCurrentProfile(formData);
      if (success) {
        toast.success('個人資料已更新！');
        await refreshUser();
        setIsEditing(false);
      } else {
        toast.error('更新失敗，請檢查網路連線');
      }
    } catch (error) {
      toast.error('發生錯誤');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. 基本資料區塊 */}
      <section className="bg-[#1e1f24] border border-border-ui rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">基本資料</h2>
          {!isEditing ? (
            <button 
              onClick={() => {
                setFormData({
                    nickName: user.nickName || '',
                    jobTitle: user.jobTitle || '',
                    region: user.region || '',
                    avatar: user.avatar || '',
                    instructorBio: (user as any).instructorBio || '',
                    socialLinks: (user as any).socialLinks || ''
                });
                setIsEditing(true);
              }}
              className="px-4 py-1.5 text-xs font-bold border border-primary text-primary rounded hover:bg-primary/10 transition-colors flex items-center gap-2"
            >
              ✏️ 編輯資料
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 text-xs font-bold border border-gray-600 text-gray-400 rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X size={14} /> 取消
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 text-xs font-bold bg-primary text-black rounded hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={14} /> {isSaving ? '儲存中...' : '儲存'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">暱稱</label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.nickName}
                onChange={(e) => setFormData({...formData, nickName: e.target.value})}
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
              />
            ) : (
              <div className="text-white font-medium text-base">{user.nickName || user.name || '未設定'}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-500 mb-1">職業 (Job Title)</label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
              />
            ) : (
              <div className="text-white font-medium text-base">{user.jobTitle || '尚未設定'}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Avatar Seed / URL</label>
            {isEditing ? (
              <input 
                type="text" 
                placeholder="DiceBear Seed or URL"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
              />
            ) : (
              <div className="text-white font-medium text-base truncate max-w-xs">{user.avatar || '預設'}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-500 mb-1">等級</label>
            <div className="text-gray-400 font-medium text-base italic">{user.level} (唯讀)</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <div className="text-gray-400 font-medium text-base">{user.email || '未提供'} (唯讀)</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">地區</label>
            {isEditing ? (
              <input 
                type="text" 
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
              />
            ) : (
              <div className="text-white font-medium text-base">{user.region || '尚未設定'}</div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Discord 綁定 (唯讀演示) */}
      <section className="bg-[#1e1f24] border border-border-ui rounded-lg p-6 opacity-75">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1 flex items-center gap-2">
              Discord 帳號綁定
            </h2>
          </div>
          <div className="text-right">
            <button disabled className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-gray-700 text-gray-400 font-bold rounded cursor-not-allowed">
              <Link2 size={18} />
              {user.discordId ? '重新連接 Discord' : '暫不開放綁定'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card p-4 rounded border border-gray-700">
          <Disc className="text-indigo-400" size={28} />
          <span className="text-gray-400">{user.discordId || '尚未綁定 Discord 帳號'}</span>
        </div>
      </section>

      {/* 4. GitHub 綁定 (唯讀演示) */}
      <section className="bg-[#1e1f24] border border-border-ui rounded-lg p-6 opacity-75">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">GitHub 帳號</h2>
            <p className="text-gray-400 text-sm">自定義 Github URL 暫時不可修改</p>
          </div>
          <button disabled className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-gray-400 font-bold rounded cursor-not-allowed">
            <Link2 size={18} />
            暫不開放
          </button>
        </div>
        <div className="flex items-center gap-3 bg-card p-4 rounded border border-gray-700">
          <Github className="text-white" size={28} />
          <span className="text-gray-400">{user.githubUrl ? `已綁定: ${user.githubUrl.split('/').pop()}` : '尚未綁定 GitHub 帳號'}</span>
        </div>
      </section>

      {/* ★ Phase 9.1: 講師設定區塊 (僅 INSTRUCTOR 或 ADMIN 可見) */}
      {(user.role === 'ROLE_INSTRUCTOR' || user.role === 'ROLE_ADMIN' || (user as any).role === 'ADMIN') && (
        <section className="bg-gradient-to-r from-[#1e1f24] to-[#252015] border border-yellow-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1 flex items-center gap-2">
                🧑‍🏫 講師主頁佈置
              </h2>
              <p className="text-xs text-gray-400">在這裡設定您的對外講師形象 <a href={`/instructors/${user.id}`} target="_blank" className="text-blue-400 hover:underline">預覽我的公開主頁</a></p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-y-6 text-sm">
            <div>
              <label className="block text-gray-500 mb-2">專業頭銜 (Job Title)</label>
              <input 
                type="text" 
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                placeholder="例如：資深軟體工程師、XXX 課程創辦人"
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-2">社群連結 (Social Links - URL)</label>
              <input 
                type="text" 
                value={formData.socialLinks || ''}
                onChange={(e) => setFormData({...formData, socialLinks: e.target.value})}
                placeholder="例如您的 YouTube 頻道或 LinkedIn 連結"
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-2">講師簡介 (Instructor Bio - 支援 Markdown)</label>
              <textarea 
                rows={8}
                value={formData.instructorBio || ''}
                onChange={(e) => setFormData({...formData, instructorBio: e.target.value})}
                placeholder="分享您的背景、專長，以及對教學的熱情...可以大膽使用 Markdown 進行排版！"
                className="w-full bg-card border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary font-mono text-sm leading-relaxed"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={async () => {
                  const success = await userService.updateInstructorProfile({
                    jobTitle: formData.jobTitle,
                    instructorBio: formData.instructorBio,
                    socialLinks: formData.socialLinks
                  });
                  if (success) {
                    toast.success('講師資料已更新！');
                    refreshUser();
                  } else {
                    toast.error('儲存失敗');
                  }
                }}
                className="px-6 py-2 font-bold bg-primary hover:bg-primary text-black rounded transition-colors"
              >
                💾 儲存講師資料
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. 訂單紀錄 */}
      <OrderHistory />
    </div>
  );
}