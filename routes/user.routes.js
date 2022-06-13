const Router = require('express');
const router = new Router();
const { check } = require('express-validator');
const userController = require('../controller/user.controller');

router.post(
  '/users',
  [
    check(
      'first_name',
      'User first name can not be empty and must contains only letters'
    )
      .notEmpty()
      .matches(/^[A-Za-z]+$/),
    check('last_name', 'User last name must contains only letters').matches(
      /^[A-Za-z]+$/
    ),
    check('email', 'Email can not be empty and must be in corect format ')
      .notEmpty()
      .isEmail(),
    check(
      'password',
      'Password length must be more than 3 character and max 16'
    ).isLength({ min: 4, max: 16 }),
  ],
  userController.createUser
);
router.post(
  '/login',
  [
    check('email', 'Email can not be empty and must be in corect format ')
      .notEmpty()
      .isEmail(),
    check(
      'password',
      'Password length must be more than 3 character and max 16'
    ).isLength({ min: 4, max: 16 }),
  ],
  userController.loginUser
);
router.get('/user/:id', userController.getOneUser);
router.put(
  '/user/:id',
  [
    check(
      'first_name',
      'User first name can not be empty and must contains only letters'
    )
      .notEmpty()
      .matches(/^[A-Za-z]+$/),
    check('last_name', 'User last name must contains only letters').matches(
      /^[A-Za-z]+$/
    ),
    check('email', 'Email can not be empty and must be in corect format ')
      .notEmpty()
      .isEmail(),
    check(
      'password',
      'Password length must be more than 3 character and max 16'
    ).isLength({ min: 4, max: 16 }),
  ],
  userController.updateUser
);

module.exports = router;
