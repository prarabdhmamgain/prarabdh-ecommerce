import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 10 },
    brand: { type: String, default: "Prarabdh Store" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
