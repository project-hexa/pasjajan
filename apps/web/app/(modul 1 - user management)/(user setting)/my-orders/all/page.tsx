"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { orderService } from "@/lib/services/orderService";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderEmptyState } from "@/components/orders/OrderEmptyState";
import { OrderListSkeleton } from "@/components/orders/OrderLoadingSkeleton";
import type { Order } from "@/types/order.types";

export default function AllOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  const searchQuery = searchParams.get("search") || undefined;

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders({
        search: searchQuery,
        per_page: 50,
      });
      setOrders(response.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgain = async (order: Order) => {
    // TODO: Implement buy again functionality
    console.log("Buy again:", order);
  };

  if (loading) {
    return <OrderListSkeleton />;
  }

  if (orders.length === 0) {
    return <OrderEmptyState message="Belum ada pesanan" />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onBuyAgain={handleBuyAgain} />
      ))}
    </div>
  );
}
