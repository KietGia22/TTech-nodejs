const Order = require('../models/Order.model')
const moment = require('moment')
const {StatusCodes} = require('http-status-codes')
const Product = require('../models/Product.model')

const getRevenueByDay = async(req, res) => {
    try {
        const today = moment(); // Lấy ngày hiện tại
        const startOfWeek = today.clone().startOf('week'); // Lấy ngày bắt đầu của tuần (chủ nhật)
        const endOfWeek = today.clone().endOf('week'); // Lấy ngày kết thúc của tuần (thứ bảy)

        // Tạo mảng các ngày trong tuần
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        // Lấy tổng doanh thu cho mỗi ngày trong tuần
        const weeklyTotal = await Order.aggregate([
        {
            $match: {
                create_order_at: {
                    $gte: startOfWeek.toDate(),
                    $lte: endOfWeek.toDate()
                }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: "$create_order_at" }, // Group the orders by day of the week
                total: { $sum: "$total" }
            }
        }
        ]);
        console.log(weeklyTotal)
        // Tạo mảng kết quả
        const weeklyTotalResult = daysOfWeek.map(day => {
            const totalObj = weeklyTotal.find(item => item._id === daysOfWeek.indexOf(day) + 1);
            console.log(totalObj);
            return { [day]: totalObj ? totalObj.total : 0 };
        });
        res.status(StatusCodes.OK).json({ result: weeklyTotalResult });
  } catch (error) {
        console.error("Error calculating weekly total:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

const getRevenueByYear = async(req, res) => {
    try {
    const { year } = req.body;

    // Kiểm tra xem year có hợp lệ không
    if (!year || isNaN(year)) {
      return res.status(400).json({ error: "Invalid year provided" });
    }

    // Tạo ngày bắt đầu và kết thúc của năm
    const startOfYear = moment({ year }).startOf('year');
    console.log(startOfYear)
    const endOfYear = moment({ year }).endOf('year');
    console.log(endOfYear)

    // Tính tổng doanh thu cho năm đó
    const yearlyRevenue = await Order.aggregate([
      {
        $match: {
          create_order_at: {
            $gte: startOfYear.toDate(),
            $lte: endOfYear.toDate()
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ]);
    console.log(yearlyRevenue)
    // Trả về kết quả
    res.status(StatusCodes.OK).json({ result: yearlyRevenue.length > 0 ? yearlyRevenue[0].total : 0 });
  } catch (error) {
    console.error("Error calculating yearly revenue:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

const getTopSellerProduct = async (req, res) => {
    // const subquery = await DetailOrder.aggregate([
    //     {
    //         $group: {
    //             _id: '$product_id',
    //             total_quantity_sold: { $sum: '$quantity_pr' }
    //         }
    //     }
    // ]);

    // const result = await Product.aggregate([
    //     {
    //         $match: { _id: { $in: subquery.map(item => item._id) } }
    //     },
    //     {
    //         $lookup: {
    //             from: 'image',
    //             localField: '_id',
    //             foreignField: 'product_id',
    //             as: 'image'
    //         }
    //     },
    //     {
    //         $project: {
    //             product_id: '$_id',
    //             total_quantity_sold: { $arrayElemAt: ['$total_quantity_sold', 0] },
    //             product_name: '$name_pr',
    //             image: { $arrayElemAt: ['$image.image_path', 0] }
    //         }
    //     },
    //     {
    //         $sort: { total_quantity_sold: -1 }
    //     },
    //     {
    //         $limit: count
    //     }
    // ]);
    // res.status(StatusCodes.OK).json({result})
    // res.send(`hehe chua lam`)
    try {
    const { count } = req.body;

    // Kiểm tra xem count có hợp lệ không
    if (!count || isNaN(count) || count <= 0) {
      return res.status(400).json({ error: "Invalid count provided" });
    }

    // Sử dụng aggregation để nhóm các đơn hàng theo sản phẩm và tính số lượng sản phẩm được mua
    const mostPurchasedProducts = await Order.aggregate([
      {
        $unwind: "$orderItems" // Tách mỗi mục trong orderItems thành một document riêng
      },
      {
        $group: {
          _id: "$orderItems.product",
          totalQuantity: { $sum: "$orderItems.quantity" }
        }
      },
      {
        $sort: { totalQuantity: -1 } // Sắp xếp theo số lượng giảm dần
      },
      {
        $limit: count // Chỉ lấy số lượng sản phẩm tối đa được chỉ định
      }
    ]);

    // Kiểm tra xem có sản phẩm nào được mua nhiều nhất không
    if (mostPurchasedProducts.length === 0) {
      return res.status(404).json({ error: "No product found." });
    }

    // Lấy thông tin sản phẩm từ _id của sản phẩm
    const productIds = mostPurchasedProducts.map(product => product._id);
    const mostPurchasedProductNames = await Product.find({ _id: { $in: productIds } });

    // Tạo mảng kết quả với thông tin sản phẩm và số lượng
    const result = mostPurchasedProducts.map((product, index) => ({
      productName: mostPurchasedProductNames[index].name,
      totalQuantity: product.totalQuantity
    }));

    // Trả về kết quả
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error finding most purchased products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
    getRevenueByDay,
    getRevenueByYear,
    getTopSellerProduct
}