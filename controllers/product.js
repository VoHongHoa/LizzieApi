import { createError } from "../error.js";
import mongoose from "mongoose";
import Products from "../models/Products.js";

export const getProductByProductCode = async (req, res) => {
  try {
    const { productCode } = req.params;
    const product = await Products.findOne(productCode);
    if (!product) {
      return res.status(200).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const deleteProducts = async (req, res, next) => {
  try {
    const { products } = req.body;
    Promise.all(
      products.map(async (item) => {
        const product = await Products.findOne({ productCode: item });
        if (!product) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Products.deleteMany({ productCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { productCode } = req.params;
    const user = req.user;
    if (typeof productCode !== "string") {
      next(createError(400, "Bad request"));
    }
    const productExist = await Products.find({
      productCode: productCode,
    });
    if (productExist.length < 1) {
      return next(createError(404, "Không tồn tại  sản phẩm"));
    }
    productExist[0].productName = req.body.productName;
    productExist[0].category = req.body.category;
    productExist[0].color = req.body.color;
    productExist[0].description = req.body.description;
    productExist[0].size = req.body.size;
    productExist[0].price = req.body.price;
    productExist[0].productImage = req.body.productImage;
    productExist[0].status = req.body.status;
    productExist[0].updatedBy = new mongoose.Types.ObjectId(user._id);
    await productExist[0].save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const searchAction = async (req, res, next) => {
  try {
    const { searchOption, searchModel } = req.body;
    let query = {};
    if (!!searchModel.productName) {
      query.productName = {
        $regex: new RegExp(searchModel.productName, "i"),
      };
    }
    if (!!searchModel.productCode) {
      query.productCode = searchModel.productCode;
    }
    if (!!searchModel.category) {
      query.category = searchModel.category;
    }
    if (!!searchModel.color) {
      query.color = {
        $regex: new RegExp(searchModel.color, "i"),
      };
    }
    if (!!searchModel.price) {
      query.price = {
        $regex: new RegExp(searchModel.price, "i"),
      };
    }
    if (!!searchModel.size) {
      query.size = {
        $regex: new RegExp(searchModel.size, "i"),
      };
    }
    if (!!searchModel.status) {
      query.status = searchModel.status;
    }
    const products = await Products.find(query)
      .populate([
        { path: "CategoriesObject", select: "categoriesName" },
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Products.find(query).count();
    res.status(200).json({ success: true, products, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const newProduct = new Products({ ...req.body });
    const productExist = await Products.find({
      productCode: newProduct.productCode,
    });
    if (productExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã sản phẩm đã tồn tại" });
    }
    newProduct.createdBy = new mongoose.Types.ObjectId(user._id);
    await newProduct.save();
    res
      .status(200)
      .json({ success: true, message: `Tạo mới sản phẩm thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
