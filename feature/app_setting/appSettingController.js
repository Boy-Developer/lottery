const asyncHandler = require("express-async-handler");
const AppSetting = require("./model/appSettingModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { MESSAGE, CODE , APP_SETTING} = require("../../app/constant/constants");

//@desc get all app setting
//@route GET /api/app_setting
//@access private
const getAppSetting = asyncHandler(async (req, res) => {
    try {
        let app_setting = await AppSetting.find({});
        // create app_setting if don't have data
        if (!app_setting || app_setting.length === 0) {
            await AppSetting.create(APP_SETTING);
            app_setting = await AppSetting.find({});
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, app_setting));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

//@desc update app setting
//@route POS /api/app_setting
//@access private
const updateAppSetting = asyncHandler(async (req, res) => {
    const { _id, sett_value} = req.body;
    if (!_id || !sett_value){
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    };
    try {
        await AppSetting.findByIdAndUpdate(
            {_id: _id},
            { sett_value: sett_value },
            { new: true }
        );
        return res.status(200).json (new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS));
    } catch {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});

module.exports = {
    getAppSetting,
    updateAppSetting
};