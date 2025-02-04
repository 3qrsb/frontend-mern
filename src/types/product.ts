export interface Product {
  inStock: boolean;
  _id: number | string;
  name: string;
  price: number;
  images: string[];
  image?: string;
  category: string;
  brand: string;
  description: string;
  qty: number;
  availableQty: number;
  createdAt: Date;
  reviews: { rating: number }[];
  totalSales: number;
  user: string;
}
