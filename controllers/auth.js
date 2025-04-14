import mongoose from "mongoose";
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {

    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash})

    await newUser.save();
    res.status(200).send("User has been Created! ")
    }catch(err){
        next(err);
    }
}

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not Found Sorry!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "7d", // optional
    });

    const { password, ...others } = user._doc;

    // Send token in response body (NOT cookie)
    res.status(200).json({ token, user: others });
  } catch (err) {
    next(err);
  }
};



export const googleAuth = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newUser = new User({ ...req.body, fromGoogle: true });
      user = await newUser.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user: user._doc });
  } catch (err) {
    next(err);
  }
};

  