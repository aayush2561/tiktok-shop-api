import Product from '../models/ProductModel.js';
import cloudinary from 'cloudinary';

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      category,
      stockQuantity,
      tags,
    } = req.body;

    if (!title || !description || !price || !category || !stockQuantity) {
      return res
        .status(400)
        .json({ message: 'All fields except tags are required.' });
    }

    let thumbnailUrl = null;
    if (
      req.files &&
      req.files['thumbnail'] &&
      req.files['thumbnail'].length > 0
    ) {
      const thumbnailUpload = await cloudinary.uploader.upload(
        req.files['thumbnail'][0].path
      );
      thumbnailUrl = thumbnailUpload.secure_url;
    }

    const imagesUrls = [];
    if (req.files && req.files['images']) {
      for (const file of req.files['images']) {
        const imageUpload = await cloudinary.uploader.upload(file.path);
        imagesUrls.push(imageUpload.secure_url);
      }
    }

    const newProduct = new Product({
      title,
      description,
      price,
      discountPercentage,
      category,
      stockQuantity,
      thumbnail: thumbnailUrl,
      images: imagesUrls,
      tags: tags || [],
      userId: req.user.id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured while creating product' });
  }
};

export const getAllproduct = async (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      const products = await Product.find({ category }).populate(
        'userId',
        '-password -role'
      );
      return res.status(200).json({ products });
    }

    const products = await Product.find().populate('userId', '-password -role');
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured while getting product.' });
  }
};

export const getProductbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByid(id).populate(
      'userId',
      '-password -role'
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured while getting product.' });
  }
};

export const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.id !== product.userId.toString()) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured while deleting product.' });
  }
};
