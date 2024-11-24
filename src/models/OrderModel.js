import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Out for delivery', 'Cancelled'],
    default: 'Pending',
  },
  paymentMode: {
    type: String,
    enum: ['COD', 'ESEWA'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending',
  },
  total_amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
