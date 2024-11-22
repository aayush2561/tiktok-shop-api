import User from '../models/UserModels.js';
import cloudinary from 'cloudinary';

export const updateUserProfile = async (req, res) => {
  const { name, email, bio } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      if (user.profilePhoto) {
        const oldPublicId = user.profilePhoto.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      user.profilePhoto = result.secure_url;
    }

    await user.save();

    return res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Error occured while updating profile' });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne(user);
    return res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Error occured while deleting profile' });
  }
};
export const getUserProfile = async (req, res) => {
  const userId = req.params.id ? req.params.id : req.user.id;
  const fieldsToExclude = ['password'];
  if (req.params.id) {
    fieldsToExclude.push('isVerified', 'role');
  }

  const selectFields = fieldsToExclude.map((field) => `-${field}`).join(' ');

  try {
    const userProfile = await User.findById(userId).select(selectFields);
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(userProfile);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Error occured while getting profile' });
  }
};
export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();
    return res
      .status(200)
      .json({ message: 'User role updated successfully', user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Failed to update user role', details: error.message });
  }
};
