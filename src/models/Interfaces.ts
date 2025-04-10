export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  brand: string;
  model: string;
  color: string;
  category: string;
  popular?: boolean;
  discount?: number;
  onSale?: boolean;
}

export interface GetDataFuncProps {
  limit?: number;
  page?: number;
}

export interface GetDataResponce {
  message: string;
  products: Product[];
  status: string;
}
