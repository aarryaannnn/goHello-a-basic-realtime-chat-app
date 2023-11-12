const User = require("../model/userModel");
const bycrpty = require("bcrypt");
const filter_removeSensitiveInfo = require("../Utils/filterRMSensiInfo");

// const filter_removeSensitiveInfo = (dataObj, ...removeFields) => {
//   const newData = {};

//   Object.keys(dataObj).forEach((el) => {
//     if (!removeFields.includes(el)) {
//       newData[el] = dataObj[el];
//     }
//   });

//   return newData;
// };

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    let existing = await User.findOne({ username });
    if (existing) {
      return res.json({
        msg: "Username already exist",
        status: false,
      });
    }

    existing = await User.findOne({ email });
    if (existing) {
      console.log("second");
      return res.json({
        msg: "Email already exist",
        status: false,
      });
    }

    const hashedPassword = await bycrpty.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // delete user.password; // not working

    // const user_data = {
    //   userId: user._id,
    //   username: user.username,
    //   email: user.email,
    // };

    // creating new user from filter_removeSensitiveInfo for client side

    const user_data = filter_removeSensitiveInfo(user, "password");

    // console.log(user);
    return res.json({
      status: true,
      user_data,
      msg: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    let existing = await User.findOne({ username });

    if (!existing) {
      return res.json({
        msg: "Username or Password incorrect",
        status: false,
      });
    }

    const isAuthenticate = await bycrpty.compare(password, existing.password);

    if (!isAuthenticate) {
      return res.json({
        msg: "Username or Password incorrect",
        status: false,
      });
    }

    // delete user.password; // not working

    // const user_data = {
    //   userId: existing._id,
    //   username,
    //   email: existing.email,
    // };

    // creating new user from filter_removeSensitiveInfo for client side

    const user_data = filter_removeSensitiveInfo(existing, "password");

    // console.log(user_data);
    return res.json({
      status: true,
      user_data,
      msg: "Login Successfull",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findOneAndUpdate(
      { username: userId },
      {
        isAvatarImageSet: true,
        avatarImage,
      }
    );
    // console.log(userData);
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
      status: true,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const users = await User.find({ username: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    // console.log(users);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
