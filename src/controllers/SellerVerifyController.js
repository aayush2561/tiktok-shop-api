import SellerRequest from '../models/SellerModel.js';
import cloudinary from '../../config/cloudinary.js';

export const requestSeller = async (req, res) => {
  try {
    const { identityType, shopInfo } = req.body;
    const { front, back } = req.files;

    if (
      !identityType ||
      !front ||
      !back ||
      !shopInfo ||
      !shopInfo.name ||
      !shopInfo.address ||
      !shopInfo.contact
    ) {
      return res
        .status(400)
        .json({
          message: 'Missing required fields (identity type, images, shop info)',
        });
    }

    const frontUpload = await cloudinary.uploader.upload(front.path, {
      folder: 'seller_requests',
    });
    const backUpload = await cloudinary.uploader.upload(back.path, {
      folder: 'seller_requests',
    });

    const newSellerRequest = new SellerRequest({
      userId: req.user._id,
      identityType,
      identityImages: {
        front: frontUpload.secure_url,
        back: backUpload.secure_url,
      },
      shopInfo,
      status: 'pending',
    });

    await newSellerRequest.save();

    res.status(201).json({
      message:
        'Seller request submitted successfully. Your request is under review.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        'An error occurred while processing your seller request. Please try again later.',
    });
  }
};
export const getAllSellerRequests = async (req, res) => {
  try {
    const sellerRequests = await SellerRequest.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(sellerRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        'An error occurred while retrieving the seller requests. Please try again later.',
    });
  }
};
export const getSellerRequestbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const sellerRequest = await SellerRequest.findById(id).populate(
      'userId',
      'name email'
    );

    if (!sellerRequest) {
      return res.status(404).json({ message: 'Seller request not found' });
    }
    res.status(200).json(sellerRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        'An error occurred while retrieving the seller request. Please try again later.',
    });
  }
};
