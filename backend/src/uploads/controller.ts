
import { Request, Response, NextFunction } from "express";
import { UploadApplicationService } from "../service/application/UploadApplicationService";

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
    console.log("UploadFile controller called", files);
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const fileUploaded = await uploadAppService.processUpload(files);
    res.status(201).json({
      success: true,
      message: 'File uploaded and validated',
    });
  } catch (error) {
    next(error);
  }
};

