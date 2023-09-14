const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController');
const auth= require('../middleware/adminAuth')

router.get('/',controller.dashboard);

router.get('/login',controller.getLogin);
router.post('/login',controller.postLogin);


router.get('/dashboard/create-user',auth.authMiddleware,controller.createUser);
router.post('/dashboard/create-user',controller.createUserPost);


router.get('/dashboard/users/edit',auth.authMiddleware,controller.editUser);
router.post('/dashboard/users/edit',controller.editUSerPost);

router.get('/dashboard/users/search-user',auth.authMiddleware,controller.searchUser);
router.post('/dashboard/users/search-user',controller.searchUserPost);


router.get('/dashboard/users',auth.authMiddleware,controller.users);
router.get('/dashboard/users/delete',auth.authMiddleware,controller.deleteUser);
router.get('/dashboard/users/delete-all',auth.authMiddleware,controller.deleteAll);

router.get('/logout' ,controller.getLogout);



module.exports = router