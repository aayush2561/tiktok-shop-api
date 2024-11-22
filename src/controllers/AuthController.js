import User from '../models/UserModels.js';
import OTP from '../models/OtpModel.js';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cloudinary from '../../config/cloudinary.js';
import bcrypt from 'bcryptjs';
import { sendMail } from '../utils/SendMail.js';
import { generateOTP } from '../utils/GenerateOtp.js';
import { generateToken } from '../utils/GenerateToken.js';
import PasswordResetToken from '../models/PasswordToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.role = 'user';
    let profilePhotoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePhotoUrl = result.secure_url;
    }
    const createdUser = new User({
      ...req.body,
      profilePhoto: profilePhotoUrl,
    });
    await createdUser.save();

    const resultObject = createdUser.toObject();
    delete resultObject.password;
    generateToken(resultObject, false, res);
    res.status(201).json(resultObject);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Error occured during signup, please try again later' });
  }
};
export const login = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (
      existingUser &&
      (await bcrypt.compare(req.body.password, existingUser.password))
    ) {
      const resultObject = existingUser.toObject();
      delete resultObject.password;
      generateToken(resultObject, false, res);
      return res.status(200).json(resultObject);
    }
    res.clearCookie('token');
    return res.status(404).json({ message: 'Invalid Credentails' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Some error occured while logging in, please try again later',
    });
  }
};
export const sendOtp = async (req, res) => {
  try {
    const existingUser = await User.findById(req.body.user);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await OTP.deleteMany({ user: existingUser._id });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOtp = new OTP({
      user: req.body.user,
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newOtp.save();

    const templatePath = join(__dirname, '../views/emails/otp.ejs');
    const html = await ejs.renderFile(templatePath, { otp });

    await sendMail(
      existingUser.email,
      'OTP Verification for Your TikTok Shop Account',
      html
    );

    return res.status(201).json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({
      message:
        'Some error occurred while resending OTP, please try again later',
    });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const isValidUser = await User.findById(req.body.userId);
    const resultObject = isValidUser.toObject();
    delete resultObject.password;
    if (!isValidUser) {
      return res.status(404).json({
        message: 'User not Found, for which the otp has been generated',
      });
    }

    const isOtpExisting = await OTP.findOne({ user: isValidUser._id });

    if (!isOtpExisting) {
      return res.status(404).json({ message: 'Otp not found' });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      await OTP.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: 'Otp has been expired' });
    }

    if (
      isOtpExisting &&
      (await bcrypt.compare(req.body.otp, isOtpExisting.otp))
    ) {
      await OTP.findByIdAndDelete(isOtpExisting._id);
      const verifiedUser = await User.findByIdAndUpdate(
        isValidUser._id,
        { isVerified: true },
        { new: true }
      );
      const safeUser = verifiedUser.toObject();
      delete safeUser.password;
      return res.status(200).json(safeUser);
    }
    return res.status(400).json({ message: 'Otp is invalid or expired' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Some Error occured' });
  }
};
export const forgotPassword = async (req, res) => {
  let newToken;
  try {
    const isExistingUser = await User.findOne({ email: req.body.email });
    if (!isExistingUser) {
      return res.status(404).json({ message: 'Provided email does not exist' });
    }

    const resultObject = isExistingUser.toObject();
    delete resultObject.password;

    await PasswordResetToken.deleteMany({ user: resultObject._id });

    const passwordResetToken = generateToken(resultObject, true);
    const hashedToken = await bcrypt.hash(passwordResetToken, 10);

    newToken = new PasswordResetToken({
      user: resultObject._id,
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newToken.save();
    const resetLink = `${process.env.ORIGIN}reset-password/${resultObject._id}/${passwordResetToken}`;
    const templatePath = join(__dirname, '../views/emails/passwordReset.ejs');
    const html = await ejs.renderFile(templatePath, {
      name: resultObject.name,
      resetLink,
    });

    await sendMail(
      isExistingUser.email,
      'Password Reset Link for Your TikTok Shop Account',
      html
    );

    return res
      .status(200)
      .json({ message: `Password Reset link sent to ${resultObject.email}` });
  } catch (error) {
    console.error('Error occurred while sending password reset mail:', error);
    return res
      .status(500)
      .json({ message: 'Error occurred while sending password reset mail' });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const isExistingUser = await User.findById(req.body.userId);
    const resultObject = isExistingUser.toObject();
    delete resultObject.password;

    if (!resultObject) {
      return res.status(404).json({ message: 'User does not exists' });
    }

    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: resultObject._id,
    });

    if (!isResetTokenExisting) {
      return res.status(404).json({ message: 'Reset Link is Not Valid' });
    }

    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({ message: 'Reset Link has been expired' });
    }

    if (
      isResetTokenExisting &&
      isResetTokenExisting.expiresAt > new Date() &&
      (await bcrypt.compare(req.body.token, isResetTokenExisting.token))
    ) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

      await User.findByIdAndUpdate(resultObject._id, {
        password: await bcrypt.hash(req.body.password, 10),
      });
      return res.status(200).json({ message: 'Password Updated Successfuly' });
    }

    return res.status(404).json({ message: 'Reset Link has been expired' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        'Error occured while resetting the password, please try again later',
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error);
  }
};
export const checkAuth = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      const resultobject = user.toObject();
      delete resultobject.password;
      return res.status(200).json(resultobject);
    }
    res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
