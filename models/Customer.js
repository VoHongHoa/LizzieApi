import mongoose from "mongoose";

const CustomersSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    customerCode: {
      type: String,
      require: true,
    },
    displayName: {
      type: String,
    },
    telephone: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      require: false,
    },
    img: {
      type: String,
    },
    customerSource: {
      type: String,
      default: false,
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
CustomersSchema.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

CustomersSchema.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

CustomersSchema.set("toObject", { virtuals: true });
CustomersSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Customers", CustomersSchema);
