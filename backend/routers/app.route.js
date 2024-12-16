const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { Product } = require("../config/db"); //Product is the mongoose model exported from db

const postDataSchema = z.object({
  category: z.enum(["EV Bikes", "EV Scooters", "Accessories"]),
  productName: z.string().min(1),
  sku: z.string().optional(),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().min(1),
  technicalSpecifications: z.record(z.string(), z.any()),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  stockQuantity: z.number().int().min(0),
  stockStatus: z.enum(["In Stock", "Out of Stock", "Pre-Order"]),
  lowStockAlertThreshold: z.number().int().min(0).optional(),
});

router.post("/product", async (req, res) => {
  const { success } = postDataSchema.safeParse(req.body);
  if (!success) {
    res.json({
      message: "Invalid inputs",
    });
  }

  const product = new Product(req.body);
  await product.save();

  res.status(201).json({ message: "Product added successfully", product });
});

router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
