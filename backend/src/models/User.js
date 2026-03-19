import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    hashedPassword: { type: String, required: true },
    address:  { type: String, default: "" },
    preferredMaterial: { type: String, default: "PLA" },
    notifications: { type: String, default: "Email" },
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("hashedPassword")) {
        this.hashedPassword = await bcrypt.hash(this.hashedPassword, SALT_ROUNDS);
    }
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.hashedPassword);
};

userSchema.methods.toSafeObject = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        address: this.address,
        preferredMaterial: this.preferredMaterial,
        notifications: this.notifications,
    };
};

export default mongoose.model("User", userSchema);
