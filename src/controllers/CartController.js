import Cart from '../models/CartModel.js';

export const addCart = async (req, res) => {
  try {
    const newCartItem = new Cart(req.body);
    await newCartItem.save();
    return res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding item to cart' });
  }
};

export const getByUserId = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).populate(
      'productId'
    );
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving cart items' });
  }
};

export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const { quantity } = req.body;
    if (quantity) cartItem.quantity = quantity;

    await cartItem.save();
    return res.status(200).json(cartItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating cart item' });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.deleteOne();
    return res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting cart item' });
  }
};
