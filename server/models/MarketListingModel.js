import mongoose from 'mongoose';

const marketListingSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Pharmaceuticals', 'FMCG', 'Electronics', 'Luxury', 'Other'],
    default: 'Other' 
  },
  price: { type: Number, required: true }, // Price per unit
  currency: { type: String, default: 'NGN' },
  minOrderQuantity: { type: Number, default: 1 },
  image: { type: String }, // URL to Cloudinary
  status: { type: String, enum: ['Active', 'SoldOut', 'Paused'], default: 'Active' }
}, {
  timestamps: true
});

const MarketListing = mongoose.model('MarketListing', marketListingSchema);
export default MarketListing;