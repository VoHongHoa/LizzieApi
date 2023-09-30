import mongoose from "mongoose";

const SaleDetail = new mongoose.Schema(
  {
    productCode: {
      type: String,
      ref: "Products",
    },
    invoiceHeaderCode: {
      type: String,
      ref: "SaleHeader",
    },
    quantity: {
      type: Number,
      default: 0,
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

SaleDetail.virtual("SaleHeaderObject", {
  ref: "SaleHeader",
  localField: "invoiceHeaderCode",
  foreignField: "invoiceHeaderCode",
  justOne: true,
});

SaleDetail.virtual("ProductObject", {
  ref: "Products",
  localField: "productCode",
  foreignField: "productCode",
  justOne: true,
});

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
