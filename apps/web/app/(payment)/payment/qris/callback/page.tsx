"use client";
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from "@workspace/ui/components/icon";

export default function QrisCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            console.log('QRIS callback received, attempting to close this tab...');
            
            setTimeout(() => {
                window.close();
                
                const paymentData = localStorage.getItem('payment_data');
                if (paymentData) {
                    try {
                        const data = JSON.parse(paymentData);
                        if (data.order_code) {
                            router.push(`/payment/waiting?order=${data.order_code}`);
                        }
                    } catch (e) {
                        console.error('Failed to parse payment_data:', e);
                    }
                }
            }, 1500);
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-600 flex items-center justify-center">
                        <Icon icon="lucide:loader-2" width={32} height={32} className="text-emerald-600 animate-spin" />
                    </div>
                </div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">
                    Pembayaran Diproses
                </h1>
                <p className="text-gray-600 mb-2">
                    Tab ini akan tertutup otomatis...
                </p>
                <p className="text-sm text-gray-500">
                    Silakan kembali ke tab sebelumnya
                </p>
            </div>
        </div>
    );
}
