import { FC } from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ViewSwitcherProps {
  currentView: 'seller' | 'product'
  onSwitch: (view: 'seller' | 'product') => void
}

const ViewSwitcher: FC<ViewSwitcherProps> = ({ currentView, onSwitch }) => {
  return (
    <div className="flex justify-center p-4 bg-muted">
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => onSwitch(value as 'seller' | 'product')}>
        <ToggleGroupItem value="seller">Seller View</ToggleGroupItem>
        <ToggleGroupItem value="product">Product View</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default ViewSwitcher

