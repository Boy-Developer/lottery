const mongoose = require("mongoose");


/** sample datas patterm
{ 
    icon: 'mdi-account-tie', 
    value: 'group_user', 
    text: 'អ្នកប្រើប្រាស់', 
    to: '/user', 
    sub: 0, 
    class: 'menu-account', 
    permissionKey: 'user_manage_menu' 
},
{
    icon: 'mdi-text-box-search-outline',
    value: 'group_report',
    text: 'បញ្ជីរ',
    sub: [
    ['បញ្ជីរសរុប', 'mdi-file-document-outline', '/Report_total'],
    ['ផ្ទៀងលេខត្រូវ', 'mdi-file-document-outline', '/Report_lottery_win_check'],
    ['ទិន្នន័យប្រាក់ខែ', 'mdi-file-document-outline', '/Report_salaries'],
    ['ទិន្នន័យលេខបញ្ជូល', 'mdi-file-document-outline', '/Report_lottery_input']
    ],
},
*/

const menuScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    no: {
        type: Number,
    },
    icon: {
        type: String,
    },
    value: {
        type: String,
    },
    text: {
        type: String,
    },
    to: {
        type: String,
    },
    class: {
        type: String
    },
    sub: {
        type: Array
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_APP_MENU", menuScheme);