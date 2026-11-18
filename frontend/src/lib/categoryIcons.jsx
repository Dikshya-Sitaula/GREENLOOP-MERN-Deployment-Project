import { Armchair, BookOpen, Bike, CookingPot, Cpu, Dumbbell, GraduationCap, Laptop, Music, Package, Palette, Plug, Shirt, ShoppingBag, Smartphone, Sprout, ToyBrick, Wrench } from 'lucide-react';

// Presentation only: the API sends an icon *name* per category; this maps it to a Lucide component.
const ICONS = { Armchair, BookOpen, Bike, CookingPot, Cpu, Dumbbell, GraduationCap, Laptop, Music, Package, Palette, Plug, Shirt, ShoppingBag, Smartphone, Sprout, ToyBrick, Wrench };

export default function CategoryIcon({ name, className = 'h-4 w-4', ...props }) {
  const Icon = ICONS[name] || Package;
  return <Icon className={className} strokeWidth={1.5} aria-hidden {...props} />;
}
