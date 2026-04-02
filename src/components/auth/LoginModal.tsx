'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeft, Loader2, Briefcase, User, Rocket, Info } from 'lucide-react';
import { logVisitorIdentity } from "@/lib/visitorUtils";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMockLogin: (email: string) => void;
}

type ModalView = 'login' | 'select_role' | 'register_options' | 'manual_register';

export default function LoginModal({ isOpen, onClose, onMockLogin }: LoginModalProps) {
  const [view, setView] = useState<ModalView>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  // 讀取 Onboarding 選取的角色
  useEffect(() => {
    if (isOpen) {
      const savedRole = localStorage.getItem('user_role');
      if (savedRole) {
        setFormData(prev => ({ ...prev, role: savedRole }));
      } else {
        setFormData(prev => ({ ...prev, role: '' }));
      }
      setView('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const user = await res.json();
        alert("帳號建立成功！");
        onMockLogin(user.email);
      } else {
        const msg = await res.text();
        alert("建立失敗: " + msg);
      }
    } catch (error) {
      alert("連線錯誤");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/quick-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: formData.role }),
      });

      if (res.ok) {
        const user = await res.json();
        onMockLogin(user.email);
      } else {
        alert("快速建立失敗");
      }
    } catch (error) {
      alert("連線錯誤");
    } finally {
      setLoading(false);
    }
  };

  const handleStartRegistration = () => {
    const savedRole = localStorage.getItem('user_role');
    if (!savedRole) {
      setView('select_role');
    } else {
      setFormData(prev => ({ ...prev, role: savedRole }));
      setView('register_options');
    }
  };

  const handleRoleSelect = (role: string) => {
    localStorage.setItem('user_role', role);
    setFormData(prev => ({ ...prev, role: role }));
    setView('register_options');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#1e1f24] rounded-xl border border-gray-700 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* 返回按鈕 (註冊模式下顯示) */}
        {view !== 'login' && (
          <button
            onClick={() => {
              if (view === 'manual_register') setView('register_options');
              else if (view === 'register_options') {
                // 如果原本就有 role，回首頁；如果是剛選完 role 進來的，也回首頁或是剛前的選擇頁
                setView('login');
              } else if (view === 'select_role') setView('login');
            }}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={18} /> 返回
          </button>
        )}

        {/* LOGO 與標題 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
            W
          </div>
          <h2 className="text-xl font-bold text-white">水球軟體學院</h2>
          <p className="text-sm text-gray-400">WATERBALLSA.TW</p>
        </div>

        {view === 'login' && (
          <>
            <h3 className="text-center text-gray-300 mb-6 font-medium">請選擇登入方式</h3>
            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98]"
                onClick={() => {
                  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');
                  window.location.href = `${baseUrl}/oauth2/authorization/github`;
                }}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                使用 GitHub 帳號登入
              </button>

              <button
                className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98]"
                onClick={() => {
                  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');
                  window.location.href = `${baseUrl}/oauth2/authorization/discord`;
                }}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.4,80.21a105.73,105.73,0,0,0,32.17,16.15,77.7,77.7,0,0,0,6.89-11.11,68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.72-27.32-4.82-51.06-19.34-72.14ZM42.45,65.69C36.18,65.69,31,60,31,53s5.07-12.72,11.41-12.72S54,46,53.86,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.72,11.44-12.72S96.23,46,96.09,53,91,65.69,84.69,65.69Z"/>
                </svg>
                使用 Discord 帳號登入
              </button>

              <button
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg transition-all active:scale-[0.98] border border-gray-300"
                onClick={() => {
                  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');
                  window.location.href = `${baseUrl}/oauth2/authorization/google`;
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.743-.064-1.474-.188-2.195H12.2v4.15h6.47c-.28 1.498-1.076 2.766-2.288 3.585l3.703 2.87c2.172-2.008 3.66-4.972 3.66-8.41" /><path fill="#34A853" d="M12.2 24c3.24 0 5.957-1.074 7.942-2.909l-3.703-2.87c-1.076.721-2.451 1.148-4.239 1.148-3.276 0-6.046-2.213-7.035-5.192l-3.636 2.812C3.475 20.655 7.518 24 12.2 24" /><path fill="#FBBC05" d="M5.165 14.177c-.25-.75-.39-1.551-.39-2.377s.14-1.627.39-2.377l-3.636-2.812C.527 8.537 0 10.205 0 12.2s.527 3.663 1.529 5.59l3.636-2.812" /><path fill="#EA4335" d="M12.2 4.75c1.764 0 3.35.607 4.606 1.806l3.435-3.44C18.155 1.157 15.438 0 12.2 0 7.518 0 3.475 3.345 1.529 6.61l3.636 2.812c.989-2.979 3.759-5.192 7.035-5.192" /></svg>
                使用 Google 帳號登入
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1e1f24] text-gray-500 uppercase tracking-widest">開發測試</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  try {
                    await logVisitorIdentity('GUEST');
                    onMockLogin('god@waterballsa.tw');
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm py-2.5 rounded border border-yellow-600 transition-all flex flex-col items-center gap-1 shadow-lg shadow-yellow-500/20"
              >
                <span className="font-black">👑 登入大神驗收帳號</span>
                <span className="text-[10px] text-black/70 font-bold">(最高進度/權限)</span>
              </button>


              <button
                onClick={handleStartRegistration}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2.5 rounded border border-gray-700 transition-all flex flex-col items-center gap-1"
              >
                <span className="font-bold">✨ 建立新帳號</span>
                <span className="text-[10px] text-gray-500 opacity-80">(冒險者註冊)</span>
              </button>
            </div>
          </>
        )}

        {view === 'select_role' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-center text-gray-300 mb-6 font-bold">請選擇您的冒險者身份</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'hr', label: '人資', icon: Briefcase, color: 'text-blue-400' },
                { id: 'tech-lead', label: '技術主管', icon: User, color: 'text-purple-400' },
                { id: 'startup', label: '新創', icon: Rocket, color: 'text-orange-400' },
                { id: 'other', label: '其他', icon: Info, color: 'text-gray-400' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.label)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <role.icon className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform ${role.color}`} />
                  <span className="text-white text-sm font-medium">{role.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-[11px] text-gray-500 text-center">
              選擇身份有助於我們為您推薦最適合的課程與挑戰。
            </p>
          </div>
        )}

        {view === 'register_options' && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-center text-gray-300 mb-2 font-bold uppercase tracking-widest text-xs">冒險準備就緒</h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6 flex items-center justify-center gap-3">
              <span className="text-xs text-blue-300 font-medium">當前身份:</span>
              <span className="text-sm text-white font-bold px-2 py-0.5 bg-blue-600 rounded">{formData.role}</span>
              <button
                onClick={() => setView('select_role')}
                className="text-[10px] text-gray-400 hover:text-white underline"
              >
                修改
              </button>
            </div>

            <button
              onClick={() => setView('manual_register')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              📝 完整資料建立
            </button>
            <button
              onClick={handleQuickRegister}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-all border border-gray-700 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "🏃 快速冒險 (隨機身分)"}
            </button>
            <p className="text-[11px] text-gray-500 text-center px-4">
              快速建立後您可以隨時在個人設定中修改顯示名稱。
            </p>
          </div>
        )}

        {view === 'manual_register' && (
          <form onSubmit={handleManualRegister} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-center text-gray-300 mb-6 font-bold">填寫冒險者表單</h3>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">冒險者身分</label>
              <input
                type="text"
                value={formData.role}
                readOnly
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-400 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">顯示名稱 <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="例如: 水球教練"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">電子信箱 <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                placeholder="adventure@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">冒險密碼 <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                placeholder="請輸入密碼"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all mt-6 shadow-lg shadow-blue-500/20 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "立即開始冒險"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}