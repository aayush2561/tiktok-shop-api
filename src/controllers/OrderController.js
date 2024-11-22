import Order from '../models/OrderModel.js';
import initiatePayment from '../services/PaymentServices.js';
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    if (orderData.paymentMode === 'ESEWA') {
      const secretKey = process.env.ESEWA_SECRET_KEY;
      initiatePayment(orderData, secretKey);
    }
    const created = new Order(orderData);
    await created.save();
    res.status(201).json({ message: 'Order created sucessfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error creating an order, please trying again later' });
  }
};
export const getAllOrder = async (req, res) => {
  try {
    const order = await Order.find()
      .populate('userId', '-password -role')
      .populate('productId');
    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured while getting orders.' });
  }
};
export const getByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured while getting orders.' });
  }
};
export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const { paymentMode, address, totalNumber } = req.body;

    if (paymentMode) {
      order.paymentMode = paymentMode;
    }
    if (address) {
      order.address = address;
    }
    if (totalNumber) {
      order.total = total;
    }

    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while updating order' });
  }
};
export const deleteById = async (req, res) => {
  try {
    const id = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await Order.deleteOne(order);
    return res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Error occured while deleting order' });
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const { status } = req.body;

    if (status) {
      order.status = status;
    }

    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while updating order' });
  }
};
