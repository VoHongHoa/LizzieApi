import mongoose from "mongoose";

const Unit = new mongoose.Schema(
  {
    unitName: {
      type: String,
      required: true,
    },
    unitCode: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USer",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

Unit.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

Unit.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

Unit.set("toObject", { virtuals: true });
Unit.set("toJSON", { virtuals: true });

export default mongoose.model("Unit", Unit);
