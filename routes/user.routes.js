import express from "express";
import * as userController from "../controllers/user.controller.js";
import * as userValidation from "../validations/user.validation.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/", validate(userValidation.createUser), userController.createUser);
router.get("/", validate(userValidation.getUsers), userController.getUsers);
router.get("/:userId", validate(userValidation.getUser), userController.getUser);
router.put("/:userId", validate(userValidation.updateUser), userController.updateUser);
router.delete("/:userId", validate(userValidation.deleteUser), userController.deleteUser);

export default router;
