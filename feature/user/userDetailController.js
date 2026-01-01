const asyncHandler = require("express-async-handler");
const UserDetail = require("./model/userDetailModel");
const AppSetting = require("../app_setting/model/appSettingModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { MESSAGE, CODE, USER_TYPE } = require("../../app/constant/constants");
const { DateUtil } = require("../../app/util/dateUtil");
const LoginSession = require("./model/loginSessionModel");
const { v4: uuidv4 } = require('uuid');
const { createAppLog } = require('../app_log_history/appLogHistoryController');
const { decryptPwd } = require("../../app/crypto/AES");
const bcrypt = require("bcryptjs");

//@desc Get all user details
//@route GET /api/user_detail
//@access private
const getUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.find();
    const response = userDetail.map(user => {
    const userObj = user.toObject(); // convert mongoose doc to plain JS object

    // Extract permission-related keys and values
    const permission = {};
    for (const key of Object.keys(userObj)) {
      if (key.endsWith('_menu') || key.endsWith('_permission')) {
        permission[key] = userObj[key];
        delete userObj[key]; // remove from top-level user object
      }
    }

    //DEV ONLY delete all
    // userDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await UserDetail.deleteOne({ _id: num._id });
    // });

    // Add the grouped permission object
    userObj.permission = permission;

    return userObj;
  });
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', response));
});

//@desc Get by id user detail
//@route GET /api/user_detail/:id
//@access private
const getUserDetailById = asyncHandler(async (req, res) => {
    try {
        //const id = req.params.id;
        const userDetail = await UserDetail.findById(req.params.id);
        if (userDetail) userDetail.password = '***';
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', userDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc check login user detail
//@route GET /api/user_detail/login_status/:login_id
//@access private
const getLoginUserDetail = asyncHandler(async (req, res) => {
    const latestSession = await LoginSession.findOne({ login_id: req.params.login_id, session_status: 1 });
    if (!latestSession) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND, []));
    }
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', latestSession));
});

//@desc create user details
//@route POST /api/user_detail
//@access private
const createUserDetail = asyncHandler(async (req, res) => {
    const { 
        username, 
        phone_number, 
        password, 
        email_address, 
        address, 
        role_id, 
        login_status, 
        user_status, 
        first_login } = req.body;

    // check required fields
    if (!username || !phone_number || !password || !email_address || !address || !role_id) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    // condition to check null or undefined
    if (login_status === null || login_status === undefined || user_status === null || user_status === undefined || first_login === null || first_login === undefined) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }

    try {
        const userAvailable = await UserDetail.findOne({ email_address: email_address});
        if (userAvailable) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, 'the user is registered !'));
        }
        const usernameAvailable = await UserDetail.findOne({ username: username });
        if (usernameAvailable) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, 'the username has already !'));
        }
        const phoneAvailable = await UserDetail.findOne({ phone_number: phone_number });
        if (phoneAvailable) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, 'the phone number has already !'));
        }
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

    const decryptPwd = decryptData(password);
    req.body.password = await bcrypt.hash(decryptPwd, 10);

    const userDetail = await UserDetail.create({
        ...req.body,
        area_id: req.user.id
    });

    // remove pwd to save log
    userDetail.password = '***';
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'UserDetail',
        old_data: '',
        new_data: JSON.stringify(userDetail),
        client_access: 'methord:POST, end-point:DNS/api/user_detail, req-payload: new_data',
    };
    createAppLog(app_log);

    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, userDetail));
});

//@desc Update user details
//@route PUT /api/user_detail
//@access private
const updateUserDetail = asyncHandler(async (req, res) => {
    const { login_user_id, password } = req.body;
    if (password) {
        const decryptPwd = decryptData(password);
        req.body.password = await bcrypt.hash(decryptPwd, 10);
    };
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (userDetail.area_id?.toString().trim() !== String(req.user.id).trim() && userDetail.first_login !== 1) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    };

    try {
        const updateRes = await UserDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        // save log
        if (login_user_id){
            // remove pwd
            updateRes.password = '***';
            // proccess store log
            const app_log = {
                user_id: login_user_id,
                action: 'edit',
                feature: 'UserDetail',
                old_data: '',
                new_data: JSON.stringify(updateRes),
                client_access: 'methord:PUT, end-point:DNS/api/user_detail, req-payload: new_data',
            };
            createAppLog(app_log);
        };
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc Delete user details
//@route DELETE /api/user_detail/:id
//@access private
const deleteUserDetail = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (userDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await UserDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});

//@desc login user details
//@route POST /api/user_detail/login
//@access private
const login = asyncHandler(async (req, res) => {
    const { username, password , ip, location} = req.body;
    if (!username || !password || !ip || !location) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    };

    // get app setting datas
    const app_setting = await AppSetting.find({});
    const pwd_lift = app_setting.find(el => el.param === 'PWD_LIFT'); //អាយុកាលពាក្យសម្ងាត់ (ថ្ងៃ)
    const pwd_warn = app_setting.find(el => el.param === 'PWD_WARN'); //ការព្រមានអំពីការបញ្ចប់អាយុកាលពាក្យសម្ងាត់ (ថ្ងៃ)
    const pwd_atml = app_setting.find(el => el.param === 'PWD_ATML'); //ការប៉ុនប៉ងចូលអតិបរមា (ដង)
    // get user data
    const userDetail = await UserDetail.findOne({
        $or: [
            { username: username },
            { email_address: username },
            { phone_number: username }
        ],
    });

    // proccess store log
    const app_log = {
        user_id: userDetail._id,
        action: 'read',
        feature: 'Login',
        old_data: '',
        new_data: '***',
        client_access: 'methord:POST, end-point:DNS/api/user_detail/login, req-payload: new_data',
    };
    createAppLog(app_log);

    const pwd = decryptData(password); 
    //compare password with hashed password
    if (userDetail && (await bcrypt.compare(pwd, userDetail.password)) && userDetail.user_status === USER_TYPE.ACTIVE) {
        let msg = MESSAGE.LOGINED;
        // Process password validation checks
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const passwordAgeInDays = Math.floor(Math.abs((Date.now() - userDetail.createdAt) / ONE_DAY_MS));
        const daysUntilExpiry = Number(pwd_lift.sett_value) - passwordAgeInDays;
        const isPasswordExpired = passwordAgeInDays >= Number(pwd_lift.sett_value);
        const isPasswordWarning = daysUntilExpiry === Number(pwd_warn.sett_value);
        const isMaxAttemptsReached = userDetail.invalid_login_counter >= Number(pwd_atml.sett_value);

        // Check if password has expired
        if (isPasswordExpired) {
            // update first loging to 1 and createdAt to current date
            await UserDetail.findByIdAndUpdate(
                userDetail._id,
                { first_login: 1, createdAt: Date.now()},
                { new: true, timestamps: false, strict: false }
            );
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.EXPIRED_PWD));
        }

        // Check if password expiry warning should be shown
        if (isPasswordWarning) {
            msg = `${username} ពាក្យសម្ងាត់ផុតកំណត់ក្នុងរយះពេល ${daysUntilExpiry} ថ្ងៃ កំណត់ពាក្យសម្ងាត់ថ្មី`;
        }

        // Check if max login attempts exceeded
        if (isMaxAttemptsReached) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.ACCOUNT_LOCK));
        }
        // store session data
        const loginSession = await LoginSession.create(
            {
                username: username,
                user_id: userDetail._id,
                login_id: uuidv4(),
                ip: ip,
                location: location,
                area_id: req.user.id,
                session_status: 1
            }
        );
        // update login status to 1 (logged in)
        await UserDetail.findByIdAndUpdate(
            userDetail._id,
            { login_status: 1},
            { new: true }
        );

        const user = {
            "_id": userDetail._id,
            "username": userDetail.username,
            "phone_number": userDetail.phone_number,
            "email_address": userDetail.email_address,
            "address": userDetail.address,
            "login_on": new DateUtil().getCurrentTime().formattedDate,
            "time_out": 43200,
            "login_id": loginSession.login_id,
            "login_status" : userDetail.login_status,
            "first_login": userDetail.first_login
        };

        res.status(200).json({ code: CODE.SUCCESS, message: msg, user });
    } else {
        // invalid login coutnter can be added here
        try { 
            await UserDetail.findByIdAndUpdate(
                userDetail?._id,
                { $inc: { invalid_login_counter: 1 } },
                { new: true }
            );
        } catch (error) { 
            res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
            return;
        }
        res.status(200).json({ code: 203, message: MESSAGE.INVALID_LOGIN });
    }
});

//@desc login user details
//@route POST /api/user_detail/logout
//@access private
const logout = asyncHandler(async (req, res) => {
    const { login_id, user_id } = req.body;
    if (!login_id || !user_id) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }

    const latestSession = await LoginSession.findOne({ login_id: login_id });
    if (!latestSession) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        // update session status to 0 (logged out)
        await LoginSession.findByIdAndUpdate(
            {_id: latestSession._id},
            { session_status: 0 },
            { new: true }
        );

        // check if there are other active sessions
        const activeSessions = await LoginSession.find({ user_id: user_id, session_status: 1 });
        if (activeSessions.length > 0) {
            return res.status(200).json (new ResultMessage(CODE.SUCCESS, MESSAGE.LOGOUT));
        };

        // update login status to 0 (logged out)
        await UserDetail.findByIdAndUpdate(
            {_id : user_id},
            { login_status: 0},
            { new: true }
        );

        // proccess store log
        const app_log = {
            user_id: user_id,
            action: 'read',
            feature: 'LogOut',
            old_data: '',
            new_data: '***',
            client_access: 'methord:POST, end-point:DNS/api/user_detail/logout, req-payload: new_data',
        };
        createAppLog(app_log);
        return res.status(200).json (new ResultMessage(CODE.SUCCESS, MESSAGE.LOGOUT));
    }
    catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});

//@desc clear login session
//@route POST /api/user_detail/clear_login
//@access private
const clearLoginSession = asyncHandler(async (req, res) => {
    const { user_id, login_id } = req.body;
    if (!user_id || !login_id) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }

    try {
        await LoginSession.updateMany(
            { user_id: user_id, login_id: { $ne: login_id }, session_status: 1 },
            { session_status: 0 }
        );
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED));
    } catch (error) {
        res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});

//@desc change password
//@route POST /api/change_password
//@access private
const ChangePWD = asyncHandler(async (req, res) => {
    const {old_pass, new_pass, conf_new_pass, user_id } = req.body;
    const d_old_pass = decryptData(old_pass);
    const d_new_pass = decryptData(new_pass);
    const d_conf_new_pass = decryptData(conf_new_pass);
    if (!old_pass || !new_pass || !conf_new_pass || !user_id){
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    // get user data
    const userDetail = await UserDetail.findOne({_id : user_id});

    if ((d_new_pass !== d_conf_new_pass) || !(await bcrypt.compare(d_old_pass, userDetail.password))) {
        return res.status(200).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    };

    try { 
        const new_pwd = await bcrypt.hash(d_new_pass, 10);
        const updatePass = await UserDetail.findByIdAndUpdate(
            userDetail?._id,
            { password: new_pwd},
            { new: true }
        );

        // remove pwd
        updatePass.password = '***';
        // proccess store log
        const app_log = {
            user_id: user_id,
            action: 'edit',
            feature: 'UserDetail',
            old_data: '',
            new_data: JSON.stringify(updatePass),
            client_access: 'methord:POST, end-point:DNS/api/change_password, req-payload: new_data',
        };
        createAppLog(app_log);
    } catch (error) { 
        return res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
    return res.status(200).json({ code: CODE.SUCCESS, message: MESSAGE.SUCCESS });
});

//@desc decryptData
//@access private
const decryptData = (encryptedData) => {
    const decrypt_datas = decryptPwd(encryptedData, process.env.AES_PASSWORD);
    return decrypt_datas;
};

module.exports = { 
    getUserDetail, 
    createUserDetail, 
    updateUserDetail, 
    getUserDetailById,
    deleteUserDetail, 
    login, 
    logout, 
    getLoginUserDetail, 
    clearLoginSession, 
    ChangePWD
};
