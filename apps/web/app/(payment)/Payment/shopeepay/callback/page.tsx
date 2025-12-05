"use client";
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ShopeepayCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            console.log('ShopeePay callback received, attempting to close this tab...');
            
            // Show brief message then close this tab
            // The original waiting page tab will continue polling and detect payment success
            setTimeout(() => {
                window.close();
                
                // Fallback: if window.close() doesn't work (browser restriction),
                // redirect to waiting page as backup
                const paymentData = localStorage.getItem('payment_data');
                if (paymentData) {
                    try {
                        const data = JSON.parse(paymentData);
                        if (data.order_code) {
                            router.push(`/payment/Waiting?order=${data.order_code}`);
                        }
                    } catch (e) {
                        console.error('Failed to parse payment_data:', e);
                    }
                }
            }, 1500); // Wait 1.5 seconds so user can see the message
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50/50">
            <div className="text-center">
                <Loader2 className="w-16 h-16 text-emerald-700 animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
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
