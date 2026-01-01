const asyncHandler = require("express-async-handler");
const Schedule = require("./model/scheduleDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { MESSAGE, CODE } = require("../../app/constant/constants");
const { createAppLog } = require('../app_log_history/appLogHistoryController');

//@desc Get all schedules
//@route GET /api/schedule_detail
//@access private
const getAllSchedules = asyncHandler(async (req, res) => {
    try {
        const schedules = await Schedule.find({});
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, schedules));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc Create a new schedule
//@route POST /api/schedule_detail
//@access private
const createSchedule = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'ScheduleDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/schedule_detail, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const { schedule_name } = req.body;
        if (!schedule_name) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
        }
        
        // Check for duplicate schedule_name
        const existingSchedule = await Schedule.findOne({ schedule_name });
        if (existingSchedule) {
            return res.status(200).json(new ResultMessage(CODE.DUPLICATE, MESSAGE.DUPLICATE));
        }
        
        const schedule = await Schedule.create({ schedule_name });
        return res.status(201).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, schedule));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc Update a schedule
//@route PUT /api/schedule_detail/:id
//@access private
const updateSchedule = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'ScheduleDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/schedule_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        const { schedule_name } = req.body;
        
        // Check for duplicate schedule_name
        const existingSchedule = await Schedule.findOne({ schedule_name, _id: { $ne: req.params.id } });
        if (existingSchedule) {
            return res.status(200).json(new ResultMessage(CODE.DUPLICATE, MESSAGE.DUPLICATE));
        }
        
        schedule.schedule_name = schedule_name;
        const updatedSchedule = await schedule.save();
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, updatedSchedule));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc Delete a schedule
//@route DELETE /api/schedule_detail/:id
//@access private
const deleteSchedule = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'ScheduleDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/schedule_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDelSchedule = await Schedule.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDelSchedule));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

module.exports = {
    getAllSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
};