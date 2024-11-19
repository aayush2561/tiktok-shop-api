import mongoose from 'mongoose';

const sellerRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    identityType: {
      type: String,
      enum: ['passport', 'national_id'],
      required: true,
    },
    identityImages: {
      front: { type: String, required: true },
      back: { type: String, required: true },
    },
    shopInfo: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      description: { type: String, required: true },
      contact: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model('SellerRequest', sellerRequestSchema);
export default Seller;
