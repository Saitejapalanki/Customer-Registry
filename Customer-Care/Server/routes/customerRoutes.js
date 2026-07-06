import express from "express";
import {
  createCustomer,
  deleteCustomer,
  addCustomerInteraction,
  getCustomerById,
  getCustomers,
  updateCustomer
} from "../controllers/customerController.js";

const router = express.Router();

router.route("/").get(getCustomers).post(createCustomer);
router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);
router.route("/:id/interactions").post(addCustomerInteraction);

export default router;
