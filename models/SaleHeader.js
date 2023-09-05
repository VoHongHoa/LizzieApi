import mongoose from "mongoose";

const SaleHeader = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      ref: "Customers",
    },
    priceCost: {
      type: String,
    },
    promotionCode: {
      type: [],
    },
    billStatus: {
      type: String,
    },
    shipStatus: {
      type: String,
    },
    shipAddress: {
      type: String,
    },
    receivedPhone: {
      type: String,
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

SaleHeader.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});
SaleHeader.virtual("CustomerObject", {
  ref: "Customers",
  localField: "customerCode",
  foreignField: "customerCode",
  justOne: true,
});
SaleHeader.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

SaleHeader.set("toObject", { virtuals: true });
SaleHeader.set("toJSON", { virtuals: true });

export default mongoose.model("SaleHeader", SaleHeader);
