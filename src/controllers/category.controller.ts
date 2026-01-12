import type {
    ApiResponseReturn,
    ExpressMiddlewareParams,
    serviceResponse,
    TargetParams
} from '../types/common.types.js'
import type { CategoryNameParams, UpdateCategoryParams } from "../types/category.types.js"
import {
    listCategoriesService,
    createCategoriesService,
    categoryDetailsService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.services.js"
import { response } from '../helpers/helper.js'
import { STATUS } from '../enums/enums.js'
import { errorHandler } from '../middlewares/error.handler.js'

/**
 * @description Middleware to fetch all categories for a specific user
 * @route GET /users/:userId/categories
 * @access Protected (requires targetUserId)
 */
export const listCategories: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetUserId: TargetParams = req.targetUserId
        const result: serviceResponse = await listCategoriesService(targetUserId)

        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message)
        }

        return response(res, STATUS.SUCCESS, true, result.message, result.data)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}

/**
 * @description Middleware to create a new category for a user
 * @route POST /users/:userId/categories
 * @access Protected (requires targetUserId)
 * @body { CategoryNameParams } - Contains category_name
 */
export const createCategories: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetUserId: TargetParams = req.targetUserId
        const categoryName: CategoryNameParams = req.body
        const result: serviceResponse = await createCategoriesService(targetUserId, categoryName)

        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message)
        }

        return response(res, STATUS.CREATED, true, result.message)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}

/**
 * @description Middleware to fetch details of a single category
 * @route GET /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export const categoryDetails: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetCategoryId: TargetParams = req.targetCategoryId
        const result: serviceResponse = await categoryDetailsService(targetCategoryId)
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message)
        }
        return response(res, STATUS.SUCCESS, true, 'Category details', result.data)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}

/**
 * @description Middleware to update a category's details
 * @route PUT /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 * @body { UpdateCategoryParams } - Contains updated category_name
 */
export const updateCategory: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetCategoryId: TargetParams = req.targetCategoryId
        const reqBody: UpdateCategoryParams = req.body
        const result: serviceResponse = await updateCategoryService(targetCategoryId, reqBody)

        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message)
        }

        return response(res, STATUS.SUCCESS, true, result.message)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}

/**
 * @description Middleware to soft delete a category
 * @route DELETE /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export const deleteCategory: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetCategoryId: TargetParams = req.targetCategoryId
        const result: serviceResponse = await deleteCategoryService(targetCategoryId)
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message)
        }
        return response(res, STATUS.SUCCESS, true, result.message)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}
