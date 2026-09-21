const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const getProfile = async (id) => {

    const user = await User.findById(id).select("-password");

    if (!user)
        throw new Error("User not found");

    return user;

};

const updateProfile = async (id, data) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  user.name = data.name;
  user.companyName = data.companyName;
  user.mobile = data.mobile;

  // Upload image if selected
  if (data.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "admin-profile",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(data.file.buffer).pipe(stream);
    });

    user.image = result.secure_url;
  }

  await user.save();

  return user;
};

module.exports = {

    getProfile,
    updateProfile

};


