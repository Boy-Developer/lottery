const asyncHandler = require("express-async-handler");
const GroupMember = require("./model/groupMemberModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { CODE, MESSAGE } = require("../../app/constant/constants");
const { createAppLog } = require('../app_log_history/appLogHistoryController');

//@desc Get all group member
//@route GET /api/group_member
//@access private
const getAllGroupMember = asyncHandler(async (req, res) => {
    const groupMember = await GroupMember.find();

    //DEV ONLY delete all
    // groupMember.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await GroupMember.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, groupMember));
});

//@desc Get by id group member
//@route GET /api/group_member/:id
//@access private
const getGroupMemberById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const groupMember = await GroupMember.findById(id);
        if (!groupMember) {
            return res.status(404).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }

        if (groupMember.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }

        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, groupMember));
    } catch (error) {
        console.error('getGroupMemberById error:', error);
        return res.status(500).json(new ResultMessage(CODE.SERVER_ERROR, MESSAGE.SERVER_ERROR || 'Internal server error'));
    }
});

//@desc create group member
//@route POST /api/group_member
//@access private
const createGroupMember = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'GroupMember',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/group_member, req-payload: new_data',
    };
    createAppLog(app_log);

    const { real_name, nick_name, phone, lottery_type, multi_x2, multi_x3,
        pay_x2, pay_x3, pay_x4, pay_x5, percentage, key,
        multi_x2up, multi_x3up, pay_x2up, pay_x3up
    } = req.body;
    if (!real_name || !nick_name || !phone || !lottery_type || !multi_x2
        || !multi_x3 || !pay_x2 || !pay_x3 || !pay_x4 || !pay_x5 || !percentage
        || !key || !multi_x2up || !multi_x3up || !pay_x2up || !pay_x3up
    ) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const groupMember = await GroupMember.create(
        {
            real_name: real_name,
            nick_name: nick_name,
            phone: phone,
            lottery_type: lottery_type,
            multi_x2: multi_x2,
            multi_x3: multi_x3,
            pay_x2: pay_x2,
            pay_x3: pay_x3,
            pay_x4: pay_x4,
            pay_x5: pay_x5,
            multi_x2up: multi_x2up,
            multi_x3up: multi_x3up,
            pay_x2up: pay_x2up,
            pay_x3up: pay_x3up,
            percentage: percentage,
            key: key,
            area_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, groupMember));
});

//@desc Delete group member
//@route DELETE /api/group_member/:id
//@access private
const deleteGroupMember = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'GroupMember',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/group_member/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (groupMember.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await GroupMember.deleteOne({ _id: req.params.id });
        return res.status(201).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Update group member
//@route PUT /api/group_member/:id
//@access private
const updateGroupMember = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'GroupMember',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/group_member/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (groupMember.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await GroupMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});


module.exports = { getAllGroupMember, getGroupMemberById, createGroupMember, deleteGroupMember, updateGroupMember };