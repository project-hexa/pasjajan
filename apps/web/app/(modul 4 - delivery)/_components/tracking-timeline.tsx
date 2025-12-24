import { formatStatusText } from "../_utils";

interface TrackingTimelineProps {
    timeline: any[];
    proofImage?: string | null;
}

export function TrackingTimeline({ timeline, proofImage }: TrackingTimelineProps) {
    return (
        <section className="mx-12 mt-6 min-h-52 rounded-xl border border-[#CDE6D5] p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Riwayat Pengiriman</h2>
                {proofImage && (
                    <a href={proofImage} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">Lihat Bukti Foto</a>
                )}
            </div>

            <hr className="my-4 border-t-2 border-gray-400" />

            <div className="flex flex-col gap-4">
                {timeline.map((log, index) => {
                    const isFailedLog = log.status.toLowerCase().includes("gagal") || log.status === "GAGAL";
                    return (
                        <div key={index} className="flex items-start">
                            <div className="mr-4 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex-shrink-0 ${isFailedLog ? 'bg-red-500' : 'bg-[#1E6A46]'}`}></div>
                                {index < (timeline.length || 0) - 1 && (
                                    <div className={`mt-1 h-16 w-0.5 ${isFailedLog ? 'bg-red-300' : 'bg-[#8AC79E]'}`}></div>
                                )}
                            </div>
                            <div className="flex-1 -mt-1">
                                <p className={`font-semibold ${isFailedLog ? 'text-red-600' : 'text-[#1E6A46]'}`}>
                                    {formatStatusText(log.status)}
                                </p>
                                <p className="text-sm text-gray-500 mb-1">{log.tanggal} | {log.jam}</p>
                                <p className="mt-1 leading-relaxed text-gray-700">
                                    {log.keterangan}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
