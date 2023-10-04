import Products from "../models/Products.js";

const checkProductIsExist = async (productCode) => {
  const product = await Products.findOne({ productCode });
  if (!!product) {
    return true;
  }

  return false;
};

export { checkProductIsExist };
