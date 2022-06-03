const router = require("express").Router()
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
 
let Staff = require('../models/staff')
let Student = require('../models/student')
let Admin=require('../models/admin')

require("dotenv").config();
 
router.route("/login").post(async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const x=true;
 
     await Student.findOne({ itNumber: username.toUpperCase() })
        .then(student => {
            if (student) {
                const foundUser=student;
                // if(bcrypt.compareSync(password, student.password)){
                // const foundUser = Student.findOne({ username: username }).exec();
                if (password == student.password) {
                    // res.json({
                    //     status: "Successfully logged in as a Student.",
                    //     student: student
                    // })
                    const roles = foundUser.roles;
                    const uname=foundUser._id;
                    // const roles = Object.values(foundUser.roles).filter(Boolean);
                    // create JWTs
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "username": foundUser.username,
                                "roles": roles
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '30s' }
                    );
                    const refreshToken = jwt.sign(
                        { "username": foundUser.username },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: '1d' }
                    );
                    // Saving refreshToken with current user
                    foundUser.refreshToken = refreshToken;
                    const result = foundUser.save();
                    console.log(result);
                    console.log(roles);
            
                    // Creates Secure Cookie with refresh token
                    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            
                    // Send authorization roles and access token to user
                    res.json({ roles, accessToken,uname});
                }
                else {
                    res.json({
                        status: "Password doesn't match."
                    })
                }
            }
            else if(x==true) {
                Staff.findOne({ email: username })
                    .then(staff => {
                        if (staff) {
                            const foundUser=staff;
                            console.log("ADMINNNNN")
                            if (bcrypt.compareSync(password, staff.password)) {
                                // res.json({
                                //     status: "Successfully logged in as Staff.",
                                //     staff: staff
                                // })
                                const roles = foundUser.roles;
                                const uname=foundUser._id;

                                const accessToken = jwt.sign(
                                    {
                                        "UserInfo": {
                                            "username": foundUser.username,
                                            "roles": roles
                                        }
                                    },
                                    process.env.ACCESS_TOKEN_SECRET,
                                    { expiresIn: '30s' }
                                );
                                const refreshToken = jwt.sign(
                                    { "username": foundUser.username },
                                    process.env.REFRESH_TOKEN_SECRET,
                                    { expiresIn: '1d' }
                                );
                                // Saving refreshToken with current user
                                foundUser.refreshToken = refreshToken;
                                const result = foundUser.save();
                                console.log(result);
                                console.log(roles);
                                
                                // Creates Secure Cookie with refresh token
                                res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            
                                // Send authorization roles and access token to user
                                res.json({ roles, accessToken,uname});

                            }
                            else {
                                Admin.findOne({ email: username })
                                .then(admin => {
                                    if (admin) {
                                        const foundUser=admin;
                                        if (bcrypt.compareSync(password, admin.password)) {
                                            // res.json({
                                            //     status: "Successfully logged in as Staff.",
                                            //     staff: staff
                                            // })
                                            const roles = foundUser.roles;
                                            const uname=foundUser._id;
                                            console.log("ADMINNNNN")
                
                                            const accessToken = jwt.sign(
                                                {
                                                    "UserInfo": {
                                                        "username": foundUser.username,
                                                        "roles": roles
                                                    }
                                                },
                                                process.env.ACCESS_TOKEN_SECRET,
                                                { expiresIn: '30s' }
                                            );
                                            const refreshToken = jwt.sign(
                                                { "username": foundUser.username },
                                                process.env.REFRESH_TOKEN_SECRET,
                                                { expiresIn: '1d' }
                                            );
                                            // Saving refreshToken with current user
                                            foundUser.refreshToken = refreshToken;
                                            const result = foundUser.save();
                                            console.log(result);
                                            console.log(roles);
                                            
                                            // Creates Secure Cookie with refresh token
                                            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                        
                                            // Send authorization roles and access token to user
                                            res.json({ roles, accessToken,uname});
                
                                        }
                                        else {
                                            res.json({
                                                status: "Password doesn't match."
                                            })
                                        }
                                    }
                                    else {
                                        res.json({ status: "No user found" })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            }
                        }
                        else {
                            res.json({ status: "No user found" })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }else{


            }


        })
        .catch(err => {
            console.log(err);
        })
})
 
module.exports = router