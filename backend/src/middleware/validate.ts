import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validationErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors = errors.mapped();

    let compiledErrors: { field: string; message: string }[] = [];

    Object.keys(mappedErrors).forEach((key) => {
      compiledErrors.push({
        field: key,
        message: mappedErrors[key].msg,
      });
    });

    return res.status(400).json({
      success: false,
      message: 'validation error',
      errors: compiledErrors,
    });
  }

  next();
};
