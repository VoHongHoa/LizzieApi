import mongoose from "mongoose";
import { createError } from "../error.js";
import Role from "../models/Role.js";

const checkDataIsValid = (value, key) => {
  if (typeof value !== key) {
    return fasle;
  }
  return true;
};

export const createRole = async (req, res, next) => {
  try {
    const newRole = new Role({
      ...req.body,
    });
    newRole.createdBy = req.user._id;
    const role = await Role.findOne({ roleCode: req.body.roleCode });
    if (role) {
      return res.status(200).json({
        success: false,
        message: "Mã vai trò đã tồn tại",
      });
    }
    await newRole.save();
    res.status(200).json({
      success: true,
      message: "Tạo mới vai trò thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getAllRole = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (e) {
    next(createError(404, "not found sorry!"));
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { roles } = req.body;
    Promise.all(
      roles.map(async (item) => {
        const role = await Role.findOne({ roleCode: item });
        if (!role) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await Role.deleteMany({ roleCode: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    next(createError(404, "not found sorry"));
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const user = req.user;
    if (typeof roleId !== "string") {
      next(createError(400, "Bad request"));
    }
    const role = await Role.findById(new mongoose.Types.ObjectId(roleId));
    if (!role) {
      return next(createError(404, "không tồn tại role trên"));
    }
    role.roleName = req.body.roleName;
    role.updatedBy = new mongoose.Types.ObjectId(user._id);
    await role.save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
export const getDataFilter = async (req, res, next) => {
  try {
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
export const searchAction = async (req, res, next) => {
  try {
    const { searchOption, searchModel } = req.body;
    let querry = {};
    if (searchModel.roleCode.length === 0) {
      querry = {
        roleName: { $regex: searchModel.roleName, $options: "i" },
      };
    } else {
      querry = {
        $and: [
          { roleName: { $regex: searchModel.roleName, $options: "i" } },
          { roleCode: { $in: searchModel.roleCode } },
        ],
      };
    }
    const roles = await Role.find(querry)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);

    const totalDocs = await Role.find(querry).count();
    res.status(200).json({ roles, totalDocs });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const updatePermission = async (req, res, next) => {
  const { permission } = req.body;
  const { roleId } = req.params;
  const user = req.user;
  try {
    if (typeof roleId !== "string") {
      next(createError(400, "Bad request"));
    }
    const role = await Role.findById(new mongoose.Types.ObjectId(roleId));
    if (!role) {
      return next(createError(404, "không tồn tại role trên"));
    }
    role.permission = permission;
    role.updatedBy = new mongoose.Types.ObjectId(user._id);
    await role.save();
    res.status(200).json({
      success: true,
      message: "Chỉnh sửa phân quyền thành công",
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const getRoleById = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    if (typeof roleId !== "string") {
      return next(createError(400, "Bad request"));
    }
    const role = await Role.findById(new mongoose.Types.ObjectId(roleId));
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy vai trò",
      });
    }
    return res.status(200).json(role);
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};
