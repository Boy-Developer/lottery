const asyncHandler = require("express-async-handler");
const ShortcutModel = require("./model/shortcutModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { SHORTCUT_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");
const { createAppLog } = require('../app_log_history/appLogHistoryController');

//@desc Get all shortcut detail
//@route GET /api/shortcut
//@access private
const getAllPost = asyncHandler(async (req, res) => {
    const shortcut = await ShortcutModel.find({ type: SHORTCUT_TYPE.POST });

    //DEV ONLY delete all
    // shortcut.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await ShortcutModel.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, shortcut));
});

//@desc Get all shortcut detail
//@route GET /api/shortcut
//@access private
const getAllSchedule = asyncHandler(async (req, res) => {
    const shortcut = await ShortcutModel.find({ type: SHORTCUT_TYPE.SCHEDULE });

    //DEV ONLY delete all
    // shortcut.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await ShortcutModel.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, shortcut));
});

//@desc Get by id result number detail
//@route GET /api/result_number_detail
//@access private
const getPostById = asyncHandler(async (req, res) => {
    try {
        const shortcut = await ShortcutModel.findOne({ _id: req.params.id, type: SHORTCUT_TYPE.POST});
        if (!shortcut) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, shortcut));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc Get by id result number detail
//@route GET /api/result_number_detail
//@access private
const getScheduleById = asyncHandler(async (req, res) => {
    try {
        const shortcut = await ShortcutModel.findOne({ _id: req.params.id, type: SHORTCUT_TYPE.SCHEDULE});
        if (!shortcut) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, shortcut));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create shortcut detail
//@route POST /api/shortcut
//@access private
const createPost = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'ShortCutPost',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/shortcut, req-payload: new_data',
    };
    createAppLog(app_log);

    const { val, key } = req.body;
    if (!val || !key) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const shortcutDetail = await ShortcutModel.create(
        {
            type: SHORTCUT_TYPE.POST,
            val: val,
            key: key,
            area_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, shortcutDetail));
});

//@desc create shortcut detail
//@route POST /api/shortcut
//@access private
const createSchedule = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'ShortCutSchedule',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/shortcut, req-payload: new_data',
    };
    createAppLog(app_log);

    const { val, key } = req.body;
    if (!val || !key) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const shortcutDetail = await ShortcutModel.create(
        {
            type: SHORTCUT_TYPE.SCHEDULE,
            val: val,
            key: key,
            area_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, shortcutDetail));
});

//@desc Delete result number detail
//@route DELETE /api/result_number_detail/:id
//@access private
const deletePostById = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'ShortCutPost',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/result_number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const shortcutDetail = await ShortcutModel.findOne({ _id: req.params.id, type: SHORTCUT_TYPE.POST});
        if (!shortcutDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (shortcutDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await ShortcutModel.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Delete result number detail
//@route DELETE /api/result_number_detail/:id
//@access private
const deleteScheduleById = asyncHandler(async (req, res) => {

    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'ShortCutSchedule',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/result_number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const shortcutDetail = await ShortcutModel.findOne({ _id: req.params.id, type: SHORTCUT_TYPE.SCHEDULE});
        if (!shortcutDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (shortcutDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await ShortcutModel.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Update result number detail
//@route PUT /api/result_number_detail/:id
//@access private
const updatePostById = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'ShortCutPost',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/result_number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const shortcut = await ShortcutModel.findOne({ _id: req.params.id, type: SHORTCUT_TYPE.POST});
        if (!shortcut) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (shortcut.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await ShortcutModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc Update result number detail
//@route PUT /api/result_number_detail/:id
//@access private
const updateScheduleById = asyncHandler(async (req, res) => {

    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'ShortCutSchedule',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/result_number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const shortcut = await ShortcutModel.findOne({ _id: req.params.id, type: SHORTCUT_TYPE.SCHEDULE});
        if (!shortcut) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (shortcut.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await ShortcutModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

module.exports = {
    getAllPost,
    getPostById,
    createPost,
    deletePostById,
    updatePostById,
    getAllSchedule,
    getScheduleById,
    createSchedule,
    deleteScheduleById,
    updateScheduleById
};
