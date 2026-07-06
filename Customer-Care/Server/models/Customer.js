import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["phone", "email", "social", "website", "other"],
      default: "phone"
    },
    label: {
      type: String,
      trim: true,
      default: "Primary"
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    preferred: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const customFieldSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

const interactionSchema = new mongoose.Schema(
  {
    channel: {
      type: String,
      enum: ["email", "phone", "meeting", "support ticket", "notification", "chat", "other"],
      default: "email"
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    handledBy: {
      type: String,
      trim: true,
      default: "Unassigned"
    },
    occurredAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 20
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true,
        maxlength: 80
      },
      state: {
        type: String,
        trim: true
      },
      postalCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      }
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100
    },
    city: {
      type: String,
      trim: true,
      maxlength: 80
    },
    category: {
      type: String,
      enum: ["General", "Premium", "Enterprise", "Support"],
      default: "General"
    },
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "active"
    },
    assignedAgent: {
      type: String,
      trim: true
    },
    communicationPreference: {
      type: String,
      enum: ["email", "phone", "sms", "notification", "none"],
      default: "email"
    },
    contacts: [contactSchema],
    customFields: [customFieldSchema],
    interactions: [interactionSchema],
    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
