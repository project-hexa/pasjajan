"use client";
import React, { useState } from 'react';
import { Clock, Copy, User, Info, DollarSign, CheckCircle, Package } from 'lucide-react';

interface TransactionData {
    amount: string;
    vaNumber: string;
    paymentMethod: string;
    transactionId: string;
    createdAt: string;
    deadline: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "outline";
    className?: string;
}

interface HeaderProps {
    username: string;
}

interface DetailItemProps {
    label: string;
    value: string;
    isCopyable?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", className = "", ...props }) => {
    let baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50 disabled:pointer-events-none tracking-wide text-base";
    let variantStyles;

    if (variant === "primary") {
        variantStyles = "bg-[#14532D] text-white hover:bg-emerald-700 shadow-md";
    } else if (variant === "outline") {
        variantStyles = "border border-[#14532D] text-[#14532D] bg-white hover:bg-emerald-50";
    }

    return (
        <button className={`${baseStyles} ${variantStyles} ${className} px-6 py-3`} {...props}>
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ username }) => (
    <nav className="sticky top-0 z-10 w-full bg-[#14532D] shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                {/* Logo PasJajan */}
                <div className="flex items-center">
                    {/* Diubah menjadi text-white */}
                    <span className="text-xl font-extrabold text-white flex items-center">
                        <DollarSign className="w-6 h-6 mr-2" />
                        PasJajan
                    </span>
                </div>
                {/* User Profile */}
                <div className="flex items-center space-x-2">
                    {/* Diubah menjadi text-white */}
                    <span className="text-white text-sm font-medium hidden sm:block">{username}</span>
                    <div className="p-2 rounded-full bg-emerald-700 text-white">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

const Footer: React.FC = () => (
    <footer className="w-full py-4 text-center text-xs text-gray-500 border-t bg-white">
        &copy; {new Date().getFullYear()} PasJajan - All Right Reserved
    </footer>
);

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isCopyable = false, className = "" }) => {
    const handleCopy = () => {
        const el = document.createElement('textarea');
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        console.log('Nomor disalin: ' + value);
    };

    return (
        <div className={`flex justify-between items-center ${className}`}>
            <span className="text-gray-500 text-sm sm:text-base">{label}</span>
            <div className="flex items-center font-semibold text-gray-800 space-x-2">
                {/* Menggunakan regex sederhana untuk memeriksa kata "Berakhir" */}
                <span className={/Berakhir/i.test(label) ? 'text-red-500' : 'text-gray-800'}>
                    {value}
                </span>
                {isCopyable && (
                    <button
                        title="Salin"
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-[#14532D] transition duration-150 p-1 rounded-full hover:bg-gray-100"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    // Data transaksi dummy dengan tipe TransactionData
    const transactionData: TransactionData = {
        amount: "Rp.30.000",
        vaNumber: "2839475692837465",
        paymentMethod: "Mandiri",
        transactionId: "2839475692837465",
        createdAt: "20-07-2025 12:00",
        deadline: "20-07-2025 23:59",
    };
    
    const primaryColor = '#14532D';

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50/50">
            <Header username="John Doe" />

            {/* Konten Tengah (Card) */}
            <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 transition-all duration-300">
                    
                    {/* Judul */}
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
                        Menunggu Pembayaran
                    </h1>

                    {/* Ikon Jam Besar */}
                    <div className="flex justify-center mb-10">
                        <Clock
                            className="w-20 h-20 text-white p-4 rounded-full border-4"
                            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                        />
                    </div>

                    {/* Detail Jumlah Pembayaran (Baris Paling Atas) */}
                    <div className="flex justify-between items-center mb-6 py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700 text-lg">Jumlah Pembayaran</span>
                        <span className="font-bold text-2xl" style={{ color: primaryColor }}>
                            {transactionData.amount}
                        </span>
                    </div>
                    
                    {/* Daftar Detail Transaksi */}
                    <div className="space-y-4">
                        <DetailItem 
                            label="No. VA" 
                            value={transactionData.vaNumber} 
                            isCopyable={true} 
                        />
                        <DetailItem 
                            label="Metode Pembayaran" 
                            value={transactionData.paymentMethod} 
                        />
                        <DetailItem 
                            label="No. Transaksi" 
                            value={transactionData.transactionId} 
                        />
                        <DetailItem 
                            label="Waktu Dibuat" 
                            value={transactionData.createdAt} 
                        />
                        <DetailItem 
                            label="Berakhir Pada" 
                            value={transactionData.deadline} 
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-10">
                        <Button variant="primary">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Beranda
                        </Button>
                        <Button variant="outline">
                            <Package className="w-5 h-5 mr-2" />
                            Lihat Pesanan
                        </Button>
                    </div>

                    {/* Link Cara Pembayaran */}
                    <div className="text-center mt-6">
                        <a 
                            href="#" 
                            className="inline-flex items-center text-sm font-medium hover:text-emerald-700 transition duration-150"
                            style={{ color: primaryColor }}
                        >
                            <Info className="w-4 h-4 mr-1" />
                            Cara Pembayaran
                        </a>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default App;