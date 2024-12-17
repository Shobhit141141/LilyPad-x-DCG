const express = require("express");
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct} = require("../controllers/app.controller");

const router = express.Router();
const { z } = require("zod");
const { Product } = require("../config/db");

router.get("/product",getAllProducts);
router.post("/product",createProduct);
router.get("/products/:id", getProductById);      
router.put("/products/:id", updateProduct);       
router.delete("/products/:id", deleteProduct);


module.exports = router;
