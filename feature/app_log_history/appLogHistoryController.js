const appLogHistory = require("./model/appLogHistoryModel");
const asyncHandler = require("express-async-handler");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { CODE, MESSAGE } = require("../../app/constant/constants");

//@desc create application log history
//@access private
const createAppLog = async (datas) => {
    try {
        await appLogHistory.create(datas);
    } catch (error) {
        console.log(`AppLogHistory>createAppLog: error : ${error}`);
    };
};

//@desc create application log history
//@route GET /api/app_log
//@access private
const getApplog = asyncHandler(async (req, res)=> {
    const {
        user_id,
        action,
        date_time
    } = req.body;
    // Build the query object based on provided filters
    const query = {};
    if (user_id) query.user_id = user_id;
    if (action) query.action = action;
    if (date_time) {
        // convert to get start of day and end of day
        const date = new Date(date_time);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
        query.date_time = {
            $gte: startOfDay,
            $lte: endOfDay
        };
    }
    // pro cess get data
    try {
        // proccess store log
        const app_log = {
            user_id: req.body.login_user_id,
            action: 'read',
            feature: 'AppLogHistory',
            old_data: '',
            new_data: JSON.stringify(req.body),
            client_access: 'methord:GET, end-point:DNS/api/app_log, req-payload: new_data',
        };
        createAppLog(app_log);
        const app_Log_data = await appLogHistory.find(query).exec();
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, app_Log_data));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.ERROR, MESSAGE.ERROR, error.message));
    }
});


module.exports = {
    createAppLog,
    getApplog
};