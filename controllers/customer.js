import { createError } from "../error.js";
import mongoose from "mongoose";
import Customers from "../models/Customer.js";

export const createCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    const newCustomer = new Customers({ ...req.body });
    const customerExist = await Customers.find({
      customerCode: newCustomer.customerCode,
    });
    if (customerExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã người dùng đã tồn tại" });
    }
    newCustomer.customerSource = "Web Admin";
    newCustomer.createdBy = new mongoose.Types.ObjectId(user._id);
    await newCustomer.save();
    res
      .status(200)
      .json({ success: true, message: `Tạo mới người dùng thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const signUpCustomer = async (req, res) => {
  try {
    const newCustomer = new Customers({ ...req.body });
    const customerExist = await Customers.find({
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
