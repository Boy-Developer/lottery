const mongoose = require("mongoose");

const settingLotteryResultScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    text: {
        type: String,
    },
    time: {
        type: String,
    },
    index_rm : {
        type: String,
    },
    row_rm : {
        type: String,
    },
    lucky_num : {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_SETTING_LOTTERY_RESULT", settingLotteryResultScheme);