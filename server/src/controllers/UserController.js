import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const register = async (req, res) => {
  const { username, password } = req.body;

  console.log("inside the register request...")
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ status: 'error', message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });
  console.log("new User?", newUser)
  await newUser.save();
  console.log("past save")

  const token = jwt.sign({ id: newUser._id }, process.env.SECRET);

  res.json({
    message: "User Registered Successfully",
    token,
    userID: newUser._id,
  });
  console.log("end of register")
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  console.log("inside login... user: ", user)

  if (!user) {
    return res.json({ status: 'error', message: "User Doesn't Exist..." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "username or password is incorrect" });
  }


  const token = jwt.sign({ id: user._id }, process.env.SECRET);
  res.json({ token, userID: user._id });
  console.log("end of login")
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     jwt.verify(authHeader, "secret", (err) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

export { register, login };
