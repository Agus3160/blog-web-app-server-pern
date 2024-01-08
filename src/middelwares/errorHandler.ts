import { NextFunction, Request, Response } from "express";
import { ApiResponseErrorScheme } from "../../type";

class ServerError extends Error {

  public code?: string;
  public messageClient?: string;
  public name: string;
  public httpStatusCode: number;

  constructor(httpStatusCode: number, name: string, message: string, code?: string, messageClient?: string) {
    super(message);
    this.name = name;
    this.code = code;
    this.httpStatusCode = httpStatusCode;
    this.messageClient = messageClient;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err: unknown, _req:Request , res: Response<ApiResponseErrorScheme>, _nex: NextFunction) => {
  console.error(err)
  if(err instanceof ServerError) {
    return res.status(err.httpStatusCode).json({
      success: false,
      name: err.name,
      message: err.messageClient,
      httpStatusCode: err.httpStatusCode
    })
  }
  return res.status(500).json({
      success: false,
      name: 'InternalServerError',
      message: 'Internal Server Error',
      httpStatusCode: 500
  })
  
}

export { errorHandler, ServerError } 