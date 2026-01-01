const mongoose = require("mongoose");

const appLogHisScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    action : {
        type: String,
    },
    feature: {
        type: String,
    },
    date_time: {
        type: Date,
        default: Date.now
    },
    old_data: {
        type: String,
    },
    new_data: {
        type: String
    },
    client_access: {
        type: String
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_APP_LOG_HISTORY", appLogHisScheme);