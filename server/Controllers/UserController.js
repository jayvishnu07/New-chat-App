const UserModel = require("../Models/UserModel");
const getJwtToken = require("../config/getJwtToken");
const bcrypt = require('bcryptjs')



const registerUser = async (req, res) => {

    const { name, mail_id, password, profilePic } = req.body;

    if (!name || !mail_id || !password) {
        res.status(400).send('Please fill all the fields.');
        throw new Error("Please fill all the fields.")
    }

    const isExistingUser = await UserModel.findOne({ mail_id: mail_id })
    if (isExistingUser) { res.status(400).send('Existing User, please try to SigIn instead.') }

    const user = await UserModel.create({
        name,
        mail_id,
        password,
        profilePic,
    })

    if (user) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            mail_id: user.mail_id,
            password: user.password,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            token: getJwtToken(user._id)
        });
        console.log(user);
    }
    else {
        res.status(400).send('User is not Created.');
    }
}

const comaparePassword = async function (mail_id, enteredPassword) {
    const user = await UserModel.findOne({ mail_id });
    console.log(enteredPassword, user.password);
    return await bcrypt.compare(enteredPassword, user.password);
};


const loginUser = async (req, res) => {
    const { mail_id, password } = req.body;
    const user = await UserModel.findOne({ mail_id });
    if (user && (await comaparePassword(mail_id, password))) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            mail_id: user.mail_id,
            password: user.password,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            token: getJwtToken(user._id)
        });
        console.log("user = >", user._id);
    }
    else {
        res.status(400).send('Incorrect Mail ID or Password.')
    }

}

const searchNewFriends = async (req, res) => {

    const keyword = req.query.search;
    try {
        
        if (keyword) {
            const user = await UserModel.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { mail_id: { $regex: keyword, $options: 'i' } }
                ]
            })
            .find({ _id: { $ne: req.currentUser.id } })

            console.log('keyword', user);
            res.status(200).send(user)
        }
    } catch (error) {
        console.log('error from serach user',error.message);
    }
}

module.exports = { registerUser, loginUser, searchNewFriends }




// {
// 	"name" : "Jaivishnu",
// 	"mail_id" : "jai@123gmail.com",
// 	"password" : "123123"
// }