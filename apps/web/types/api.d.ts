interface BaseAPIResponse {
  success: boolean;
  message: string;
}

interface SuccessResponse<T> extends BaseAPIResponse {
  success: true;
  data: T;
}

interface ErrorResponse<E = Record<string, string[]>> extends BaseAPIResponse {
  success: false;
  errors?: E;
}

type APIResponse<T, E = Record<string, string[]>> =
  | SuccessResponse<T>
  | ErrorResponse<E>;

export interface Store {
  id: number;
  code: string;
  name: string;
  address: string;
  phone_number: string;
  latitude?: string;
  longitude?: string;
  is_active: number;
  image_url?: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  price: string | number;
  stock: number;
  image_url: string | null;
  product_category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Promo {
  id: number;
  title: string;
  image_url: string;
  link?: string;
}