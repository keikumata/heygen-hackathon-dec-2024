'use client'

import { createContext, useContext, useState } from 'react';


export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  assetPath: string;
  intro: string;
  context: string;
}

type ProductContextType = {
  currentProduct?: Product;
  setCurrentProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);

  return (
    <ProductContext.Provider value={{
      currentProduct,
      setCurrentProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (undefined === context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}