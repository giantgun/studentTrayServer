import { FindOptions, InferAttributes } from "@sequelize/core"
import {User} from "../models/user"
import bcrypt from "bcrypt"
import { NextFunction, Response, Request } from "express"

export async function register_user(req: Request , res: Response, next: NextFunction){
    const {
        username,
        firstName,
        lastName,
        email,
        password,
    } = req.body

    const existingUser = await User.findOne(username as FindOptions<InferAttributes<User, { omit: never; }>>)
    if(existingUser){
        res.status(400).send("Username already exist")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
    })
    await newUser.save()
    res.send("Registration successful")
}