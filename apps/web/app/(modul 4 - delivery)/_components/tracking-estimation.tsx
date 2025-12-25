import { Icon } from "@workspace/ui/components/icon";

interface TrackingEstimationProps {
    estimatedCost: any;
    kurir: string;
    kurirPhone?: string;
}

export function TrackingEstimation({ estimatedCost, kurir, kurirPhone }: TrackingEstimationProps) {
    if (!estimatedCost) return null;

    return (
        <section className="mx-12 mt-6 p-6 rounded-xl border border-blue-200 bg-blue-50">
            <h3 className="font-bold text-blue-800 mb-2">Informasi Pengiriman</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-900">
                <div>
                    <p>Metode: <span className="font-semibold">{estimatedCost.method_name}</span></p>
                    <p>Estimasi Waktu: <span className="font-semibold">{estimatedCost.estimated_time}</span></p>
                </div>
                <div>
                    <p>Kurir: <span className="font-semibold">{kurir || "-"}</span></p>
                    <p>No. Telp Kurir: {kurirPhone ? (
                        <a
                            href={`https://wa.me/${kurirPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                        >
                            {kurirPhone} <Icon icon="logos:whatsapp-icon" className="h-4 w-4" />
                        </a>
                    ) : <span className="font-semibold">-</span>}</p>
                </div>
            </div>
        </section>
    );
}
