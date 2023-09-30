
use('MPS_DB_TEST');

// db.saledetails.find();

db.saledetails.aggregate([
    {
        $group: {
          _id: "$productCode",
          sumOfQuantity: {
            $sum: "$quantity"
          }
        }
    },
    {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "productCode",
          as: "productObject"
        }
    },
    
    {$unwind: '$productObject'},
    {
      $project: {
        sumOfQuantity: 1,
        category: "$productObject.category",
        productObject: "$productObject"
      }
    },
    {
      $match: {$and:[{category:"Gucci"}]}
    },
]);



