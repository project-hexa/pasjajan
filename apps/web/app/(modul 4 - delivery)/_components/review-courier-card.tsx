import { Icon } from "@workspace/ui/components/icon";

interface ReviewCourierCardProps {
    courierName: string;
    courierPhone?: string;
}

export function ReviewCourierCard({ courierName, courierPhone }: ReviewCourierCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm w-[180px]">
            <h3 className="mb-3 text-xs font-bold text-gray-800">Pengirim</h3>
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                <span className="font-medium text-black text-sm">{courierName || "Kurir PasJajan"}</span>
                {courierPhone && (
                    <a
                        href={`https://wa.me/${courierPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <Icon icon="logos:whatsapp-icon" className="h-4 w-4" />
                    </a>
                )}
            </div>
        </div>
    );
}
