import moment from "moment/moment.js";
import { createError } from "../error.js";
import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      //console.log(updateUser);
      res.status(200).json(updateUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account"));
  }
};
export const getUserÌnfor = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    next(createError(400, "Sorry not dound"));
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    const { dataDelete } = req.body;
    console.log(req.body);
    Promise.all(
      dataDelete.map(async (item) => {
        const user = await User.findOne({ _id: item });
        if (!user) {
          return undefined;
        }
        return item;
      })
    ).then(async (result) => {
      const dataDelete = result.filter((item) => item);
      await User.deleteMany({ _id: { $in: dataDelete } });

      return res.status(200).json({
        success: true,
        message: "Xóa dữ liệu thành công",
      });
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry"));
  }
};

export const search = async (req, res, next) => {
  try {
    const { searchModel, searchOption } = req.body;
    console.log(searchModel);
    const query = {};
    if (!!searchModel.userName) {
      query.userName = {
        $regex: new RegExp(searchModel.userName, "i"),
      };
    }
    if (!!searchModel.userCode) {
      query.userCode = searchModel.userCode;
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
    if (!!searchModel.gender) {
      query.gender = {
        $regex: new RegExp(searchModel.gender, "i"),
      };
    }
    if (!!searchModel.roleCode) {
      query.role = {
        $regex: new RegExp(searchModel.roleCode, "i"),
      };
    }
    if (!!searchModel.createdAt) {
      const dateStart = moment(new Date(searchModel.createdAt[0])).startOf(
        "day"
      );
      const dateEnd = moment(new Date(searchModel.createdAt[1])).endOf("day");
      query.createdAt = {
        $gte: dateStart,
        $lte: dateEnd,
      };
    }
    const users = await User.find(query)
      .populate([
        { path: "CreateUserObject", select: "userName" },
        { path: "UpdateUserObject", select: "userName" },
        { path: "RoleObject", select: "roleName" },
      ])
      .limit(searchOption.limit)
      .skip((searchOption.page - 1) * searchOption.limit);
    const total = await User.find(query).count();
    return res.status(200).json({
      success: true,
      users,
      total,
    });
  } catch (e) {
    console.log(e);
    next(createError(400, "Sorry not found"));
  }
};
