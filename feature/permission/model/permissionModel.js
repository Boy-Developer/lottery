const mongoose = require("mongoose");

const permissionScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    user_id_permission: {
        type: mongoose.Schema.Types.ObjectId
    },
    permission_name: {
        type: String
    },
    menu_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    read: {
        type: Boolean
    },
    write: {
        type: Boolean
    },
    edit: {
        type: Boolean
    },
    delete: {
        type: Boolean
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_APP_PERMISSION", permissionScheme);