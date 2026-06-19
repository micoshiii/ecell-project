const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Mongo Error:");
    console.log(err);
  }
}

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const userModel = mongoose.model("users", UserSchema);

const SlideSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String],
    previewImage: String,
    slideUrl: String,
    uploadedBy: mongoose.Types.ObjectId,
  },
  { timestamps: true }  // this adds createdAt automatically, needed for sorting
);
const slideModel = mongoose.model("slides", SlideSchema);

module.exports = { connectDB, userModel, slideModel };