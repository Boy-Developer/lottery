const mongoose = require("mongoose");

const scheduleDetailsScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    schedule_name: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_SCHEDULE_DETAILS", scheduleDetailsScheme);