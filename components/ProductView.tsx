'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string;
  name: string;
  introduction: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
  details: {
    technicalDetails: Record<string, any>;
    [key: string]: any;
  };
}

interface ProductViewProps {
  currentProductId: string;
}

export function ProductView({ currentProductId }: ProductViewProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/knowledgeBase.json');
        const data = await response.json();
        const currentProduct = data.products.find((p: Product) => p.id === currentProductId);
        setProduct(currentProduct || null);
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [currentProductId]);

  if (loading) {
    return (
      <Card className="w-full h-full overflow-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="w-full h-full overflow-auto">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Product not found
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get image path based on product ID
  const imagePath = `/products/${product.id}.png`;

  // Generate description based on product details
  const description = product.id === 'manduka-pro-mat' 
    ? `Professional-grade yoga mat featuring ${product.details.technicalDetails.material}. 
       ${product.details.features.bestInClass}. 
       ${product.details.features.cushioning}.`
    : `${product.details.technicalDetails.capacity} capacity with 
       ${product.details.technicalDetails.features.join('. ')}.`;

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
<<<<<<< Updated upstream
        <div className="flex gap-6">
          <div className="w-2/5 relative aspect-square">
            <Image
              src="/product.png"
              alt="Premium Yoga Mat - Crimson Red"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="w-3/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Premium Yoga Mat</h2>
              <Badge>In Stock</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$68.99</span>
              <span className="text-sm text-muted-foreground line-through">$89.99</span>
            </div>
            <p className="text-muted-foreground">
              Professional-grade yoga mat in vibrant crimson red. Features superior grip, 
              eco-friendly materials, and optimal thickness for comfort and stability. 
              Perfect for both beginners and advanced practitioners.
            </p>
            <Button className="w-full">Add to Cart</Button>
=======
<<<<<<< Updated upstream
        <div className="aspect-square relative mb-6">
          <Image
            src="/product.png"
            alt="Premium Yoga Mat - Crimson Red"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Premium Yoga Mat</h2>
            <Badge>In Stock</Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">$68.99</span>
            <span className="text-sm text-muted-foreground line-through">$89.99</span>
=======
        <div className="flex gap-6">
          <div className="w-2/5 relative aspect-square">
            <Image
              src={imagePath}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="w-3/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <Badge variant="secondary">{product.discount} OFF</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${product.salePrice}</span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            </div>
            <p className="text-muted-foreground">
              {description}
            </p>
            <div className="space-y-2">
              {product.id === 'manduka-pro-mat' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Size: {product.details.technicalDetails.dimensions.length} x {product.details.technicalDetails.dimensions.width}</div>
                  <div>Weight: {product.details.technicalDetails.weight}</div>
                  <div>Material: {product.details.technicalDetails.material}</div>
                  <div>Color: {product.details.technicalDetails.color}</div>
                </div>
              )}
              {product.id === 'stanley-quencher' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Capacity: {product.details.technicalDetails.capacity}</div>
                  <div>Material: {product.details.technicalDetails.material}</div>
                  <div>Colors: {product.details.colors.join(', ')}</div>
                </div>
              )}
            </div>
            <Button className="w-full">Add to Cart</Button>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

