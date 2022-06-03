const router = require("express").Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let Staff = require('../models/staff')
let Student = require('../models/student')
let Admin = require('../models/admin')

require("dotenv").config();

router.route("/login").post(async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    await Student.findOne({ itNumber: username.toUpperCase() })
        .then(student => {
            if (student) {
                const foundUser = student;
                const tempName = student.name
                // const foundUser = Student.findOne({ username: username }).exec();
                // if(bcrypt.compareSync(password, student.password)){
                if (password == student.password) {
                    // res.json({
                    //     status: "Successfully logged in as a Student.",
                    //     student: student
                    // })
                    const roles = foundUser.roles;
                    const uname = foundUser._id;
                    // const roles = Object.values(foundUser.roles).filter(Boolean);
                    // create JWTs
                    console.log("STUDENT");
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "username": foundUser.username,
                                "roles": roles
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '1h' }
                    );
                    // const refreshToken = jwt.sign(
                    //     { "username": foundUser.username },
                    //     process.env.REFRESH_TOKEN_SECRET,
                    //     { expiresIn: '1d' }
                    // );
                    // Saving refreshToken with current user
                    // foundUser.refreshToken = refreshToken;
                    // const result = foundUser.save();
                    // console.log(result);
                    // console.log(roles);

                    // Creates Secure Cookie with refresh token
                    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                    // Send authorization roles and access token to user
                    res.json({ roles, accessToken, uname, tempName });
                }
                else {
                    res.json({
                        error: "Password doesn't match."
                    })
                }
            }
            else {
                Staff.findOne({ email: username })
                    .then(staff => {
                        if (staff) {
                            const foundUser = staff;
                            const tempName = staff.firstname
                            console.log("STAFF")
                            if (bcrypt.compareSync(password, staff.password)) {
                                // res.json({
                                //     status: "Successfully logged in as Staff.",
                                //     staff: staff
                                // })
                                const roles = foundUser.roles;
                                const uname = foundUser._id;

                                const accessToken = jwt.sign(
                                    {
                                        "UserInfo": {
                                            "username": foundUser.username,
                                            "roles": roles
                                        }
                                    },
                                    process.env.ACCESS_TOKEN_SECRET,
                                    { expiresIn: '1h' }
                                );
                                // const refreshToken = jwt.sign(
                                //     { "username": foundUser.username },
                                //     process.env.REFRESH_TOKEN_SECRET,
                                //     { expiresIn: '1d' }
                                // );
                                // Saving refreshToken with current user
                                // foundUser.refreshToken = refreshToken;
                                // const result = foundUser.save();
                                // console.log(result);
                                // console.log(roles);

                                // Creates Secure Cookie with refresh token
                                res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                                // Send authorization roles and access token to user
                                res.json({ roles, accessToken, uname, tempName });

                            }
                        }
                        else {
                            Admin.findOne({ email: username })
                                .then(admin => {
                                    if (admin) {
                                        const foundUser = admin;
                                        const tempName = admin.firstname
                                        if (bcrypt.compareSync(password, admin.password)) {
                                            // res.json({
                                            //     status: "Successfully logged in as Staff.",
                                            //     staff: staff
                                            // })
                                            const roles = foundUser.roles;
                                            const uname = foundUser._id;
                                            console.log("ADMIN")

                                            const accessToken = jwt.sign(
                                                {
                                                    "UserInfo": {
                                                        "uname": foundUser.username,
                                                        "roles": roles
                                                    }
                                                },
                                                process.env.ACCESS_TOKEN_SECRET,
                                                { expiresIn: '1h' }
                                            );
                                            // const refreshToken = jwt.sign(
                                            //     { username: foundUser.username },
                                            //     process.env.REFRESH_TOKEN_SECRET,
                                            //     { expiresIn: '1d' }
                                            // );
                                            // Saving refreshToken with current user
                                            // console.log(refreshToken);
                                            // foundUser.refreshToken = refreshToken;
                                            // const result = foundUser.save();
                                            // console.log(result);
                                            // console.log(roles);

                                            // Creates Secure Cookie with refresh token
                                            res.cookie('jwt', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                                            // Send authorization roles and access token to user
                                            // console.log(accessToken);
                                            res.json({ roles, accessToken, uname, tempName });

                                        }
                                        else {
                                            res.json({
                                                error: "Password doesn't match."
                                            })
                                        }
                                    }
                                    else {
                                        res.json({ error: "No user found" })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }

                    })
                    .catch(err => {
                        console.log(err);
                    })
            }


        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router