const asyncHandler = require("express-async-handler");
const Schedule = require("./model/settingLotteryResultModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { MESSAGE, CODE } = require("../../app/constant/constants");
const { createAppLog } = require('../app_log_history/appLogHistoryController');

//@desc Get all lottery results
//@route GET /api/sett_lottery_result
//@access private
const getAllLotteryResults = asyncHandler(async (req, res) => {
    try {
        const results = await Schedule.find({});
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, results));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc Create a new lottery result
//@route POST /api/sett_lottery_result
//@access private
const createLotteryResult = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'SettLotteryResult',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/sett_lottery_result, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const { text, time, index_rm, row_rm, lucky_num } = req.body;
        if ( !text || !time || !index_rm || !row_rm || !lucky_num) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
        }
        
        // Check for duplicate text and time in DB
        const duplicate = await Schedule.findOne({
            text: text,
            time: time
        });
        
        if (duplicate) {
            return res.status(200).json(new ResultMessage(CODE.DUPLICATE, MESSAGE.DUPLICATE));
        }
        
        const result = await Schedule.create({ text, time, index_rm, row_rm, lucky_num });
        return res.status(201).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, result));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc Update a lottery result
//@route PUT /api/sett_lottery_result/:id
//@access private
const updateLotteryResult = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'SettLotteryResult',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/sett_lottery_result/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const result = await Schedule.findById(req.params.id);
        if (!result) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        const { text, time, index_rm, row_rm, lucky_num } = req.body;
        
        // Check for duplicate text and time in DB (excluding current record)
        const duplicate = await Schedule.findOne({
            $and: [
            { _id: { $ne: req.params.id } },
            { text: text || result.text },
            { time: time || result.time }
            ]
        });
        
        if (duplicate) {
            return res.status(200).json(new ResultMessage(CODE.DUPLICATE, MESSAGE.DUPLICATE));
        }

        result.text = text || result.text;
        result.time = time || result.time;
        result.index_rm = index_rm || result.index_rm;
        result.row_rm = row_rm || result.row_rm;
        result.lucky_num = lucky_num || result.lucky_num;
        
        const updatedResult = await result.save();
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, updatedResult));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc Delete a lottery result
//@route DELETE /api/sett_lottery_result/:id
//@access private
const deleteLotteryResult = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'SettLotteryResult',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/sett_lottery_result/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const result = await Schedule.findById(req.params.id);
        if (!result) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        
        const resDelResult = await result.deleteOne({_id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, resDelResult));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

module.exports = {
    getAllLotteryResults,
    createLotteryResult,
    updateLotteryResult,
    deleteLotteryResult,
};