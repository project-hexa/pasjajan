export interface Product {
  id: string | number;
  name: string;
  description?: string;
  image: string;
  price: number;
  category?: string;
  stock?: number;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
}

export interface Banner {
  id: string | number;
  image: string;
  title?: string;
  description?: string;
  link?: string;
}
