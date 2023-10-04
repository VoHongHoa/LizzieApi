use("MPS_DB_TEST");

//Get product rating value
db.ratings.aggregate([
  {
    $group: {
      _id: "$productCode",
      rating: { $avg: "$rating" },
    },
  },
]);

//Get detail rating report
