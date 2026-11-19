import {
  BookOpen,
  Package,
  Printer,
  Shirt,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface CategoryIconProps {
  category: ServiceCategory;
  className?: string;
}

export function CategoryIcon({ category, className = 'w-5 h-5' }: CategoryIconProps) {
  switch (category) {
    case 'Laundry':
      return <Shirt className={className} aria-hidden="true" />;
    case 'Printing':
      return <Printer className={className} aria-hidden="true" />;
    case 'Stationery':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'Tiffin / Food':
      return <UtensilsCrossed className={className} aria-hidden="true" />;
    case 'Minor Repairs':
      return <Wrench className={className} aria-hidden="true" />;
    case 'Hostel Essentials':
      return <Package className={className} aria-hidden="true" />;
  }
}
