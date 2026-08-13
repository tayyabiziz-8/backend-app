import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sequelize,
  db,
  User,
  UserAuthToken,
} from "../models/index.js";
import { ApiError } from "../util/ApiError.js";

// Helpers
const generateAuthToken = (payload, expiresIn = "40d") =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (plainText, hashed) => {
  // Defensive: If either argument is missing, return false (prevents "data and hash arguments required" error)
  console.log('🔍 comparePassword called with:', {
    plainText: plainText ? `[${plainText.length} chars]` : 'null/undefined',
    hashed: hashed ? `[${hashed.length} chars]` : 'null/undefined'
  });

  if (!plainText || !hashed) {
    console.log('❌ comparePassword: Missing plainText or hashed password');
    return false;
  }

  try {
    const result = await bcrypt.compare(plainText, hashed);
    console.log('🔍 comparePassword bcrypt.compare result:', result);
    return result;
  } catch (error) {
    console.log('❌ comparePassword bcrypt.compare error:', error);
    return false;
  }
};

const sanitizeUser = (user) => {
  const { password, ...cleanUser } = user.get({ plain: true });
  return cleanUser;
};

export const registerUser = async ({ firstName, lastName, email, phone, password, role }) => {
  let transaction;
  try {
    // Pre-check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }
    else {
      transaction = await sequelize.transaction();

      const hashedPassword = await hashPassword(password);

      const newUser = await User.create(
        {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          role: role || "user", // Default to "user" if role is not provided
        },
        { transaction }
      );

      const token = generateAuthToken({ id: newUser.id });
      await UserAuthToken.create({ userId: newUser.id, token }, { transaction });

      await transaction.commit();

      return {
        token,
        user: { ...sanitizeUser(newUser) },
      };
    }
  } catch (error) {
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
      } catch (rollbackError) { }
    }
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  let transaction;
  try {
    console.log('🔍 Login attempt for email:', email);
    console.log('🔍 Password provided:', password ? 'YES' : 'NO');

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    transaction = await sequelize.transaction();

    const user = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        email.toLowerCase().trim()
      ),
      transaction,
    });

    if (!user) {
      console.log('❌ User not found for email:', email);
      throw new ApiError(400, "User not found");
    }

    const isMatch = await comparePassword(password, user.password);
    console.log('🔍 Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      throw new ApiError(400, "Invalid user password");
    }

    const token = generateAuthToken({ id: user.id });

    await UserAuthToken.destroy({
      where: { userId: user.id },
      transaction,
    });

    await UserAuthToken.create(
      {
        userId: user.id,
        token,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      token,
      user: { ...sanitizeUser(user) },
    };
  } catch (error) {
    console.log(error);
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
      } catch (rollbackError) { }
    }
    throw error;
  }
};

export const logoutUser = async (token) => {
  await UserAuthToken.destroy({ where: { token } });
};

/**
 * Change password service for both user and admin.
 * @param {Object} params
 * @param {number} params.id - User or Admin ID
 * @param {string} params.oldPassword
 * @param {string} params.newPassword
 * @param {string} params.confirmPassword
 */
export const changePasswordService = async ({
  id,
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All password fields are required");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = await User.findByPk(id);

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  await user.save();
  return { message: "Password changed successfully" };
};

// Get current user's updated data (for /me endpoint)
export const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    user: {
      ...sanitizeUser(user),
    },
  };
};