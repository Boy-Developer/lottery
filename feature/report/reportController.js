const asyncHandler = require("express-async-handler");
const NumberDetail = require("../number/model/numberDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");
const { v4: uuidv4 } = require('uuid');



//@desc Get report
//@route POST /api/report/fetch
//@access private
const getCompareReport = asyncHandler(async (req, res) => {
    const { schedule, date, group, page_no, type } = req.body;
    
    // Build the query object based on provided filters
    const query = {};
    if (schedule) {
        query.schedule = schedule;
    }
    if (date) {
        query.date = date;
    }
    if (group) {
        query.group = group;
    }
    if (page_no) {
        query.page_no = page_no;
    }
    if (type) {
        query.type = type;
    }
    const resultQuery = {};
    if (date) {
        resultQuery.result_date = date;
    }
    resultQuery.type = LOTTERY_TYPE.LOTTERY_RESULT;

    let response;
    try {
        // Find numberDetails based on the query
        const numberDetails = await NumberDetail.find(query).exec();
        const resultNumbers = await NumberDetail.find(resultQuery).exec();
        response = {
            "number": numberDetails,
            "result": resultNumbers
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, response));

    } catch (error) {
        // Handle any errors and send a response with the error message
        return res.status(500).json(new ResultMessage(CODE.ERROR, MESSAGE.ERROR, error.message));
    }
});
//@desc Get report
//@route POST /api/report/fetch
//@access private
const getReport = asyncHandler(async (req, res) => {
    const { start_date, end_date, group, type, income_per_1k } = req.body;
    
    // Check if the dates are valid and convert them to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Ensure the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json(new ResultMessage(CODE.INVALID_INPUT, MESSAGE.INVALID_DATE_FORMAT));
    }

    // Build the filter condition
    const filter = {
        date: {
            $gte: startDate,  // Start date (greater than or equal to)
            $lte: endDate     // End date (less than or equal to)
        }
    };

    if (group) {
        filter.group = group;
    }

    if (type) {
        filter.type = type;
    }

    var income_per_1k_select = 1;
    if (income_per_1k) {
        income_per_1k_select = income_per_1k;
    }

    const reportData = await NumberDetail.aggregate([
        {
            $match: filter
        },
        {
            $group: {
                _id: "$user_id",
                total_page: { $addToSet: "$page_no" }, // Unique page_no
                total_number: { $sum: 1 }              // Count docs        
            }
        },
        {
            $project: {
                total_page: { $size: "$total_page" },  // Count unique page_no
                total_number: 1
            }
        },
        {
            $addFields: {
                user_id_obj: { $toObjectId: "$_id" }   // Convert _id to ObjectId
            }
        },
        {
            $lookup: {
                from: "ltr_user_details",              // Make sure this is the correct collection name
                localField: "user_id_obj",             // ✅ Use the converted ObjectId here
                foreignField: "_id",                   // Join on _id in ltr_user_details
                as: "userInfo"
            }
        },
        {
            $unwind: {
                path: "$userInfo",
                preserveNullAndEmptyArrays: true       // Keep even if no match
            }
        },
        {
            $project: {
                _id: 1,
                username: "$userInfo.username",         // ✅ Add username
                total_page: 1,
                total_number: 1
            }
        }
    ]);

    // Add `no` field
    const reportWithNo = reportData.map((item, index) => ({
        no: index + 1, // Start from 1
        ...item,
        income_per_1k: income_per_1k_select,
        salary: (item.total_number/1000) * income_per_1k_select
    }));

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, reportWithNo));
});

module.exports = { 
    getReport,
    getCompareReport
};
