import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProduct } from '@/app/context/ProductContext';

export function ProductView() {
  const { currentProduct } = useProduct();

  if (!currentProduct) {
    return null;
  }

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-2/5 relative aspect-square">
            {currentProduct.assetPath.endsWith('.mp4') ? (
              <video
                src={currentProduct.assetPath}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Image
                src={currentProduct.assetPath}
                alt={currentProduct.name}
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
          <div className="w-3/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
              <Badge>In Stock</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${Number(currentProduct.price).toFixed(2)}</span>
            </div>
            <p className="text-muted-foreground">
              {currentProduct.description}
            </p>
            <Button className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
