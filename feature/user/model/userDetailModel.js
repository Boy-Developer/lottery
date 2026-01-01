const mongoose = require("mongoose");

const userDetailSchema = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "USER_API",
    },
    username: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    email_address: {
        type: String,
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    login_status: {
        type: Number,
    },
    user_status: {
        type: Number,
    },
    first_login: {
        type: Number,
    },
    invalid_login_counter: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_USER_DETAILS", userDetailSchema);