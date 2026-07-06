import mongoose from "mongoose";
import Customer from "../models/Customer.js";

function buildCustomerQuery({ search, status }) {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { company: searchRegex },
      { city: searchRegex }
    ];
  }

  return query;
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function getCustomers(req, res, next) {
  try {
    const customers = await Customer.find(buildCustomerQuery(req.query)).sort({ createdAt: -1 });
    res.json({ customers });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid customer id");
    }

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req, res, next) {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ customer });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = "A customer with this email already exists";
    } else if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
}

export async function updateCustomer(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid customer id");
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.json({ customer });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = "A customer with this email already exists";
    } else if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
}

export async function deleteCustomer(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid customer id");
    }

    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function addCustomerInteraction(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid customer id");
    }

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    customer.interactions.unshift(req.body);
    await customer.save();

    res.status(201).json({ customer });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
}
