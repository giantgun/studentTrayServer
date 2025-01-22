import { NextFunction, Request, Response } from "express";
import { extractPublicId } from "cloudinary-build-url";
require("dotenv").config();

const cloudinary = require("cloudinary").v2;

export async function get_file_signature(
  req: Request,
  res: Response,
): Promise<any> {
  const urlToOverwrite = req.urlToOverwrite;

  if (urlToOverwrite) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const eager = "w_400,h_300,c_pad|w_260,h_200,c_crop";
    const api_key = process.env.CLOUDINARY_API_KEY;
    const public_id = extractPublicId(urlToOverwrite!);
    const version = `v${timestamp}`;

    const optionsForSignature = {
      timestamp,
      eager,
      public_id,
    };

    const signature = cloudinary.utils.api_sign_request(
      optionsForSignature,
      process.env.CLOUDINARY_API_SECRET,
    );
    return res.json({
      signature,
      cloud_name,
      eager,
      api_key,
      timestamp,
      public_id,
      version,
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const eager = "w_400,h_300,c_pad|w_260,h_200,c_crop";
  const api_key = process.env.CLOUDINARY_API_KEY;
  const version = `v${timestamp}`;

  const optionsForSignature = {
    timestamp,
    eager,
  };

  const signature = cloudinary.utils.api_sign_request(
    optionsForSignature,
    process.env.CLOUDINARY_API_SECRET,
  );

  return res.json({
    signature,
    cloud_name,
    eager,
    api_key,
    timestamp,
    version,
  });
}

export async function delete_files_conditionally(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const urlArrayToDelete = req.urlArrayToDelete;
  console.log(urlArrayToDelete);

  if (urlArrayToDelete != undefined || urlArrayToDelete != null) {
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;

    for (let i = 0; i < urlArrayToDelete.length; i++) {
      const public_id = extractPublicId(urlArrayToDelete[i]);

      await cloudinary.uploader.destroy(public_id, {
        invalidate: true,
        api_key,
        api_secret,
        cloud_name,
      });
    }
  }
  next();
}
