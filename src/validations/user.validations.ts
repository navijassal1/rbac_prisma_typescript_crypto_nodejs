// External modules
import bcrypt from "bcrypt";
import { body } from "express-validator";

// Internal modules
import prisma from '../lib/prisma.client.js';
import { STATUS } from "../enums/enums.js";
import type { ExpressMiddlewareParams } from "../types/common.types.js";
import { response } from "../helpers/helper.js";
import { validateResult } from "../utils/validation.result.middleware.js";

// Reserved usernames that cannot be registered
const RESERVED = ["admin", "root", "superuser"];

/**
 * Validation rules for user signup.
 */
export const signupValidation = [
  // Role validation
  body('role')
    .notEmpty().withMessage('Role is Required').bail()
    .custom(async (value) => {
      const roleExists = await prisma.role.findUnique({ where: { name: value } });
      if (!roleExists) throw ({ code: STATUS.NOT_FOUND, message: 'Invalid Role' });
      return true;
    }),

  // First name validation
  body('first_name')
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 3, max: 25 }).withMessage("First name must be 3-25 characters.")
    .matches(/^[a-zA-Z][a-zA-Z\s.'-]*$/)
    .withMessage("First name must start with a letter and contain only letters, spaces, periods, apostrophes, or hyphens."),

  // Last name validation
  body('last_name')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 3, max: 25 }).withMessage("Last name must be 3-25 characters.")
    .matches(/^[a-zA-Z][a-zA-Z\s.'-]*$/)
    .withMessage("Last name must start with a letter and contain only letters, spaces, periods, apostrophes, or hyphens."),

  // Username validation
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters.")
    .matches(/^[a-z0-9]+([._-]?[a-z0-9]+)*$/)
    .withMessage("Username can only contain lowercase letters, numbers, and (._-).")
    .custom((val) => !RESERVED.includes(val)).withMessage("This username is reserved.")
    .custom(async (val) => {
      const exists = await prisma.user.findUnique({ where: { username: val } });
      if (exists) throw ({ code: STATUS.UNPROCESSIBLE, message: 'This username is already registered.' });
      return true;
    }),

  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isLength({ min: 6, max: 320 }).withMessage("Email must be 6-320 characters.")
    .isEmail().withMessage("Please enter a valid email address.")
    .custom(async (val) => {
      const exists = await prisma.user.findUnique({ where: { email: val } });
      if (exists) throw ({ code: STATUS.UNPROCESSIBLE, message: 'This email is already registered.' });
      return true;
    }),

  // Password validation
  body('password')
    .trim().notEmpty().withMessage('Password is required.')
    .isLength({ min: 8, max: 32 }).withMessage("Password must be 8-32 characters.")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1
    }).withMessage('Password must include uppercase, lowercase, number, and symbol.'),

  // Confirm password validation
  body('confirm_password')
    .notEmpty().withMessage('Confirm password is required.')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw ({ code: STATUS.BAD_REQUEST, message: 'Passwords do not match.' });
      return true;
    }),

  validateResult
]

/**
 * Validation rules for user login.
 */
export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isLength({ min: 6, max: 320 }).withMessage("Email must be 6-320 characters.")
    .isEmail().withMessage("Please enter a valid email address."),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .custom(async (val, { req }) => {
      const exists = await prisma.user.findUnique({
        where: { email: req.body.email },
        select: { id: true, email: true, username: true, password: true }
      });
      if (!exists) throw ({ code: STATUS.UNPROCESSIBLE, message: 'Invalid Credentials.' });
      const correctPassword = await bcrypt.compare(val, exists.password);
      if (!correctPassword) throw ({ code: STATUS.UNPROCESSIBLE, message: 'Invalid Credentials.' });
      return true;
    }),

  body('device_id').notEmpty().withMessage('Device Id is Required'),
  body('device_type').notEmpty().withMessage('Device Type is Required'),

  validateResult
]

/**
 * Validation rules for changing a user's password.
 */
export const ChangePasswordValidation = [
  body('old_password').notEmpty().withMessage('Password is required.'),

  body('new_password')
    .trim().notEmpty().withMessage('Password is required.')
    .isLength({ min: 8, max: 32 }).withMessage("Password must be 8-32 characters.")
    .isStrongPassword({ minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 })
    .withMessage('New Password must include uppercase, lowercase, number, and symbol.'),

  body('confirm_new_password')
    .notEmpty().withMessage('Confirm password is required.')
    .custom(async (val, { req }) => {
      const username = req.params?.username;
      if (!username) throw ({ code: STATUS.UNPROCESSIBLE, message: 'Invalid Request' });

      const exists = await prisma.user.findUnique({ where: { username }, select: { password: true } });
      if (!exists) throw ({ code: STATUS.NOT_FOUND, message: 'User Not Found' });

      const oldPasswordCorrect = await bcrypt.compare(req.body.old_password, exists.password);
      const sameAsOld = await bcrypt.compare(req.body.new_password, exists.password);

      if (!oldPasswordCorrect) throw ({ code: STATUS.BAD_REQUEST, message: 'Invalid Old Credentials' });
      if (val !== req.body.new_password) throw ({ code: STATUS.BAD_REQUEST, message: 'Passwords do not match.' });
      if (sameAsOld) throw ({ code: STATUS.BAD_REQUEST, message: 'New password must be different from current password.' });

      return true;
    }),

  validateResult
]

/**
 * Middleware array to validate the refresh token in incoming requests.
 * Ensures that the `refresh_token` field is present and is a string.
 * 
 * Usage: Pass this middleware before your controller (e.g., refreshAccessToken)
 * to automatically validate requests and collect errors with `validateResult`.
 */
export const refreshTokenValidation = [
  body('refresh_token')
    // Check that the refresh_token field is not empty
    .notEmpty()
    .withMessage('Refresh token is required.') // Custom error message if missing
    .bail() // Stop further validations if the field is empty

    // Ensure that refresh_token is of type string
    .isString()
    .withMessage('Only string is required'), // Custom error message if wrong type

  validateResult
]

/**
 * Middleware to attach the target user's ID to the request.
 * Useful for controllers that need to perform operations on a specific user.
 */
export const attachTargetUser: ExpressMiddlewareParams = async (req, res, next) => {
  const username = req.params.username as string;

  const userExist = await prisma.user.findUnique({
    where: { username },
    select: { id: true }
  });

  if (!userExist) return response(res, STATUS.NOT_FOUND, false, 'User Not Found');

  req.targetUserId = userExist.id;
  next();
};
