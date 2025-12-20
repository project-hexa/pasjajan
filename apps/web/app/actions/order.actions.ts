"use server";

import { updateOrderStatusServer, getUserOrdersReal, getOrdersServer } from "@/services/order.service";
import { getTrackingServer } from "@/services/delivery.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateStatusAction(orderId: number, status: string, note?: string) {
    await updateOrderStatusServer(orderId, status, note);
    revalidatePath("/dashboard/delivery");
}

export async function checkOrderStatusAction(orderId: number) {
    // Check against Real API first
    const trackingData = await getTrackingServer(orderId);

    if (trackingData) {
        return {
            status: trackingData.status_utama,
            failure_note: trackingData.status_utama === 'Gagal Dikirim'
                ? trackingData.timeline[0]?.keterangan
                : undefined
        };
    }

    // Fallback to Mock Data
    const { data } = await getOrdersServer({ page: 1 });
    const order = data.find((o) => o.id === orderId);
    return order ? { status: order.delivery_status, failure_note: order.failure_note } : null;
}

export async function getTrackingDataAction(orderId: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    // 1. Auth Check
    if (!token) {
        return { redirect: "/login" };
    }

    // 2. Strict Payment & Ownership Check
    try {
        // B. Verify Payment Status via Orders API
        const orders = await getUserOrdersReal();
        const order = orders.find(o => o.id === Number(orderId));

        // Strict: If order is not found in user's list (not owned or not created), treat as checkout required.
        if (!order) {
            return { redirect: "/catalogue" };
        }

        if ((order as any).payment_status === 'unpaid') {
            return { redirect: "/catalogue" };
        }
    } catch (e) {
        console.error("Verification failed", e);
        // Do not redirect to login here aggressively.
    }

    // 3. Fetch Real Tracking Data
    const data = await getTrackingServer(orderId);

    return data;
}

export async function getOrderDetailsAction(orderId: number) {
    const orders = await getUserOrdersReal();
    const order = orders.find((o) => o.id === Number(orderId));
    return order || null;
}
