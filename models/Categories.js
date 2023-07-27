import mongoose from "mongoose";

const Categories = new mongoose.Schema(
  {
    categoriesName: {
      type: String,
      required: true,
    },
    categoriesCode: {
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

Categories.virtual("CreateUserObject", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

Categories.virtual("UpdateUserObject", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true,
});

Categories.set("toObject", { virtuals: true });
Categories.set("toJSON", { virtuals: true });

export default mongoose.model("Categories", Categories);
