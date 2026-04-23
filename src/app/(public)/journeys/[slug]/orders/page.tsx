'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, CreditCard, Landmark, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { orderStore } from '@/lib/orderStore';
import { homeService, orderService } from '@/services';
import { announcementService } from '@/services/announcementService';
import { Course } from '@/types';
import { useAuth } from '@/context/AuthContext';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

import { STEPS, PAYMENT_METHODS, INVOICE_TYPES } from '@/mock/checkout';

export default function CheckoutPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState('ATM');
    const [selectedInstallment, setSelectedInstallment] = useState('3');
    const [selectedInvoice, setSelectedInvoice] = useState('TAIWAN_ID');
    const [showAgreement, setShowAgreement] = useState(false);
    const [showInvoiceSection, setShowInvoiceSection] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentDeadline, setPaymentDeadline] = useState('');

    useEffect(() => {
        // Load course details
        const fetchCourse = async () => {
            const courses = await homeService.getFeaturedCourses();
            const found = courses.find(c => c.slug === slug);
            if (found) setCourse(found);
        };
        fetchCourse();

        // Generate a mock order number and deadline
        const now = new Date();
        const deadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        setOrderNumber(now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + Math.floor(Math.random() * 10000000).toString());
        setPaymentDeadline(deadline.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    }, [slug]);

    const handleCreateOrder = async () => {
        if (isSubmitting) return;
        
        console.log('[CheckoutPage] handleCreateOrder clicked', { courseSlug: course?.slug, userId: user?.id });
        if (!course || !user) {
            if (!user) alert('請先登入才能下單');
            return;
        }

        if (orderStore.isCourseOwned(course.slug)) {
            alert('您已經擁有此課程，無須重複購買');
            router.push(`/journeys/${course.slug}`);
            return;
        }

        if (orderStore.hasPendingOrder(course.slug)) {
            alert('您已有一筆待付款的訂單，請直接前往付款');
            router.push('/users/me/orders');
            return;
        }

        try {
            setIsSubmitting(true);
            const newOrder = await orderService.createOrder({
                userId: user.id,
                journeyId: course.id,
                amount: course.slug === 'software-design-pattern' ? 38999 : (course.slug === 'ai-bdd' ? 7599 : 3000),
                paymentMethod: selectedPayment,
                invoiceType: selectedInvoice,
                invoiceValue: '' // Can be bound to an input
            });

            // Update with local info if missing from backend
            newOrder.courseSlug = course.slug;
            orderStore.saveOrders(orderStore.getOrders()); // Re-save to ensure slug is there
            
            // 重要：更新為後端生成的正式訂單編號
            setOrderNumber(newOrder.orderNumber);

            announcementService.emit(`🎉 訂單 ${newOrder.orderNumber} 已建立成功！請前往完成支付。`, '查看訂單', '/courses');

            setCurrentStep(2);
        } catch (error) {
            console.error('[CheckoutPage] Create order failed:', error);
            alert('訂單建立失敗，詳情請見控制台');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-2xl overflow-hidden">
                {/* Header / Stepper */}
                <div className="bg-[#3B82F6] p-6">
                    <div className="flex justify-between items-center max-w-2xl mx-auto relative">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center z-10 transition-all">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        currentStep >= step.id ? "bg-white text-[#3B82F6] border-white" : "bg-[#3B82F6] text-white border-white/50"
                                    )}
                                >
                                    {currentStep > step.id ? <Check className="w-6 h-6" /> : step.id}
                                </div>
                                <span className="mt-2 text-sm font-medium">{step.label}</span>
                            </div>
                        ))}
                        {/* Progress Lines */}
                        <div className="absolute top-5 left-0 w-full h-[2px] bg-white/30 -z-0">
                            <div
                                className="h-full bg-white transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Order Info Summary */}
                    <div className="flex justify-between items-start border-b border-border-ui pb-6">
                        <div className="space-y-1">
                            <div className="text-gray-400 text-sm">訂單編號:</div>
                            <div className="font-mono text-lg">{orderNumber}</div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="text-gray-400 text-sm">付款截止時間:</div>
                            <div className="text-lg">{paymentDeadline} 12:00 AM</div>
                        </div>
                    </div>

                    {currentStep === 1 ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <section>
                                <h2 className="text-xl font-bold mb-4">付款說明</h2>
                                <p className="text-gray-300">恭喜你，訂單已建立完成，請你於三日內付款。</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold mb-4">付款方式</h2>
                                <p className="text-sm text-gray-400">選取付款方式</p>

                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <div key={method.id} className="space-y-3">
                                            <button
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                                                    selectedPayment === method.id
                                                        ? "bg-white/5 border-[#3B82F6] ring-1 ring-[#3B82F6]"
                                                        : "bg-transparent border-border-ui hover:border-border-ui"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded", selectedPayment === method.id ? "bg-[#3B82F6]" : "bg-white/10")}>
                                                    {method.icon}
                                                </div>
                                                <span className="font-medium">{method.label}</span>
                                            </button>

                                            {selectedPayment === 'ZINGALA' && method.id === 'ZINGALA' && (
                                                <div className="pl-14 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <p className="text-sm text-gray-400">選取分期</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['3', '6', '9', '12', '18', '24'].map((num) => (
                                                            <button
                                                                key={num}
                                                                onClick={() => setSelectedInstallment(num)}
                                                                className={cn(
                                                                    "px-4 py-2 rounded-md border transition-all",
                                                                    selectedInstallment === num
                                                                        ? "bg-[#3B82F6] border-[#3B82F6]"
                                                                        : "bg-white/5 border-border-ui hover:border-border-ui"
                                                                )}
                                                            >
                                                                {num} 期
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Invoice Section */}
                            <section className="space-y-4">
                                <button
                                    onClick={() => setShowInvoiceSection(!showInvoiceSection)}
                                    className="w-full flex justify-between items-center text-left py-4 border-t border-border-ui"
                                >
                                    <h2 className="text-xl font-bold italic">發票資訊（選填）</h2>
                                    {showInvoiceSection ? <ChevronUp /> : <ChevronDown />}
                                </button>

                                {showInvoiceSection && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-400">發票類型</p>
                                            <div className="flex flex-wrap gap-2">
                                                {INVOICE_TYPES.map((type) => (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setSelectedInvoice(type.id)}
                                                        className={cn(
                                                            "px-4 py-2 rounded-md border transition-all text-sm font-medium",
                                                            selectedInvoice === type.id
                                                                ? "bg-[#3B82F6] border-[#3B82F6] shadow-lg shadow-blue-500/20"
                                                                : "bg-white/5 border-border-ui hover:border-border-ui"
                                                        )}
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 min-h-[100px]">
                                            {selectedInvoice === 'TAIWAN_ID' && (
                                                <div className="space-y-3 animate-in fade-in">
                                                    <div>
                                                        <label className="text-sm text-gray-400 block mb-1">統一編號</label>
                                                        <input
                                                            type="text"
                                                            placeholder="例: 12345678"
                                                            className="w-full bg-[#0F172A] border border-border-ui rounded-lg p-3 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {selectedInvoice === 'MOBILE_CARRIER' && (
                                                <div className="space-y-3 animate-in fade-in">
                                                    <div>
                                                        <label className="text-sm text-gray-400 block mb-1">載具編號</label>
                                                        <input
                                                            type="text"
                                                            placeholder="例: /AB12-+. (需包含 / 符號)"
                                                            className="w-full bg-[#0F172A] border border-border-ui rounded-lg p-3 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {selectedInvoice === 'NATURAL_PERSON' && (
                                                <div className="space-y-3 animate-in fade-in">
                                                    <div>
                                                        <label className="text-sm text-gray-400 block mb-1">載具編號</label>
                                                        <input
                                                            type="text"
                                                            placeholder="例: AB12345678901234 (兩位大寫字母加上 14 位數字)"
                                                            className="w-full bg-[#0F172A] border border-border-ui rounded-lg p-3 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {selectedInvoice === 'DONATION' && (
                                                <div className="space-y-3 animate-in fade-in">
                                                    <div>
                                                        <label className="text-sm text-gray-400 block mb-1">捐贈碼</label>
                                                        <input
                                                            type="text"
                                                            placeholder="例: 123"
                                                            className="w-full bg-[#0F172A] border border-border-ui rounded-lg p-3 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Action Section */}
                            <div className="pt-6 space-y-4">
                                <button
                                    onClick={handleCreateOrder}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2",
                                        isSubmitting 
                                            ? "bg-gray-600 cursor-not-allowed text-gray-300" 
                                            : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-blue-500/20"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>處理中...</span>
                                        </>
                                    ) : (
                                        "進行支付"
                                    )}
                                </button>

                                <p className="text-xs text-gray-400 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                                    付款後的平日一天內（假日則一至兩天內）會立即幫您對帳，若對帳無誤則會於約定之開學日程為您啟動此帳號的正式使用資格，也會透過訊息來引導您享受此旅程。<br /><br />
                                    若您有其他購買相關的問題，歡迎寄信至 <a href="mailto:sales@waterballsa.tw" className="text-[#3B82F6]">sales@waterballsa.tw</a> 詢問。
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <Check className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">訂單已成功建立</h3>
                                <p className="text-gray-400 max-w-sm">請前往「所有課程」頁面的訂單紀錄區塊，點及「立即完成訂單」來模擬支付成功的流程。</p>
                            </div>
                            <button
                                onClick={() => router.push('/courses')}
                                className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
                            >
                                回到課程列表
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                <button
                    onClick={() => setShowAgreement(!showAgreement)}
                    className="flex items-center gap-2 text-[#3B82F6] hover:text-blue-400 text-sm font-medium transition-colors"
                >
                    {showAgreement ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    網際網路課程購買暨服務契約
                </button>

                {showAgreement && (
                    <div className="mt-4 p-6 bg-card rounded-xl border border-border-ui text-xs text-gray-400 h-64 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 animate-in slide-in-from-top-4">
                        <h3 className="text-sm font-bold text-gray-300">網際網路課程購買暨服務契約</h3>
                        <p>本網際網路課程購買暨服務契約（以下簡稱本契約），指 Σ-Codeatl 軟體學院（以下簡稱「Σ-Codeatl」、「我們」、「我們的」，公司基本資料詳列如下）授權您於 codeatl.tw 網域之網站或 Σ-Codeatl 所有之移動裝置平台（以下合稱本平台），使用 Σ-Codeatl 透過網際網路連線、或移動裝置平台離線進行之教學、評量或其他相關服務...</p>
                        <p>Σ-Codeatl 軟體學院 負責人：李立超 (超哥)<br />客戶服務電子郵件：support@codeatl.tw<br />營業所地址：臺北市大安區和安里復興南路一段 352 號 2 樓之 2<br />統一編號：00117764</p>
                    </div>
                )}
            </div>
        </div>
    );
}
