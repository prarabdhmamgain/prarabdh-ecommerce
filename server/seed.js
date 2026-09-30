import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {name:"Wireless Headphones",description:"Comfortable wireless headphones with clear sound and long battery life.",price:2499,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",category:"Electronics",stock:15,brand:"Prarabdh Audio"},
  {name:"Smart Watch",description:"Modern smartwatch for everyday activity tracking and notifications.",price:3299,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",category:"Electronics",stock:12,brand:"Prarabdh Tech"},
  {name:"Classic Hoodie",description:"Soft everyday hoodie with a clean minimal design.",price:1499,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",category:"Fashion",stock:25,brand:"PM Wear"},
  {name:"Running Shoes",description:"Lightweight running shoes designed for daily comfort.",price:2799,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",category:"Shoes",stock:18,brand:"PM Sports"},
  {name:"Travel Backpack",description:"Durable backpack suitable for college, work and travel.",price:1199,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",category:"Accessories",stock:20,brand:"PM Gear"},
  {name:"Minimal Table Lamp",description:"Minimal lamp for study desks and modern rooms.",price:899,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",category:"Home",stock:14,brand:"PM Home"}
];

await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany({});
await Product.insertMany(products);
console.log("Products seeded successfully");
await mongoose.disconnect();
