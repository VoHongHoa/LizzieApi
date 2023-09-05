import mongoose from "mongoose";

const SaleDetail = new mongoose.Schema(
  {
    productCode: {
      type: String,
      ref: "Products",
    },
    quantity: {
      type: String,
      default: "0",
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

SaleDetail.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

SaleDetail.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

SaleDetail.set("toObject", { virtuals: true });
SaleDetail.set("toJSON", { virtuals: true });

export default mongoose.model("SaleDetail", SaleDetail);
