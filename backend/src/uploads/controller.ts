import { Request, Response, NextFunction } from "express";
import { UploadApplicationService } from "../service/application/uploadApplicationService";

const uploadAppService = new UploadApplicationService();

/**
 * Handle file upload
 * Validates the uploaded file and uploads it to MinIO
 * @param req - Express request object (expects req.file from multer)
 * @param res - Express response object
 * @returns Sends JSON response indicating success or failure
 */
export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const results = [];
    for (const file of files) {
      const result = await uploadAppService.upload(file);
      results.push(result);
    }
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};

