const { Product } = require("../models/product.model");
const { z } = require("zod");

const productValidationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().optional(),
  short_description: z.string().optional(),
  long_description: z.string().min(1, "Long description is required"),
  category_name: z.enum(
    ["EV Bikes/Scooters", "Accessories"],
    "Invalid category name"
  ),
  technical_specifications: z
    .array(
      z.object({
        attribute_name: z.string(),
        attribute_type: z.enum([
          "text",
          "number",
          "dropdown",
          "textarea",
          "richtext",
        ]),
        attribute_value: z.union([z.string(), z.number()]),
        unit: z.string().optional(),
      })
    )
    .optional(),
  price: z.number().positive("Price must be positive"),
  discount_price: z.number().nonnegative().optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  stock_quantity: z.number().int().nonnegative(),
  stock_status: z.enum(["In Stock", "Out of Stock", "Pre-Order"]),
  low_stock_alert_threshold: z.number().int().nonnegative().optional(),
});

const createProduct = async (req, res) => {
  try {
    const validatedData = productValidationSchema.parse(req.body);
    const existingProduct = await Product.findOne({ sku: validatedData.sku });
    if (existingProduct) {
      return res.status(400).json({ message: "SKU must be unique" });
    }
    if (!validatedData.technical_specifications) {
      const specifications =
        predefinedSpecifications[validatedData.category_name];
      if (!specifications) {
        return res
          .status(400)
          .json({ message: "No predefined specifications for this category" });
      }
      validatedData.technical_specifications = specifications.map((spec) => ({
        attribute_name: spec.attribute_name,
        attribute_type: spec.attribute_type,
        attribute_value: "",
        unit: spec.unit || null,
      }));
    }
    const newProduct = new Product(validatedData);
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error " });
  }
};

const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
