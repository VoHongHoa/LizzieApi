import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      ref: "Customers",
      require: true,
    },
    productCode: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
  },
  { timestamps: true }
);

RatingSchema.virtual("productObject", {
  ref: "Products",
  localField: "productCode",
  foreignField: "productCode",
  justOne: true,
});

RatingSchema.virtual("CustomersObject", {
  ref: "Customers",
  localField: "customerCode",
  foreignField: "customerCode",
  justOne: true,
});

RatingSchema.virtual("UpdateUserObject", {
  ref: "Customers",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

RatingSchema.set("toObject", { virtuals: true });
RatingSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Rating", RatingSchema);
