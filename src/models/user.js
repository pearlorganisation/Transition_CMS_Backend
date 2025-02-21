import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be  6 characters"],
  },
  role: {
    type: String,
    required: true,
    default: "ADMIN",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (password) {
  console.log(`password: ${password}`);
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
