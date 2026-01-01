const asyncHandler = require("express-async-handler");
const PermissionDetail = require("./model/permissionModel");
const Menu = require("../menu/model/menuModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { MESSAGE, CODE } = require("../../app/constant/constants");
const mongoose = require("mongoose");
const { createAppLog } = require('../app_log_history/appLogHistoryController');


//@desc Get all permission detail
//@route GET /api/permission
//@access private
const getAllPermissionDetail = asyncHandler(async (req, res) => {
    try {
        const permissionDetail = await PermissionDetail.find();
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, permissionDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc Get by id permission detail
//@route GET /api/permission
//@access private
const getPermissionDetailById = asyncHandler(async (req, res) => {
    try {
        const permissionDetail = await PermissionDetail.findOne({ _id: req.params.id});
        if (!permissionDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, permissionDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc Update permission detail
//@route PUT /api/permission/:id
//@access private
const updatePermissionDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'Permission',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/permission/:id, req-payload: new_data',
    };
    createAppLog(app_log);
    
    try {
        const permissionDetail = await PermissionDetail.findOne({ _id: req.params.id});
        if (!permissionDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (permissionDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await PermissionDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc Create permission detail
//@route POST /api/permission
//@access private
const createPermissionDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'Permission',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/permission, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const existingPermission = await PermissionDetail.findOne({ permission_name: req.body.permission_name });
        if (existingPermission) {
            return res.status(400).json(new ResultMessage(CODE.DUPLICATE, MESSAGE.DUPLICATE));
        }
        let app_menu = await Menu.find({});
        const user_id_permission = new mongoose.Types.ObjectId();
        const permissionDocs = [];

        // loop menu to create permission for main and sub menus
        app_menu.forEach(menu => {
            // main menu permission
            permissionDocs.push({
                user_id_permission,
                permission_name: req.body.permission_name,
                menu_id: menu._id,
                area_id: req.user.id,
                read: false,
                write: false,
                edit: false,
                delete: false
            });

            // sub menu permissions
            if (menu.sub && menu.sub.length > 0) {
                menu.sub.forEach(subMenu => {
                    permissionDocs.push({
                        user_id_permission,
                        permission_name: req.body.permission_name,
                        menu_id: subMenu._id,
                        area_id: req.user.id,
                        read: false,
                        write: false,
                        edit: false,
                        delete: false
                    });
                });
            }
        });
        const permissionDetail = await PermissionDetail.create(permissionDocs);
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, permissionDetail));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc delete permission detail by id
//@route DELETE /api/permission/:id
//@access private
const deletePermissionDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'Permission',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/permission/:id, req-payload: new_data',
    };
    createAppLog(app_log);
    try {
        const deleteRes = await PermissionDetail.findByIdAndDelete(req.params.id);
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, deleteRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

module.exports = { getAllPermissionDetail, getPermissionDetailById, updatePermissionDetail, createPermissionDetail, deletePermissionDetail };