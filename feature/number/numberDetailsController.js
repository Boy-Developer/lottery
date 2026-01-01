const asyncHandler = require("express-async-handler");
const NumberDetail = require("./model/numberDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");
const { v4: uuidv4 } = require('uuid');
const { createAppLog } = require('../app_log_history/appLogHistoryController');

//@desc Get all number detail
//@route GET /api/number_detail
//@access private
const getAllNumberDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'read',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:GET, end-point:DNS/api/number_detail, req-payload: new_data',
    };
    createAppLog(app_log);

    const numberDetail = await NumberDetail.find({ type: LOTTERY_TYPE.LOTTERY_NUMBER});

    //DEV ONLY delete all
    // numberDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await NumberDetail.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
});

//@desc Get by id number detail
//@route GET /api/number_detail/:id
//@access private
const getNumberDetailById = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'read',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:GET, end-point:DNS/api/number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id,  type: LOTTERY_TYPE.LOTTERY_NUMBER });
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create number detail
//@route POST /api/number_detail
//@access private
const createNumberDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    const dataEntries = [];

    req.body.forEach(item => {
        const { page_no, date, time, group, datas } = item;

        datas.forEach(data => {
            const { column_no, main_row } = data;

            main_row.forEach(rowItem => {
                const row_id = uuidv4();
                const { row, post, schedule } = rowItem;

                row.forEach(rowData => {
                    const { number, amount, currency, type } = rowData;
                    const formattedData = {
                        page_no,
                        date,
                        time,
                        group,
                        column_no,
                        number,
                        amount,
                        currency,
                        type,
                        post,
                        schedule,
                        row_id
                    };

                    dataEntries.push(formattedData);
                });
            });
        });
    });

    const newDataEntries = await Promise.all(dataEntries.map(async (entry) => {
        const { page_no, date, time, group, column_no, number, amount, currency, type, post, schedule, row_id } = entry;

        return await NumberDetail.create({
            // type: LOTTERY_TYPE.LOTTERY_NUMBER,
            type,
            page_no,
            date,
            time,
            group,
            column_no,
            number,
            amount,
            currency,
            post,
            schedule,
            row_id
        });
    }));
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, newDataEntries));
});

//@desc create number detail
//@route POST /api/number_detail
//@access private
const createNumberDetailV2 = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    const dataEntries = [];

    req.body.forEach(item => {
        const {
            page_no,
            date,
            time,
            group,
            column_no,
            number,
            amount,
            currency,
            type,
            post,
            schedule,
            row_id,
            row_no,
            column_check_id,
            no,
            user_id
        } = item;

        dataEntries.push({
            page_no,
            date,
            time,
            group,
            column_no,
            number,
            amount,
            currency,
            type,
            post,
            schedule,
            row_id,
            row_no,
            column_check_id,
            no,
            user_id,
            area_id: req.user.id
        });
    });

    const newDataEntries = await Promise.all(
        dataEntries.map(async (entry) => {
            return await NumberDetail.create(entry);
        })
    );

    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, newDataEntries));
});

//@desc Delete number detail
//@route DELETE /api/number_detail/:id
//@access private
const deleteNumberDetail = asyncHandler(async (req, res) => {

    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

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

//@desc Update number detail
//@route PUT /api/number_detail/:id
//@access private
const updateNumberDetail = asyncHandler(async (req, res) => {

    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/number_detail/:id, req-payload: new_data',
    };
    createAppLog(app_log);

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
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc POST number details filtered by schedule, date, group, and page number
//@route POST /api/number_details/inp_check
//@access private
const inputCheckNumberFilter = asyncHandler(async (req, res) => {
    const { schedule, date, group, page_no } = req.body;

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

    try {
        // Find numberDetails based on the query
        const numberDetails = await NumberDetail.find(query).exec();

        // Collect all the row_id values from numberDetails to query for related entries in a single request
        const idsToCheck = numberDetails.map(entry => entry.row_id);

        // Fetch all related numberDetailsCheck in one query
        const numberDetailsCheckList = await NumberDetail.find({
            type: LOTTERY_TYPE.LOTTERY_COMPARE,
            check_id: { $in: idsToCheck }
        }).exec();

        // Create a lookup map for the check details, keyed by check_id
        const checkDetailsMap = numberDetailsCheckList.reduce((acc, entry) => {
            if (!acc[entry.check_id]) acc[entry.check_id] = [];
            acc[entry.check_id].push(entry);  // Save all check entries per check_id
            return acc;
        }, {});

        const grouped = {};

        // Process each entry from numberDetails
        numberDetails.forEach(entry => {
            const { page_no, date, time, group, column_no, number, amount, currency, post, schedule, type, _id, row_id } = entry;

            const key = `${page_no}|${date}|${time}|${group}`;
            if (!grouped[key]) {
                grouped[key] = { page_no, date, time, group, datas: {} };
            }

            if (!grouped[key].datas[column_no]) {
                grouped[key].datas[column_no] = { column_no, main_row: {} };
            }

            const postKey = `${post}|${schedule}|${row_id}`;
            if (!grouped[key].datas[column_no].main_row[postKey]) {
                grouped[key].datas[column_no].main_row[postKey] = { post, schedule, row_id, row: [] };
            }

            // Add the primary row data
            grouped[key].datas[column_no].main_row[postKey].row.push({ number, amount, currency, type, _id });

            // Check if there are related numberDetailsCheck for this entry
            const numberDetailsCheckList = checkDetailsMap[row_id];
            if (numberDetailsCheckList) {
                // Avoid duplicate checks (same check_id should not appear twice for the same row)
                numberDetailsCheckList.forEach(numberDetailsCheck => {
                    const { check_id, type, check_amount, _id } = numberDetailsCheck;
                    // Check if this specific check_id and check_amount combination has already been added
                    const existingCheck = grouped[key].datas[column_no].main_row[postKey].row.some(
                        row => row.check_id === check_id && row.check_amount === check_amount
                    );
                    
                    if (!existingCheck) {
                        grouped[key].datas[column_no].main_row[postKey].row.push({
                            number: '',
                            amount: '',
                            currency,
                            check_id,
                            type,
                            check_amount,
                            _id
                        });
                    }
                });
            }
        });

        // Convert back to the original array structure
        const reconstructedData = Object.values(grouped).map(({ page_no, date, time, group, datas }) => {
            const formattedDatas = Object.values(datas).map(({ column_no, main_row }) => ({
                column_no,
                main_row: Object.values(main_row)
            }));

            return { page_no, date, time, group, datas: formattedDatas };
        });

        // Send the final result
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, reconstructedData));

    } catch (error) {
        // Handle any errors and send a response with the error message
        return res.status(500).json(new ResultMessage(CODE.ERROR, MESSAGE.ERROR, error.message));
    }
});

//@desc POST number details filtered by schedule, date, group, and page number
//@route POST /api/number_details/inp_check
//@access private
const inputCheckNumberFilterV2 = asyncHandler(async (req, res) => {
    const { schedule, date, group, page_no } = req.body;

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

    try {
        // Find numberDetails based on the query
        const numberDetails = await NumberDetail.find(query).exec();

        // Send the final result
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetails));

    } catch (error) {
        // Handle any errors and send a response with the error message
        return res.status(500).json(new ResultMessage(CODE.ERROR, MESSAGE.ERROR, error.message));
    }
});

//@desc create compare number detail
//@route POST /api/number_details/inp_submit
//@access private
const createCompareNumberDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'write',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:POST, end-point:DNS/api/number_details/inp_submit, req-payload: new_data',
    };
    createAppLog(app_log);

    const reqNumberDetails = req.body;
    const numberDetailResponse = [];

    // Validate input
    for (const reqNumberDetail of reqNumberDetails) {
        const { check_amount, check_id } = reqNumberDetail;
        if (!check_amount || !check_id) {
            return res.status(400).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
        }
    }

    // Create number details
    const createPromises = reqNumberDetails.map(async reqNumberDetail => {
        const { check_amount, check_id } = reqNumberDetail;
        const numberDetail = await NumberDetail.create({
            type: LOTTERY_TYPE.LOTTERY_COMPARE,
            check_amount: check_amount,
            check_id: check_id,
            area_id: req.user.id
        });
        return numberDetail;
    });

    // Wait for all promises to resolve
    numberDetailResponse.push(...await Promise.all(createPromises));

    // Send response
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, numberDetailResponse));
});

//@desc Delete compare number detail
//@route DELETE /api/number_details/inp_submit/:id
//@access private
const deleteCompareNumberDetail = asyncHandler(async (req, res) => {

    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/number_details/inp_submit/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_COMPARE});
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

//@desc Update compare number detail
//@route PUT /api/number_details/inp_submit/:id
//@access private
const updateCompareNumberDetail = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/number_details/inp_submit/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_COMPARE});
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
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc get page by date and group
//@route PUT /api/number_details/get_page_by_date_and_group
//@access private
const getPageByDateAndGroup = asyncHandler(async (req, res) => {
    try {
        const { date, group } = req.body;
        const query = {};
        if (date) {
            query.date = date;
        }
        if (group) {
            query.group = group;
        }

        const lastPage = await NumberDetail
            .findOne(query)
            .sort({ page_no: -1 }) // Sort descending by page_no
            .select('page_no') // Only select page_no field
            .lean(); // Faster read-only query

        const pageNo = lastPage ? lastPage.page_no : null;

        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, pageNo));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc Update number detail
//@route PUT /api/number_detail/update/:id
//@access private
const updateNumberDetailV2 = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'edit',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:PUT, end-point:DNS/api/number_detail/update/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const id = req.params.id;
        console.log("Requested ID:", id);

        const numberDetail = await NumberDetail.findById(id);
        if (!numberDetail) {
            return res.status(404).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }

        if (numberDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }

        const updateRes = await NumberDetail.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, updateRes));
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});

//@desc Delete number detail
//@route DELETE /api/number_detail/delete/:id
//@access private
const deleteNumberDetailV2 = asyncHandler(async (req, res) => {
    // proccess store log
    const app_log = {
        user_id: req.body.login_user_id,
        action: 'delete',
        feature: 'NumberDetail',
        old_data: '',
        new_data: JSON.stringify(req.body),
        client_access: 'methord:DELETE, end-point:DNS/api/number_detail/delete/:id, req-payload: new_data',
    };
    createAppLog(app_log);

    try {
        const id = req.params.id;
        console.log("Requested ID:", id);
        const numberDetail = await NumberDetail.findById(id);
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await NumberDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

module.exports = { 
    getAllNumberDetail,
    getNumberDetailById,
    createNumberDetail,
    deleteNumberDetail,
    updateNumberDetail,
    inputCheckNumberFilter,
    createCompareNumberDetail,
    deleteCompareNumberDetail,
    updateCompareNumberDetail,
    getPageByDateAndGroup,
    createNumberDetailV2,
    inputCheckNumberFilterV2,
    updateNumberDetailV2,
    deleteNumberDetailV2,
};
