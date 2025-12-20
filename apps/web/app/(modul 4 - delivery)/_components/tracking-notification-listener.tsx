"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { checkOrderStatusAction } from "@/app/actions/order.actions";
import Image from "next/image";

interface TrackingNotificationListenerProps {
    orderId: number;
}

export function TrackingNotificationListener({ orderId }: TrackingNotificationListenerProps) {
    const lastStatusRef = useRef<string | null>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const result = await checkOrderStatusAction(orderId);
                if (!result) return;

                const { status, failure_note } = result;

                if (lastStatusRef.current && lastStatusRef.current !== status) {
                    // Status changed, show notification
                    showNotification(status, failure_note);
                }

                lastStatusRef.current = status;
            } catch (error) {
                console.error("Failed to check order status:", error);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [orderId]);

    const showNotification = (status: string, failureNote?: string) => {
        let title = "Update Status Pesanan";
        let description = "Status pesanan Anda telah diperbarui.";

        // Map statuses to messages based on the image
        // Image texts:
        // "Pesanan Sedang Dikemas"
        // "Pesanan Anda Sedang Dikirim"
        // "Pesanan Telah Diterima"
        // "Pesanan Selesai, Beri Penilaian"
        // "Terimakasih Telah Mengulas"
        // "Pesanan Gagal" (Custom note)

        switch (status) {
            case "MENUNGGU_KURIR":
                description = "Pesanan Sedang Dikemas";
                break;
            case "DIKIRIM":
                description = "Pesanan Anda Sedang Dikirim";
                break;
            case "SAMPAI_TUJUAN":
                description = "Pesanan Telah Diterima";
                break;
            case "SELESAI": // Assuming a finished status exists or added later
                description = "Pesanan Selesai, Beri Penilaian";
                break;
            case "Gagal Dikirim":
                title = "Pesanan Gagal";
                description = failureNote || "Pesanan Gagal Dikirim";
                break;
            default:
                description = `Status baru: ${status}`;
        }

        toast.custom((t) => (
            <div className="flex w-full items-center gap-4 rounded-xl border border-gray-800 bg-[#1A1A1A] p-4 shadow-xl">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white p-1">
                    <Image
                        src="/img/icon_notif.png"
                        alt="Notification"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-white text-sm md:text-base">{description}</span>
                </div>
            </div>
        ), {
            duration: 5000,
            position: "top-right"
        });
    };

    return null; // Invisible component
}
