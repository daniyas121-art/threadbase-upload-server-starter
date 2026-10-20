import express from "express";
import multer from "multer";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  (req, res, next) => {
    upload.single("avatar")(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "File too large (max 5MB)" });
        return;
      }

      res.status(400).json({ error: error.message || "Unable to upload file" });
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    return res.status(201).json({
      url: `/uploads/${req.file.filename}`,
    });
  },
);

export default router;
