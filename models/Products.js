import mongoose from "mongoose";

const Products = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      ref: "Categories",
    },
    productImage: {
      type: [String],
    },
    description: {
      type: String,
    },
    price: {
      type: String,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
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
Products.virtual("CategoriesObject", {
  ref: "Categories",
  localField: "category",
  foreignField: "categoriesCode",
  justOne: true,
});

Products.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

Products.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

Products.set("toObject", { virtuals: true });
Products.set("toJSON", { virtuals: true });

export default mongoose.model("Products", Products);
