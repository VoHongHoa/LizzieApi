import mongoose from "mongoose";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
const salt = bcrypt.genSaltSync(10);
export const signup = async (req, res, next) => {
  try {
    const user = req.user;
    const newUser = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, salt),
    });
    newUser.createdBy = new mongoose.Types.ObjectId(user._id);
    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: `Tạo mới người dùng thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
export const signin = async (req, res, next) => {
  //console.log(req.body);
  const user = await User.findOne({ userName: req.body.userName }).populate([
    { path: "RoleObject", select: "roleName" },
  ]);
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Tên đăng nhập không chính xác",
    });
  }
  const isCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isCorrect) {
    return res.status(200).json({
      success: false,
      message: "Mật khẩu không chính xác",
    });
  }
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT);

  const { password, ...others } = user._doc;
  res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, user: others, access_token: token });
  try {
  } catch (e) {
    //console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (e) {
    next(err);
  }
};

export const signUpCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, salt),
      customerCode: req.body.customerCode,
    });
    const customerExist = await Customer.find({
      customerCode: newCustomer.customerCode,
    });
    if (customerExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã người dùng đã tồn tại" });
    }
    await newCustomer.save();
    res.status(200).json({ success: true, message: `Đăng ký thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const signinCustomer = async (req, res, next) => {
  //console.log(req.body);
  const user = await Customer.findOne({
    customerCode: req.body.customerCode,
  });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Tên đăng nhập không chính xác",
    });
  }
  const isCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isCorrect) {
    return res.status(200).json({
      success: false,
      message: "Mật khẩu không chính xác",
    });
  }
  const token = jwt.sign(
    { _id: user._id, customerCode: user.customerCode },
    process.env.JWT
  );

  const { password, ...others } = user._doc;
  res
    .status(200)
    .json({ success: true, customer: others, access_token: token });
  try {
  } catch (e) {
    //console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
