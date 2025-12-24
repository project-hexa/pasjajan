import { useEffect } from "react";
import Image from "next/image";

interface StatusToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export function StatusToast({ message, isVisible, onClose }: StatusToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto close after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
            <div className="flex items-center gap-3 bg-[#1E1E1E] text-white px-6 py-4 rounded-full shadow-lg min-w-[300px]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F7FFFB] flex items-center justify-center">
                    <Image
                        src="/img/icon_notif.png"
                        alt="Notification"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </div>
                <span className="font-medium text-sm">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-auto text-gray-400 hover:text-white"
                >
                    ×
                </button>
            </div>
            <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
        </div>
    );
}
