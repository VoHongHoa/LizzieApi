import { createError } from "../error.js";
import mongoose from "mongoose";
import Customer from "../models/Customer.js";

export const createCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    const newCustomer = new Customer({ ...req.body });
    const customerExist = await Customer.find({
      customerCode: newCustomer.customerCode,
    });
    if (customerExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã người dùng đã tồn tại" });
    }
    newCustomer.customerSource = "Web Admin";
    newCustomer.createdBy = new mongoose.Types.ObjectId(user._id);
    console.log(newCustomer);
    await newCustomer.save();
    res
      .status(200)
      .json({ success: true, message: `Tạo mới người dùng thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { customerCode } = req.params;
    const user = req.user;
    if (typeof customerCode !== "string") {
      next(createError(400, "Bad request"));
    }
    const customerExist = await Customer.find({
      customerCode: customerCode,
    });
    if (customerExist.length < 1) {
      return next(createError(404, "không tồn tại khách hàng"));
    }
    customerExist[0].customerName = req.body.customerName;

    customerExist[0].displayName = req.body.displayName;
    customerExist[0].telephone = req.body.telephone;
    customerExist[0].email = req.body.email;
    customerExist[0].gender = req.body.gender;
    customerExist[0].address = req.body.address;
    customerExist[0].img = req.body.img;

    customerExist[0].status = req.body.status;
    customerExist[0].updatedBy = new mongoose.Types.ObjectId(user._id);
    await customerExist[0].save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const deleteCustomers = async (req, res, next) => {
  try {
    const { customers } = req.body;
    Promise.all(
      customers.map(async (item) => {
        const customer = await Customer.findOne({ customerCode: item });
        if (!customer) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Customer.deleteMany({ customerCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const searchAction = async (req, res, next) => {
  try {
    const { searchOption, searchModel } = req.body;
    let query = {};
    if (!!searchModel.customerName) {
      query.customerName = {
        $regex: new RegExp(searchModel.customerName, "i"),
      };
    }
    if (!!searchModel.customerCode && searchModel.customerCode.length > 0) {
      query.customerCode = searchModel.customerCode;
    } else {
      query.customerCode = {
        $regex: new RegExp(searchModel.customerCode, "i"),
      };
    }
    if (!!searchModel.displayName) {
      query.displayName = {
        $regex: new RegExp(searchModel.displayName, "i"),
      };
    }
    if (!!searchModel.telephone) {
      query.telephone = {
        $regex: new RegExp(searchModel.telephone, "i"),
      };
    }
    if (!!searchModel.email) {
      query.email = {
        $regex: new RegExp(searchModel.email, "i"),
      };
    }
    if (!!searchModel.gender) {
      query.gender = {
        $regex: new RegExp(searchModel.gender, "i"),
      };
    }
    if (!!searchModel.address) {
      query.address = {
        $regex: new RegExp(searchModel.address, "i"),
      };
    }
    if (!!searchModel.status) {
      query.status = searchModel.status;
    }
    const customers = await Customer.find(query)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Customer.find(query).count();
    res.status(200).json({ success: true, customers, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
