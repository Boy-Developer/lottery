const mongoose = require("mongoose");

const numberDetailsScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    user_id: { type: String },
    type: {
        type: String,
        // required: [true, "The post_name is required!"],
    },
    page_no: { type: Number },
    date: { type: Date },
    time: { type: String },
    group: { type: String },
    column_no: { type: Number },
    number: { type: String },
    amount: { type: Number },
    currency: { type: String },
    post: { type: String },
    schedule: { type: String },
    row_no: { type: Number },
    no: { type: Number },

    // Lottery result field
    row_id: {
        type: String,
    },
    result_post: {
        type: String,
    },
    result_schedule: {
        type: String,
    },
    result_date: {
        type: Date,
    },
    result_lottery_2number: {
        type: Number,
    },
    result_lottery_3number: {
        type: Number,
    },
    result_lottery_4number: {
        type: Number,
    },

    // Lottery compare field
    check_amount: { type: Number },
    column_check_id: { type: String },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_NUMBER_DETAILS", numberDetailsScheme);