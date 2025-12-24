export type OrderStatus =
    | "pending"
    | "processing"
    | "shipping"
    | "delivered"
    | "completed"
    | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "expired" | "refunded";

export interface PaymentMethod {
    id: number;
    name: string;
    code: string;
    category: string;
}

export interface Product {
    id: number;
    name: string;
    image_url?: string;
    price: number;
}

export interface OrderItem {
    product_id: number;
    product?: Product;
    price: number;
    quantity: number;
    sub_total: number;
}

export interface Order {
    id: number;
    code: string;
    customer_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_recipient_name: string;
    shipping_recipient_phone: string;
    sub_total: number;
    discount: number;
    shipping_fee: number;
    admin_fee: number;
    grand_total: number;
    payment_method?: PaymentMethod;
    payment_instructions?: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    paid_at?: string;
    expired_at?: string;
    store_id?: number;
    store_name?: string;
    notes?: string;
    created_at: string;
    updated_at?: string;
    items: OrderItem[];
}

export interface OrdersResponse {
    orders: Order[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface OrderResponse {
    order: Order;
}
