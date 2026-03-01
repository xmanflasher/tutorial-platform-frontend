import React from 'react';
import { CreditCard, Landmark, Smartphone } from 'lucide-react';

export const STEPS = [
    { id: 1, label: '建立訂單' },
    { id: 2, label: '完成支付' },
    { id: 3, label: '約定開學' },
];

export const PAYMENT_METHODS = [
    { id: 'ATM', icon: <Landmark className="w-5 h-5" />, label: 'ATM 匯款' },
    { id: 'CREDIT_CARD', icon: <CreditCard className="w-5 h-5" />, label: '信用卡（一次付清）' },
    { id: 'ZINGALA', icon: <Smartphone className="w-5 h-5" />, label: '銀角零卡分期' },
];

export const INVOICE_TYPES = [
    { id: 'TAIWAN_ID', label: '統一編號' },
    { id: 'MOBILE_CARRIER', label: '手機載具' },
    { id: 'NATURAL_PERSON', label: '自然人憑證' },
    { id: 'DONATION', label: '捐贈碼' },
];
