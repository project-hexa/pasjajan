import Image from "next/image";
import { Icon } from "@workspace/ui/components/icon";

export function ReviewProductCard() {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon icon="lucide:package" className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-black mb-1">Teh Pucuk - 350 ML Pop Mie - baso</h3>
                    <p className="text-xs text-gray-600 mb-1">Total: 2 Pesanan</p>
                    <p className="text-xs font-semibold text-black">Total Belanja Rp.30,000</p>
                </div>
                <button
                    type="button"
                    className="text-xs font-semibold text-[#1E8F59] hover:underline"
                >
                    Lihat Detail Pesanan
                </button>
            </div>
        </div>
    );
}
