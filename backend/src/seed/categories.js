import { unsplash } from '../services/catalog.js';

// Seed values for the Category collection.
// avgKg = typical item weight (impact), avgValue = typical NPR value,
// longevity 0–25, repairability 0–15, demand 0–15 (circularity score inputs).
export const categories = [
  { name: 'Electronics', slug: 'electronics', icon: 'Cpu', avgKg: 1.6, avgValue: 18000, longevity: 17, repairability: 13, demand: 15, cover: unsplash('1550009158-9ebf69173e03') },
  { name: 'Mobile & Accessories', slug: 'mobile-accessories', icon: 'Smartphone', avgKg: 0.3, avgValue: 12000, longevity: 14, repairability: 11, demand: 15, cover: unsplash('1511707171634-5f897ff02aa9') },
  { name: 'Computers & Laptops', slug: 'computers-laptops', icon: 'Laptop', avgKg: 2.2, avgValue: 38000, longevity: 16, repairability: 13, demand: 15, cover: unsplash('1517336714731-489689fd1ca8') },
  { name: 'Books', slug: 'books', icon: 'BookOpen', avgKg: 0.5, avgValue: 450, longevity: 22, repairability: 6, demand: 12, cover: unsplash('1512820790803-83ca734da794') },
  { name: 'Furniture', slug: 'furniture', icon: 'Armchair', avgKg: 16, avgValue: 9000, longevity: 25, repairability: 14, demand: 12, cover: unsplash('1555041469-a586c61ea9bc') },
  { name: 'Fashion', slug: 'fashion', icon: 'Shirt', avgKg: 0.8, avgValue: 1800, longevity: 12, repairability: 10, demand: 13, cover: unsplash('1490481651871-ab68de25d43d') },
  { name: 'Shoes & Bags', slug: 'shoes-bags', icon: 'ShoppingBag', avgKg: 1, avgValue: 3000, longevity: 13, repairability: 11, demand: 13, cover: unsplash('1542291026-7eec264c27ff') },
  { name: 'Home Appliances', slug: 'home-appliances', icon: 'Plug', avgKg: 9, avgValue: 12000, longevity: 20, repairability: 15, demand: 13, cover: unsplash('1626806787461-102c1bfaaea1') },
  { name: 'Kitchen', slug: 'kitchen', icon: 'CookingPot', avgKg: 2.5, avgValue: 2500, longevity: 19, repairability: 9, demand: 13, cover: unsplash('1570222094114-d054a817e56b') },
  { name: 'Student Items', slug: 'student-items', icon: 'GraduationCap', avgKg: 1.2, avgValue: 1500, longevity: 15, repairability: 8, demand: 14, cover: unsplash('1553062407-98eeb64c6a62') },
  { name: 'Sports & Fitness', slug: 'sports-fitness', icon: 'Dumbbell', avgKg: 4, avgValue: 5000, longevity: 18, repairability: 11, demand: 11, cover: unsplash('1576678927484-cc907957088c') },
  { name: 'Bicycles & Vehicles', slug: 'bicycles-vehicles', icon: 'Bike', avgKg: 14, avgValue: 15000, longevity: 21, repairability: 14, demand: 12, cover: unsplash('1485965120184-e220f721d03e') },
  { name: 'Kids & Toys', slug: 'kids-toys', icon: 'ToyBrick', avgKg: 1.5, avgValue: 1200, longevity: 14, repairability: 8, demand: 15, cover: unsplash('1596461404969-9ae70f2830c1') },
  { name: 'Plants & Gardening', slug: 'plants-gardening', icon: 'Sprout', avgKg: 3, avgValue: 800, longevity: 16, repairability: 5, demand: 11, cover: unsplash('1416879595882-3373a0480b5b') },
  { name: 'Tools & Hardware', slug: 'tools-hardware', icon: 'Wrench', avgKg: 3.5, avgValue: 3500, longevity: 24, repairability: 14, demand: 12, cover: unsplash('1504148455328-c376907d081c') },
  { name: 'Musical Instruments', slug: 'musical-instruments', icon: 'Music', avgKg: 3, avgValue: 9000, longevity: 23, repairability: 12, demand: 10, cover: unsplash('1511379938547-c1f69419868d') },
  { name: 'Art & Crafts', slug: 'art-crafts', icon: 'Palette', avgKg: 1, avgValue: 1500, longevity: 18, repairability: 7, demand: 9, cover: unsplash('1513364776144-60967b0f800f') },
  { name: 'Other', slug: 'other', icon: 'Package', avgKg: 1.5, avgValue: 1500, longevity: 10, repairability: 7, demand: 7, cover: unsplash('1530026405186-ed1f139313f8') },
].map((c, order) => ({ ...c, order }));

// Names used by earlier versions of the seed data, mapped to their new category.
export const LEGACY_CATEGORY_NAMES = { Sports: 'Sports & Fitness', Kids: 'Kids & Toys' };
