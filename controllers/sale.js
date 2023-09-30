import { createError } from "../error.js";
import SaleHeader from "../models/SaleHeader.js";
import SaleDetail from "../models/SaleDetail.js";

export const getDetailInvoice = async (req, res, next) => {
  try {
    const user = req.user;
    const { invoiceHeaderCode } = req.params;

    const invoiceHeader = await SaleHeader.findOne({ invoiceHeaderCode });
    if (!invoiceHeader) {
      return res.status(200).json({
        success: false,
        messsage: "Không tìm thấy hóa đơn",
      });
    }
    if (invoiceHeader.customerCode !== user.customerCode) {
      return res.status(200).json({
        success: false,
        message: "Không thể xem thông tin hóa đơn này",
      });
    }

    const detailInvoice = await SaleDetail.find({
      invoiceHeaderCode,
    }).populate([{ path: "ProductObject" }]);

    const result = {
      invoiceHeader,
      detailInvoice,
    };

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const getAllInvoiceByUser = async (req, res, next) => {
  try {
    const user = req.user;
    const { customerCode } = req.params;
    if (customerCode !== user.customerCode) {
      return res.status(400);
    }
    const invoices = await SaleHeader.find({
      customerCode,
    });
    return res.status(200).json({
      success: true,
      invoices,
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};

export const createSaleHeader = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    const { products, invoiceHeader } = req.body;
    const newInvoiceHeader = new SaleHeader(invoiceHeader);
    newInvoiceHeader.invoiceHeaderCode = "HD-" + new Date().getTime();
    newInvoiceHeader.customerCode = user.customerCode ? user.customerCode : "";
    newInvoiceHeader.createdBy = user._id ? user._id : "";
    newInvoiceHeader.save().then((result) => {
      Promise.all(
        products.map(async (product) => {
          const newDetail = new SaleDetail();
          newDetail.productCode = product.productCode;
          newDetail.invoiceHeaderCode = result.invoiceHeaderCode;
          newDetail.quantity = parseInt(product.quantity);
          newDetail.createdBy = user._id ? user._id : "";
          await newDetail.save();
          return true;
        })
      );
      return res.status(200).json({
        success: true,
        message: "Mua hàng thành công",
      });
    });
  } catch (e) {
    console.log(e);
    next(createError(404, "not found sorry!"));
  }
};
