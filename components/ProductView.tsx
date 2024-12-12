import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from 'react'
import { useVideoStream } from '@/app/context/VideoStreamContext'

interface Product {
  id: number;
  name: string;
  intro: string;
  speech: string;
  price: number;
  salePrice: number;  
  description: string;
  image: string;
}

export function ProductView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/get-products');
        const data = await response.json();
        setProducts(data.products);
        
        // Get currentProductIndex from sessionStorage or other state management
        const storedIndex = sessionStorage.getItem('currentProductIndex');
        if (storedIndex) {
          setCurrentProductIndex(parseInt(storedIndex));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }, 1000); // Poll every second

    return () => clearInterval(interval);
  }, []);

  if (products.length === 0) return null;

  const currentProduct = products[currentProductIndex];

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-2/5 relative aspect-square">
            <Image
              src={currentProduct.image || "/product.png"}
              alt={currentProduct.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="w-3/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
              <Badge>In Stock</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${currentProduct.salePrice}</span>
              <span className="text-sm text-muted-foreground line-through">${currentProduct.price}</span>
            </div>
            <p className="text-muted-foreground">
              {currentProduct.description}
            </p>
            <Button className="w-full">Add to Cart</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}