const mongoose = require("mongoose");


/** sample datas patterm
{ text_kh : 'អាយុកាលពាក្យសម្ងាត់ (ថ្ងៃ)' , text : 'Password lifetime (days)', sett_value : 999, param : 'PWD_LIFT'},
{ text_kh : 'ការព្រមានអំពីការបញ្ចប់អាយុកាលពាក្យសម្ងាត់ (ថ្ងៃ)',  text : 'Password lifetime end warning (days)', sett_value : 10, param : 'PWD_WARN' },
{ text_kh : 'ការត្រួតពិនិត្យប្រវត្តិពាក្យសម្ងាត់ (ដង)', text : 'Password history check (times)', sett_value: 5, param : 'PWD_HIST' },
{ text_kh : 'ការប៉ុនប៉ងចូលអស់ពេល (នាទី)', text : 'Failed login attempts timeout (min)', sett_value : 30 , param: 'PWD_ATMT'},
{ text_kh : 'ការប៉ុនប៉ងចូលអតិបរមា (ដង)', text : 'Maximum login attempts (times)',  sett_value : 99, param: 'PWD_ATML'},
{ text_kh : 'ភាពស្មុគស្មាញនៃពាក្យសម្ងាត់ regexp', text : 'Password complexity regexp', sett_value : 'xxx', param: 'PWD_COMP'},
{ text_kh : 'ពាក្យសម្ងាត់ MFA', text : 'Password MFA',  sett_value : 99, param: 'PWD_MTFA'},
{ text_kh : 'ពេលវេលា​សម្រាក​វគ្គ (នាទី)', text : 'Session timeout (min)', sett_value : 999, param : 'PAG_SSTM'},
*/

const appSettScheme = mongoose.Schema({
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    text_kh: {
        type: String,
    },
    text : {
        type: String,
    },
    sett_value: {
        type: String,
    },
    param: {
        type: String,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_APP_SETTING", appSettScheme);