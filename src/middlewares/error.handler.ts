import { STATUS } from '../enums/enums.js'

import type { ErrorHandlerParams,ApiResponseReturn } from '../types/common.types.js'

import fs from "fs"
import path from "path"
/**
 * @description Express global error handler middleware
 * Catches all errors thrown in routes and sends a standardized response
 * @param {any} err - The error object thrown in route or middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Response} Sends an HTTP response with status code and message
 */
export const errorHandler: ErrorHandlerParams = (err, res):ApiResponseReturn => {
    // Log the error to console for debugging
    console.error(err)
    // Send a standardized error response
    const logsDir = path.join(process.cwd(), 'public', 'logs')
    const logFile = path.join(logsDir, 'error.log')
   
    if(!fs.existsSync(logsDir)){
        fs.mkdirSync(logsDir,{recursive:true})
    }
    fs.appendFileSync(logFile,`[${new Date().toISOString()}] ${err.message}\n`,'utf-8')

    return res.status(STATUS.SERVER_ERROR).json({ 
        success: false, 
        message: 'Something went wrong' 
    })
}
