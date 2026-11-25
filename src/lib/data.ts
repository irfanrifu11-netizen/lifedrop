import type { MenuItem } from "./types";

export const seedMenu: MenuItem[] = [
  {
    id: 1,
    name: "Classic Chicken Burger",
    price: 180,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    category: "Burgers",
    description: "Crispy chicken, lettuce, tomato and house sauce.",
  },
  {
    id: 2,
    name: "Smash Beef Burger",
    price: 220,
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    category: "Burgers",
    description: "Double smash patty, cheddar, pickles and smoke mayo.",
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: 260,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
    category: "Pizza",
    description: "Wood-fired base, san marzano tomato and fresh mozzarella.",
  },
  {
    id: 4,
    name: "Penne Alfredo",
    price: 240,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    category: "Pasta",
    description: "Creamy parmesan sauce, herbs and grilled chicken.",
  },
  {
    id: 5,
    name: "Garden Salad",
    price: 160,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    category: "Salads",
    description: "Seasonal greens, crunchy vegetables and citrus dressing.",
  },
  {
    id: 6,
    name: "Grilled Chicken Plate",
    price: 280,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    category: "Grills",
    description: "Char-grilled chicken with rice and roasted vegetables.",
  },
  {
    id: 7,
    name: "Loaded Fries",
    price: 120,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
    category: "Sides",
    description: "Golden fries with cheese sauce and spicy seasoning.",
  },
  {
    id: 8,
    name: "Iced Coffee",
    price: 90,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
    category: "Drinks",
    description: "Cold brewed coffee served over ice.",
  },
];

export const categories = [
  "All",
  "Burgers",
  "Pizza",
  "Pasta",
  "Salads",
  "Grills",
  "Sides",
  "Drinks",
] as const;

export const siteConfig = {
  name: "LifeDrop",
  shortName: "LifeDrop",
  tagline: "Blood Donor Network",
  description:
    "Find blood donors nearby, post a blood request, or register as a volunteer donor with LifeDrop. Donor details are shared only with consent.",
  url: "https://lifedrop-donor-network.vercel.app",
  location: "Community donor network · Available 24/7",
  phone: "+91 96547 38357",
  email: "irfanrifu11@gmail.com",
};
