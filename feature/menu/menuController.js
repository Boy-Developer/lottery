const asyncHandler = require("express-async-handler");
const Menu = require("./model/menuModel");
const Permission = require("../permission/model/permissionModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { APP_MENUS,MESSAGE, CODE } = require("../../app/constant/constants");
const mongoose = require("mongoose");

//@desc get all menu
//@route GET /api/app_menu
//@access private
const getAllMenu = asyncHandler(async (req, res) => {
    try {
        let app_menu = await Menu.find({});
        let app_permission = await Permission.find({});
        
        // create menu if don't have data
        if (!app_menu || app_menu.length === 0) {
            await Menu.create(APP_MENUS.map(menu => ({
            ...menu,
            area_id: req.user.id,
            sub: menu.sub && menu.sub.length !== 0 
                ? menu.sub.map((item) => ({
                    no: item.no,
                    icon: item.icon, 
                    value: item.value,
                    text: item.text,
                    to: item.to,
                    _id: new mongoose.Types.ObjectId()
                }))
                : menu.sub
            })));
            app_menu = await Menu.find({});
        };

        // check to add default admin permission
        if (!app_permission || app_permission.length === 0) {
            const user_id_permission = new mongoose.Types.ObjectId();
            const permissionDocs = [];

            // loop menu to create permission for main and sub menus
            app_menu.forEach(menu => {
                // main menu permission
                permissionDocs.push({
                    user_id_permission,
                    permission_name: 'admin',
                    menu_id: menu._id,
                    area_id: req.user.id,
                    read: true,
                    write: true,
                    edit: true,
                    delete: true
                });

                // sub menu permissions
                if (menu.sub && menu.sub.length > 0) {
                    menu.sub.forEach(subMenu => {
                        permissionDocs.push({
                            user_id_permission,
                            permission_name: 'admin',
                            menu_id: subMenu._id,
                            area_id: req.user.id,
                            read: true,
                            write: true,
                            edit: true,
                            delete: true
                        });
                    });
                }
            });

            if (permissionDocs.length > 0) {
                await Permission.create(permissionDocs);
            }
        };

        // check to add defult user (admin)
        // if (!app_user || app_user.length === 0) {
        //     await UserDetail.create({
        //         username: 'admin',
        //         phone_number: '0964478080',
        //         email_address:'admin@gmail.com',
        //         password: 'admin1',
        //         address: 'Battambang',
        //         role_id: app_menu.user_id_permission,
        //         login_status: 0,
        //         user_status: 1,
        //         first_login: 1,
        //         number_try_login: 0,
        //         //area_id: req.user.id,
        //     });
        // };
        /* insert direct to DB
        db.ltr_user_details.insertOne({
            username: 'admin',
            phone_number: '0964478080',
            email_address:'admin@gmail.com',
            password: 'admin1',
            address: 'Battambang',
            role_id: ObjectId("6942a6af814ba797d5272525"),
            login_status: 0,
            user_status: 1,
            first_login: 1,
            number_try_login: 0,
        });
        */
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, app_menu));
    } catch (error) {
        return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
    }
});

module.exports = {
    getAllMenu
};
