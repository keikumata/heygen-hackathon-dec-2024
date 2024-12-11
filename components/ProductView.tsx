import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductView({ productId = 'manduka-pro' }) {
  const [products] = useState({
    "manduka-pro": {
      name: "Manduka PRO Yoga Mat",
      originalPrice: 150,
      salePrice: 112,
      image: "/product.png",
      inStock: true,
      description: "Professional-grade yoga mat designed for ultimate comfort and durability. Features superior grip, eco-friendly materials, and optimal thickness for stability."
    },
    "stanley-quencher": {
      name: "Stanley Quencher",
      originalPrice: 35,
      salePrice: 20,
      image: "/stanley.png",
      inStock: true,
      description: "30oz vacuum-insulated tumbler that keeps drinks ice-cold all day long. Perfect for hot yoga sessions."
    }
  });

  const product = products[productId];

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-2/5 relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="w-3/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <Badge>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${product.salePrice}</span>
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
            <Button className="w-full">Add to Cart</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
