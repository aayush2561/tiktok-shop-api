import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        enum: [
            'Motors',
            'Tools & DIY',
            'Home & Lifestyle',
            'Sports & Outdoor',
            'Electronic Accessories',
            'Groceries & Pets',
            'Electronic Devices',
            'Home Appliances',
            "Men's Fashion",
            'Watches & Accessories',
            "Women's Fashion",
            'Health & Beauty',
            'Babies & Toys'
        ],
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    tags: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length <= 3; 
            },
            message: 'You can only add up to 3 tags.'
        },
        required: false 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true, versionKey: false });

const Product = mongoose.model('Product', productSchema);
export default Product;
