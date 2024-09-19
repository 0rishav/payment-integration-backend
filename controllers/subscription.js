import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import ContentModel from "../models/contentModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const freeContent = CatchAsyncError(async (req, res, next) => {
  try {
    const contents = await ContentModel.find({ type: "Free" });
    res.status(200).json({
      success: true,
      data: contents,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const IntermediateContent = CatchAsyncError(async (req, res, next) => {
  try {
    const contents = await ContentModel.find({ type: "Intermediate" });
    res.status(200).json({
      success: true,
      data: contents,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const advanceContent = CatchAsyncError(async (req, res, next) => {
    try {
      const contents = await ContentModel.find({ type: "Advanced" });
      res.status(200).json({
        success: true,
        data: contents,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });

export const createContent = CatchAsyncError(async (req, res, next) => {
  try {
    const { title, description, type, content } = req.body;

    const newContent = await ContentModel.create({
      title,
      description,
      type,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: newContent,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getContent = CatchAsyncError(async (req, res, next) => {
  try {
    const { type } = req.params;

    const contents = await ContentModel.find({ type });

    res.status(200).json({
      success: true,
      data: contents,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
