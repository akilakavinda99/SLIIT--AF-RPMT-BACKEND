const User = require('../models/student');
const UserStf=require('../models/staff')
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    const foundUserstf=await UserStf.findOne({refreshToken}).exec();
    if (!foundUser) {
        return res.sendStatus(403);
        // evaluate jwt 
    }else if(foundUser){
        jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ roles, accessToken })
        }
        

    
    );
    }else if (foundUserstf) {

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUserstf.username !== decoded.username) return res.sendStatus(403);
                const roles = Object.values(foundUserstf.roles);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": decoded.username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                );
                res.json({ roles, accessToken })
            }
            
    
        
        );

    }else{

        return res.sendStatus(403);


    }
}

module.exports = { handleRefreshToken }