import { createError } from "../error.js";
import Unit from "../models/Unit.js";
import mongoose from "mongoose";

export const updateUnit = async (req, res, next) => {
  try {
    const { unitCode } = req.params;
    const user = req.user;
    if (typeof unitCode !== "string") {
      next(createError(400, "Bad request"));
    }
    const unitExist = await Unit.find({
      unitCode: unitCode,
    });
    if (unitExist.length < 1) {
      return next(createError(404, "không tồn tại đơn vị tính"));
    }
    unitExist[0].unitName = req.body.unitName;
    unitExist[0].status = req.body.status;
    unitExist[0].updatedBy = new mongoose.Types.ObjectId(user._id);
    await unitExist[0].save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const deleteUnits = async (req, res, next) => {
  try {
    const { units } = req.body;
    Promise.all(
      units.map(async (item) => {
        const unit = await Unit.findOne({ unitCode: item });
        if (!unit) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Unit.deleteMany({ unitCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const createUnit = async (req, res, next) => {
  try {
    const user = req.user;
    const unit = new Unit({ ...req.body });
    const unitsExist = await Unit.find({
      unitCode: unit.unitCode,
    });
    if (unitsExist.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Mã đơn vị tính đã tồn tại" });
    }
    unit.createdBy = new mongoose.Types.ObjectId(user._id);
    await unit.save();
    return res
      .status(200)
      .json({ success: true, message: `Tạo mới đơn vị tính thành công` });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
export const searchAction = async (req, res, next) => {
  try {
    const { searchOption, searchModel } = req.body;
    let query = {};
    if (!!searchModel.unitName) {
      query.unitName = {
        $regex: new RegExp(searchModel.unitName, "i"),
      };
    }
    if (!!searchModel.unitCode && searchModel.unitCode.length > 0) {
      query.unitCode = searchModel.unitCode;
    } else {
      query.unitCode = {
        $regex: new RegExp(searchModel.unitCode, "i"),
      };
    }
    if (!!searchModel.status) {
      query.status = searchModel.status;
    }
    const units = await Unit.find(query)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Unit.find(query).count();
    res.status(200).json({ success: true, units, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
