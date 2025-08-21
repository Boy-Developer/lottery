const asyncHandler = require("express-async-handler");
const NumberDetail = require("./model/numberDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");

//@desc Get all result number detail
//@route GET /api/result_number_detail
//@access private
const getAllResultNumberDetail = asyncHandler(async (req, res) => {
    const numberDetail = await NumberDetail.find({ type: LOTTERY_TYPE.LOTTERY_RESULT});

    // DEV ONLY delete all
    // numberDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await NumberDetail.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
});

//@desc Get by id result number detail
//@route GET /api/result_number_detail
//@access private
const getResultNumberDetailById = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create result number detail
//@route POST /api/result_number_detail
//@access private
const createResultNumberDetail = asyncHandler(async (req, res) => {
    const reqNumberDetails = req.body;
    for (const reqNumberDetail of reqNumberDetails) {
        const { result_post, result_schedule, result_date, result_time, result_lottery_2number, result_lottery_3number, result_lottery_4number } = reqNumberDetail;
        if (!result_post || !result_schedule || !result_date) {
            res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
        }
        const numberDetail = await NumberDetail.create(
            {
                type: LOTTERY_TYPE.LOTTERY_RESULT,
                result_post: result_post,
                result_schedule: result_schedule,
                result_date: result_date,
                result_time: result_time,
                result_lottery_2number: result_lottery_2number,
                result_lottery_3number: result_lottery_3number,
                result_lottery_4number: result_lottery_4number,
                area_id: req.user.id
            }
        );
    }
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, reqNumberDetails));
});

//@desc Delete result number detail
//@route DELETE /api/result_number_detail/:id
//@access private
const deleteResultNumberDetail = asyncHandler(async (req, res) => {

    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await NumberDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Update result number detail
//@route PUT /api/result_number_detail/:id
//@access private
const updateResultNumberDetail = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await NumberDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc POST result number details filtered by date
//@route POST /api/result_number_detail/fetch_by_date
//@access private
const fetchByDate = asyncHandler(async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const query = {};
    query.result_date = date;

    try {
        // Find numberDetails based on the query
        const numberDetails = await NumberDetail.find(query)
            .select('_id type result_post result_schedule result_date result_time result_lottery_2number result_lottery_3number result_lottery_4number createdAt updatedAt')
            .exec();

        // Send the final result
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetails));

    } catch (error) {
        // Handle any errors and send a response with the error message
        return res.status(500).json(new ResultMessage(CODE.ERROR, MESSAGE.ERROR, error.message));
    }
});


module.exports = { getAllResultNumberDetail, getResultNumberDetailById, createResultNumberDetail, deleteResultNumberDetail, updateResultNumberDetail, fetchByDate };