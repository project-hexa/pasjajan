"use client";
import React from 'react';
import { Icon } from "@workspace/ui/components/icon";

interface PaymentInstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentMethod: {
        code: string;
        name: string;
        category: string;
    };
}

export const PaymentInstructionsModal: React.FC<PaymentInstructionsModalProps> = ({ isOpen, onClose, paymentMethod }) => {
    if (!isOpen) return null;

    // Get instructions based on payment method category
    const getInstructions = () => {
        const { category, code, name } = paymentMethod;

        if (category === 'qris') {
            return [
                'Klik "Simpan Kode QR" atau ambil tangkapan layar',
                'Buka aplikasi mobile banking atau e-wallet Anda',
                'Pindai kode QR dengan aplikasi mobile banking atau e-wallet',
                'Konfirmasi transaksi dan selesaikan pembayaran'
            ];
        }

        if (category === 'e_wallet') {
            if (code === 'gopay') {
                return [
                    'Klik tombol "Buka GoPay" untuk membuka aplikasi',
                    'Anda akan diarahkan ke aplikasi Gojek/GoPay',
                    'Konfirmasi pembayaran di aplikasi GoPay',
                    'Tunggu hingga pembayaran berhasil diproses'
                ];
            }
            if (code === 'shopeepay') {
                return [
                    'Klik tombol "Buka ShopeePay" untuk membuka aplikasi',
                    'Anda akan diarahkan ke aplikasi Shopee',
                    'Konfirmasi pembayaran di aplikasi ShopeePay',
                    'Tunggu hingga pembayaran berhasil diproses'
                ];
            }
            return [
                `Klik tombol "Buka ${name}" untuk membuka aplikasi`,
                'Anda akan diarahkan ke aplikasi e-wallet',
                'Konfirmasi pembayaran di aplikasi',
                'Tunggu hingga pembayaran berhasil diproses'
            ];
        }

        if (category === 'bank_transfer') {
            const bankName = name.replace('VA ', '').replace('Virtual Account ', '');
            if (code === 'va_mandiri') {
                return [
                    'Catat Kode Perusahaan dan Kode Pembayaran',
                    `Buka aplikasi Livin' by Mandiri atau ATM Mandiri`,
                    'Pilih menu Bayar > Multipayment',
                    'Masukkan Kode Perusahaan dan Kode Pembayaran',
                    'Konfirmasi detail pembayaran dan selesaikan transaksi'
                ];
            }
            return [
                'Catat nomor Virtual Account (VA) di atas',
                `Buka aplikasi mobile banking ${bankName} atau kunjungi ATM ${bankName}`,
                'Pilih menu Transfer > Virtual Account',
                'Masukkan nomor Virtual Account yang tertera',
                'Konfirmasi detail pembayaran dan selesaikan transaksi'
            ];
        }

        return [
            'Ikuti instruksi pembayaran yang tertera',
            'Selesaikan pembayaran sebelum batas waktu',
            'Konfirmasi transaksi Anda',
            'Tunggu hingga pembayaran berhasil diproses'
        ];
    };

    const instructions = getInstructions();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Tutup"
                >
                    <Icon icon="lucide:x" width={20} height={20} className="text-gray-600" />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pr-8">
                    Cara Pembayaran
                </h2>

                {/* Payment Method Info */}
                <div className="bg-emerald-50 rounded-lg p-3 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Icon icon="lucide:wallet" width={20} height={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-emerald-900">{paymentMethod.name}</p>
                        <p className="text-sm text-emerald-700 capitalize">
                            {paymentMethod.category.replace('_', ' ')}
                        </p>
                    </div>
                </div>

                {/* Instructions List */}
                <ol className="space-y-4">
                    {instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4">
                            <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </span>
                            <p className="text-gray-700 pt-0.5 leading-relaxed">
                                {instruction}
                            </p>
                        </li>
                    ))}
                </ol>

                {/* Footer Note */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                        Pembayaran akan dikonfirmasi secara otomatis
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentInstructionsModal;
