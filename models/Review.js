import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      require: true,
    },
    productCode: {
      type: String,
      require: true,
    },
    review: {
      type: String,
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

ReviewSchema.virtual("CustomersObject", {
  ref: "Customers",
  localField: "customerCode",
  foreignField: "customerCode",
  justOne: true,
});

ReviewSchema.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

ReviewSchema.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

ReviewSchema.set("toObject", { virtuals: true });
ReviewSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Review", ReviewSchema);
