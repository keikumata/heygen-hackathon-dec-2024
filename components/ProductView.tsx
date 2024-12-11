import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ProductView() {
  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

