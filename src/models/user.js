const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },

    userId: {
      type: String,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      lowercase: true,
      enum: ["male", "female", "others"],
    },

    about: {
      type: String,
      default: "This is a default about of the user!",
    },

    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
userSchema.index({
  firstName: 1,
  lastName: 1,
});

// Generate JWT
userSchema.methods.getJWT = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Validate password
userSchema.methods.validatePassword = async function (
  passwordInputByUser
) {
  return await bcrypt.compare(
    passwordInputByUser,
    this.password
  );
};

module.exports = mongoose.model("User", userSchema);