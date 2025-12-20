export interface Order {
    id: number;
    invoice_number: string;
    user: {
        full_name: string;
    };
    payment_method: string;
    total_amount: number;
    grand_total?: number;
    status: string; // e.g., 'pending', 'paid', 'cancelled'
    payment_status?: 'paid' | 'unpaid';
    delivery_status: 'MENCARI_DRIVER' | 'MENUNGGU_KURIR' | 'DIKIRIM' | 'SAMPAI_TUJUAN' | 'Gagal Dikirim';
    failure_note?: string;
    created_at: string;
    items?: {
        product_id: number;
        product_name?: string;
        product?: {
            name: string;
            images?: any;
        };
        quantity: number;
        price: number;
        sub_total: number;
    }[];
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
