const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
});

const Category = mongoose.model('Category', categorySchema);

const predefinedSpecifications = {
  "EV Bikes/Scooters": [
    { attribute_name: "Motor Power", attribute_type: "number", required: true },
    { attribute_name: "Battery Type", attribute_type: "dropdown", options: ["Lithium-Ion", "Lead-Acid"], required: true },
    { attribute_name: "Range Per Charge", attribute_type: "number", unit: "km", required: true },
    { attribute_name: "Charging Time", attribute_type: "number", unit: "hours", required: true },
    { attribute_name: "Top Speed", attribute_type: "number", unit: "km/h", required: false },
    { attribute_name: "Performance", attribute_type: "dropdown", options: ["High", "Medium", "Low"], required: false }
  ],
  "Accessories": [
    { attribute_name: "Compatibility", attribute_type: "text", required: true },
    { attribute_name: "Dimensions", attribute_type: "text", required: true },
    { attribute_name: "Material", attribute_type: "dropdown", options: ["Aluminum Alloy", "Plastic", "Steel"], required: false },
    { attribute_name: "Overview", attribute_type: "textarea", required: false }
  ]
};

const productSchema = new mongoose.Schema({
  // compulsory fields
  name: { type: String, required: true }, 
  sku: { type: String, unique: true }, 
  brand: { type: String }, 
  short_description: { type: String }, 
  long_description: { type: String, required: true }, 

  // reference fields
  category_name: { type: String, required: true }, 
  
  // conditional fields
  technical_specifications: [
    {
      attribute_name: { type: String, required: true }, 
      attribute_type: { 
        type: String, 
        enum: ['text', 'number', 'dropdown', 'textarea', 'richtext'], 
        required: true 
      },
      attribute_value: { type: String, required: true }, 
      unit: { type: String } 
    }
  ],

  // compulsory fields
  price: { type: Number, required: true }, 
  discount_price: { type: Number }, 
  tax_rate: { type: Number }, 
  stock_quantity: { type: Number, required: true }, 
  stock_status: { 
    type: String, 
    enum: ['In Stock', 'Out of Stock', 'Pre-Order'], 
    default: 'In Stock' 
  }, 
  low_stock_alert_threshold: { type: Number }, 

  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


productSchema.pre('save', function (next) {
  const product = this;
  const specifications = predefinedSpecifications[product.category_name];
  
  if (!specifications) {
    return next(new Error('No specifications defined for this category.'));
  }

  
  if (!product.technical_specifications || product.technical_specifications.length === 0) {
    product.technical_specifications = specifications.map(spec => ({
      attribute_name: spec.attribute_name,
      attribute_type: spec.attribute_type,
      attribute_value: '', 
      unit: spec.unit || null
    }));
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Category, Product };
