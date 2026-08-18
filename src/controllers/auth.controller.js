import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {
    registerUser,
    loginUser,
    logoutUser,
    changePasswordService,
    getCurrentUser as getCurrentUserService,
} from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        role
    } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const data = await registerUser({ firstName, lastName, email, phone, password, role });
    return res
        .status(201)
        .json(new ApiResponse(201, data, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const data = await loginUser({ email, password });
    return res
        .status(200)
        .json(new ApiResponse(200, data, "User logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(400, "No token provided");
    }

    await logoutUser(token);
    return res
        .status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.user;

    const data = await changePasswordService({
        id,
        oldPassword,
        newPassword,
        confirmPassword,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Password changed successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const data = await getCurrentUserService(id);
    return res
        .status(200)
        .json(new ApiResponse(200, data, "Current user fetched successfully"));
});