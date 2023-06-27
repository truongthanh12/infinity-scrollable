import create from "zustand";
import { Product } from "../interface/product";

interface ProductsState {
  searchQuery: string;
  products: Product[];
  total: number;
  skip: number;
  fetchProducts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  loadMore: () => Promise<void>;
}

const useProductsStore = create<ProductsState>((set) => ({
  searchQuery: "",
  products: [],
  total: 0,
  skip: 0,
  fetchProducts: async () => {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(
        useProductsStore.getState().searchQuery
      )}&limit=20`
    );
    const data = await response.json();
    set({
      products: data.products,
      total: data.total,
      skip: data.products.length,
    });
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  loadMore: async () => {
    const state = useProductsStore.getState();
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(
        state.searchQuery
      )}&skip=${state.skip}&limit=20`
    );
    const data = await response.json();
    set((prevState) => ({
      products: [...prevState.products, ...data.products],
      skip: prevState.skip + data.products.length,
    }));
  },
}));

export default useProductsStore;
