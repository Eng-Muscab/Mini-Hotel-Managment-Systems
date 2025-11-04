import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
} from "./cus.controller";

const router = Router();

// Define your customer routes here

router.get("/", getAllCustomersController);
router.get("/:id", getCustomerByIdController);
router.post("/", createCustomerController);
router.put("/:id", updateCustomerController);
router.delete("/:id", deleteCustomerController);

export default router;
