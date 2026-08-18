import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {registerUser} from '../services/auth.service.js';
import {ApiResponse} from '../utils/ApiResponse.js';

export const register = asyncHandler(async(req, res)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        role
    } = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const data = await registerUser({ firstName, lastName, email, phone, password, role });
    return res
        .status(201)
        .json(new ApiResponse(201, data, "User registered successfully"));
})