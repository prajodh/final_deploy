const User = require("../models/login");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const register = async (req, res) => {
  console.log(req.body)
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .cookie("token", token, { maxAge: 900000, httpOnly: true })
    .json({
      message: "created User",
      data: { username: user.username, token },
      status_code: StatusCodes.CREATED,
    });
};

const login = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json("Bad request provide all the fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
          message: "Invalid login",
          data: {},
          status_code: StatusCodes.UNAUTHORIZED,
        });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
          message: "Invalid login",
          data: {},
          status_code: StatusCodes.UNAUTHORIZED,
        });
    }
    const token = user.createJWT();
    res
      .status(StatusCodes.OK)
      .cookie("token", token, { maxAge: 900000, httpOnly: true })
      .json({
        message: "login Succesful",
        data: { username: user.username, token },
        status_code: StatusCodes.OK,
      });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({
        message: "Invalid login",
        data: {},
        status_code: StatusCodes.UNAUTHORIZED,
      });
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

const authenticateQuestions = async (req, res) => {
  console.log(req.body);
  const q1 = crypto
    .createHash("sha256")
    .update(req.body.question1)
    .digest("hex");
  const q2 = crypto
    .createHash("sha256")
    .update(req.body.question2)
    .digest("hex");
  console.log(q1, q2);
  user_document = await User.findOne({
    email: req.body.email,
    question1: q1.toString(),
    question2: q2.toString(),
  });
  if (!user_document) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({
        msg: "User Not Found or the questions were answered wrong",
        data: {},
        status_code: StatusCodes.NOT_FOUND,
      });
  } else {
    res
      .status(StatusCodes.OK)
      .json({
        msg: "the question shave been correctly answers",
        data: user_document.email,
        status_code: StatusCodes.OK,
      });
  }
};

const forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({
        msg: "User Not Fount",
        data: {},
        status_code: StatusCodes.NOT_FOUND,
      });
  }
  const otp = user.createOtp();
  await user.save();
  text = "the verification otp is " + otp;

  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: req.body.email,
    from: "hpass609@gmail.com",
    subject: "OTP for verification",
    text: text,
  };
  const info = sgMail.send(msg);
  res
    .status(StatusCodes.OK)
    .json({
      msg: "email has been sent",
      data: info,
      status_code: StatusCodes.OK,
    });
};

const resetPassword = async (req, res) => {
  const otp_encrpyt = crypto
    .createHash("sha256")
    .update(req.body.otp)
    .digest("hex");
  const user = await User.findOne({
    otp: otp_encrpyt,
    otpExpire: { $gt: Date.now() },
  });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({
        message: "otp is invalid or expired",
        data: {},
        status_code: StatusCodes.NOT_FOUND,
      });
  }
  user.password = req.body.password;
  user.otp = undefined;
  user.otpExpire = undefined;

  user.save();

  res
    .status(StatusCodes.OK)
    .json({
      message: "reset done",
      data: { user },
      status_code: StatusCodes.OK,
    });
};

const google = async (req, resp) => {
  try {
    const obtainedUser = await User.findOne({ email: req.body.email });

    if (obtainedUser) {
      const token = obtainedUser.createJWT();
      resp
        .status(StatusCodes.OK)
        .cookie("token", token, { httpOnly: true })
        .json({
          message: "login Succesful",
          data: { username: obtainedUser.username, token },
          status_code: StatusCodes.OK,
        });
    } else {
      let username = "";
      let isUsernameUnique = false;

      while (!isUsernameUnique) {
        username = `user${Math.floor(Math.random() * 10000)}`;
        let existUsername = await User.findOne({ username: username });

        if (!existUsername) {
          isUsernameUnique = true;
        }
      }
      const randomPw = Math.random().toString(36).slice(-8);
      const newlyRegUser = new User({
        username: username,
        email: req.body.email,
        password: randomPw,
        avatar: req.body.photo,
      });
      await newlyRegUser.save();
      const token = newlyRegUser.createJWT();
      const { password: x, ...otherData } = newlyRegUser._doc;

      resp
        .cookie("access_token", token, { httpOnly: true })
        .status(StatusCodes.OK)
        .json(otherData);
    }
  } catch (err) {
    console.log(err);
    resp
      .status(StatusCodes.UNAUTHORIZED)
      .json({
        message: "Invalid login",
        data: {},
        status_code: StatusCodes.UNAUTHORIZED,
      });
  }
};


const deleteUserForTest = async(req, res) =>{
  const result = await User.findOneAndDelete(req.body)
  res
      .status(StatusCodes.OK)
      .json({
        message: "Deleted User",
        data: {result},
        status_code: StatusCodes.OK,
      });

}

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
  authenticateQuestions,
  google,
  signOut,
  deleteUserForTest
};
