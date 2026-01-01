const HANDLE_CONSTANTS = {
    VALIDATION_ERROR: 400,
    UANUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

const CODE = {
    SUCCESS: 0,
    FAILED: -1,
    GENERAL_EXCEPTION: 500,
    REQUIRE: 400,
    CREDENTIAL: 403,
    NOT_FOUND: 404,
};

const MESSAGE = {
    SUCCESS: "success",
    FAILED: "FAILED",
    GENERAL_EXCEPTION: "internal server error !",
    REQUIRE: "all fields are mandatory !",
    CREDENTIAL: "user don't have permission to update other data !",
    NOT_FOUND: "not found !",
    INSERTED: "inserted success",
    UPDATED: "updated success",
    DELETED: "deleted success",
    LOGINED: "login success",
    LOGOUT: "logout success",
    DUPLICATE: "data already exists !",
    INVALID_LOGIN: "Email or password is not valid !",
    EXPIRED_PWD: "ពាក្យសម្ងាត់ផុតកំណត់ហើយ។ សូមធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់របស់អ្នក។",
    ACCOUNT_LOCK: "គណនីត្រូវបានចាក់សោដោយសារតែការប៉ុនប៉ងចូលច្រើនដងបរាជ័យ។"
};

const LOTTERY_TYPE = {
    LOTTERY_NUMBER: "LOTTERY_NUMBER",
    LOTTERY_RESULT: "LOTTERY_RESULT",
    LOTTERY_COMPARE: "LOTTERY_CHECK",
};

const POST_TYPE = {
    POST_CATEGORY: "POST_CATEGORY",
    POST_SUB_CATEGORY: "POST_SUB_CATEGORY",
};

const SHORTCUT_TYPE = {
    POST: "POST",
    SCHEDULE: "SCHEDULE",
};

const USER_TYPE = {
    ACTIVE: 1,
    INACTIVE: 0,
};

const APP_MENUS = [
    { no:0, icon: 'mdi-home-outline', value: 'home', text: 'ទំព័រដើម', to: '/dashboard', class: 'menu-home', sub: [] },
    { no:1,  icon: 'mdi-account-supervisor-outline', value: 'inp_agent', text: 'ភ្នាក់ងារ/ក្រុម', to: '/agent', class: 'menu-agent', sub: [] },
    { no:2, icon: 'mdi-invoice-text-clock-outline', value: 'inp_schedule_post', text: 'ប៉ុស្តិ៍-ពេល', to: '/schedulePost', class: 'menu-schedule-post', sub: [] },
    { no:3, icon: 'mdi-invoice-import-outline', value: 'inp_lottery', text: 'បញ្ចូលឆ្នោត', to: '/inp_lottery', class: 'menu-lottery', sub: [] },
    { no:4, icon: 'mdi-receipt-text-edit-outline', value: 'inp_lottery_update', text: 'កែប្រែឆ្នោត', to: '/inp_lottery_update', sub: [] },
    { no:5, icon: 'mdi-check-circle-outline', value: 'inp_lottery_check', text: 'ផ្ទៀងផ្ទាត់ឆ្នោត', to: '/inp_lottery_check', sub: [] },
    { no:6, icon: 'mdi-invoice-import-outline', value: 'LuckyNumberEntry', text: 'បញ្ចូលលទ្ធផល', to: '/LuckyNumberEntry', class: 'menu-lucky', sub: [] },
    { no:7, icon: 'mdi-list-box-outline', value: 'Luckynumberlist', text: 'តារាងលទ្ធផលឆ្នោត', to: '/Luckynumberlist', class: 'menu-lucky-list', sub: [] },
    { no:8, icon: 'mdi-account-tie-outline', value: 'group_user', text: 'អ្នកប្រើប្រាស់', to: '/user', class: 'menu-account', sub: [] },
    {
        no: 9,
        icon: 'mdi-text-box-search-outline',
        value: 'group_report',
        text: 'បញ្ជីរ',
        sub: [
            { no:0, icon: 'mdi-file-document-outline', value: 'report_total', text: 'បញ្ជីរសរុប', to: '/Report_total'},
            { no:1, icon: 'mdi-file-document-outline', value: 'report_lottery_win_check', text: 'ផ្ទៀងលេខត្រូវ', to: '/Report_lottery_win_check'},
            { no:2, icon: 'mdi-file-document-outline', value: 'report_salaries', text: 'ទិន្នន័យប្រាក់ខែ', to: '/Report_salaries'},
            { no:3, icon: 'mdi-file-document-outline', value: 'report_lottery_input', text: 'ទិន្នន័យលេខបញ្ជូល', to: '/Report_lottery_input'},
        ],
    },
    {
        no:10,
        icon: 'mdi-cog-outline',
        value: 'group_setting',
        text: 'ការកំណត់',
        sub: [
            { no:0, icon: 'mdi-cog-outline', value: 'setting_general', text: 'កំណត់ទូទៅ', to: '/setting_general'},
            { no:1, icon: 'mdi-cog-outline', value: 'setting_permission', text: 'កំណត់អនុញ្ញាតអ្នកប្រើប្រាស់', to: '/usersPermissions'},
            { no:2, icon: 'mdi-cog-outline', value: 'setting_schedule_post', text: 'កំណត់ប៉ុស្តិ៍-ពេល(key)', to: '/setting_schedule_post'},
            { no:3, icon: 'mdi-cog-outline', value: 'setting_lottery_result', text: 'កំណត់ចាប់លទ្ឋផលឆ្នោត', to: '/setting_lottery_result'},
        ],
    },
    { no:11, icon: 'mdi-history', value: 'app_log', text: 'កំណត់ហេតុកម្មវិធី', to: '/app_log', class: 'app-log', sub: [] },
];

const APP_SETTING = [
    { text_kh : 'អាយុកាលពាក្យសម្ងាត់ (ថ្ងៃ)' , text : 'Password lifetime (days)', sett_value : 999, param : 'PWD_LIFT'},
    { text_kh : 'ការព្រមានអំពីការបញ្ចប់អាយុកាលពាក្យសម្ងាត់ (ថ្ងៃ)',  text : 'Password lifetime end warning (days)', sett_value : 10, param : 'PWD_WARN' },
    { text_kh : 'ការត្រួតពិនិត្យប្រវត្តិពាក្យសម្ងាត់ (ដង)', text : 'Password history check (times)', sett_value: 5, param : 'PWD_HIST' },
    { text_kh : 'ការប៉ុនប៉ងចូលអស់ពេល (នាទី)', text : 'Failed login attempts timeout (min)', sett_value : 30 , param: 'PWD_ATMT'},
    { text_kh : 'ការប៉ុនប៉ងចូលអតិបរមា (ដង)', text : 'Maximum login attempts (times)',  sett_value : 99, param: 'PWD_ATML'},
    { text_kh : 'ភាពស្មុគស្មាញនៃពាក្យសម្ងាត់ regexp', text : 'Password complexity regexp', sett_value : 'xxx', param: 'PWD_COMP'},
    { text_kh : 'ពាក្យសម្ងាត់ MFA', text : 'Password MFA',  sett_value : 99, param: 'PWD_MTFA'},
    { text_kh : 'ពេលវេលា​សម្រាក​វគ្គ (នាទី)', text : 'Session timeout (min)', sett_value : 999, param : 'PAG_SSTM'}
];

module.exports = {HANDLE_CONSTANTS, CODE, MESSAGE, LOTTERY_TYPE, POST_TYPE, SHORTCUT_TYPE, APP_MENUS, APP_SETTING, USER_TYPE};