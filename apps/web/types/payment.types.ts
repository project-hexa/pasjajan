// Payment-specific types not already in order.types.ts

export interface PaymentMethodInfo {
    code: string;
    name: string;
    category: string;
}

export interface PaymentData {
    order_code: string;
    payment_method: PaymentMethodInfo;
    payment_status: string;
    grand_total: string;
    created_at?: string;
    expired_at?: string;
    qr_code_url?: string;
    deeplink?: string;
    va_number?: string;
    bank?: string;
    payment_code?: string;
    company_code?: string;
}

export interface PaymentItem {
    id: string;
    name: string;
    variant: string;
    price: number;
    qty: number;
    image_url: string;
}

export interface ProcessPaymentPayload {
    order_code: string;
    payment_method_code: string;
    shipping_address: string;
    shipping_recipient_name: string;
    shipping_recipient_phone: string;
}

export interface ProcessPaymentResponse {
    order_code: string;
    payment_method: PaymentMethodInfo;
    payment_status: string;
    grand_total: string;
    expired_at?: string;
    qr_code_url?: string;
    deeplink?: string;
    va_number?: string;
    payment_code?: string;
    company_code?: string;
}

export interface CheckPaymentStatusResponse {
    payment_status?: string;
    transaction_status?: string;
    order_code?: string;
}
