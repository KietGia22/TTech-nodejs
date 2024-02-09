const Order = require('../models/Order.model')
const moment = require('moment')
const {StatusCodes} = require('http-status-codes')

const getRevenueByDay = async(req, res) => {
    const startDate = moment().startOf('week');
    const endDate = moment();

    const revenueByDay = {};

    for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'day')) {
        const revenue = await Order.aggregate([
            {
                $match: {
                    create_order_at: {
                        $gte: date.startOf('day').toDate(),
                        $lte: date.endOf('day').toDate()
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        revenueByDay[date.format('dddd')] = revenue.length > 0 ? revenue[0].total : 0;
    }

    const result = {
        day: Object.keys(revenueByDay),
        revenue: Object.values(revenueByDay)
    };

    res.status(StatusCodes.OK).json({ result });
}

const getRevenueByYear = async(req, res) => {
    const {year} = req.body
    const endDate = moment();
    const labels = [];
    const revenues = [];

    for (let month = 1; month <= endDate.month(); month++) {
        const startDateOfMonth = moment().set({ year, month, date: 1 }).startOf('month');
        const endDateOfMonth = moment().set({ year, month, date: 1 }).endOf('month');

        const revenue = await Order.aggregate([
            {
                $match: {
                    create_order_at: { $gte: startDateOfMonth.toDate(), $lte: endDateOfMonth.toDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        labels.push(startDateOfMonth.format('MMMM'));
        revenues.push(revenue.length > 0 ? revenue[0].total : 0);
    }
    res.status(StatusCodes.OK).json({labels, revenues})
}

const getTopSellerProduct = async (req, res) => {
    const subquery = await DetailOrder.aggregate([
        {
            $group: {
                _id: '$product_id',
                total_quantity_sold: { $sum: '$quantity_pr' }
            }
        }
    ]);

    const result = await Product.aggregate([
        {
            $match: { _id: { $in: subquery.map(item => item._id) } }
        },
        {
            $lookup: {
                from: 'image',
                localField: '_id',
                foreignField: 'product_id',
                as: 'image'
            }
        },
        {
            $project: {
                product_id: '$_id',
                total_quantity_sold: { $arrayElemAt: ['$total_quantity_sold', 0] },
                product_name: '$name_pr',
                image: { $arrayElemAt: ['$image.image_path', 0] }
            }
        },
        {
            $sort: { total_quantity_sold: -1 }
        },
        {
            $limit: count
        }
    ]);
    res.status(StatusCodes.OK).json({result})
}

module.exports = {
    getRevenueByDay,
    getRevenueByYear,
    getTopSellerProduct
}