export interface Product {
  title: string;
  price: number;
  id?: number;
  image?: string[];
  description?: string;
  thumbnail: string;
  category: string;
}

export interface ProductItemTypes {
  item: {
    title: string;
    id?: number;
    thumbnail: string;
    price: number;
    category: string;
  };
}
