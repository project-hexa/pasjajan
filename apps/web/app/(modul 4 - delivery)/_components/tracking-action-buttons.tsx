import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Icon } from "@workspace/ui/components/icon";

interface TrackingActionButtonsProps {
    status: string;
    rating?: number;
    reviewComment?: string;
    isOwner: boolean;
    onReceiveOrder: () => void;
    onCompleteOrder: () => void;
}

export function TrackingActionButtons({
    status,
    rating,
    reviewComment,
    isOwner,
    onReceiveOrder,
    onCompleteOrder
}: TrackingActionButtonsProps) {
    if (!isOwner) return null;

    return (
        <section className="mx-12 mt-8 flex items-center justify-end gap-4 mb-8">
            {(status === 'DIKIRIM' || status === 'SAMPAI_TUJUAN') && (
                <button
                    type="button"
                    onClick={onReceiveOrder}
                    className="rounded-lg border-2 border-[#1E6A46] bg-white px-8 py-3 font-semibold text-[#1E6A46] transition-all hover:bg-[#F0F7F3]"
                >
                    Terima Pesanan
                </button>
            )}

            {/* Show 'Selesaikan Pesanan' (Lead to Rating) if status is RECEIVED or DONE but NOT yet Rated */}
            {(status === 'TERIMA_PESANAN' || status === 'PESANAN_SELESAI') && !rating && (
                <button
                    type="button"
                    onClick={onCompleteOrder}
                    className="hover:bg-opacity-90 rounded-lg bg-[#1E6A46] px-8 py-3 font-semibold text-white transition-all"
                >
                    Selesaikan Pesanan
                </button>
            )}

            {/* Show 'Lihat Penilaian' if already Rated */}
            {rating && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="hover:bg-opacity-90 rounded-lg bg-[#F7FFFB] border border-[#1E6A46] px-8 py-3 font-semibold text-[#1E6A46] transition-all">
                            Lihat Penilaian Saya
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Penilaian Anda</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        icon="lucide:star"
                                        className={`h-8 w-8 ${i < (rating || 0)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-lg">{Number(rating)}/5</p>
                                <p className="text-gray-500 italic mt-2">"{reviewComment || 'Tidak ada komentar'}"</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Static Label for Legacy/Other Completed Status without Rating */}
            {status === 'COMPLETED' && !rating && (
                <span className="text-gray-500 font-bold px-8 py-3 bg-gray-100 rounded-lg">Pesanan Selesai</span>
            )}
        </section>
    );
}
