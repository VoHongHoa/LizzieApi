import mongoose from "mongoose";

const WhiteList = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      ref: "Customers",
      require: true,
    },

    productCode: {
      type: String,
      ref: "Products",
      require: true,
    },
  },
  { timestamps: true }
);

WhiteList.virtual("CustomerObject", {
  ref: "Customers",
  localField: "customerCode",
  foreignField: "customerCode",
  justOne: true,
});

WhiteList.virtual("ProductObject", {
  ref: "Products",
  localField: "productCode",
  foreignField: "productCode",
  justOne: true,
});

WhiteList.set("toObject", { virtuals: true });
WhiteList.set("toJSON", { virtuals: true });

export default mongoose.model("WhiteList", WhiteList);
