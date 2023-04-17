const UserModel = require("../Models/UserModel");
const getJwtTocken = require("../config/getJwtTocken");
const bcrypt = require('bcryptjs')



const registerUser =async(req,res)=>{

    const {name , mail_id , password , profilePic} = req.body;

    if( !name || !mail_id || !password ){
        res.status(400).send('Please fill all the fields.');
        throw new Error("Please fill all the fields.")
    }

    const isExistingUser = await UserModel.findOne({mail_id : mail_id})
    if(isExistingUser){ res.status(400).send('Existing User, please try to SigIn instead.') }

    const user = await UserModel.create({
        name,
        mail_id, 
        password,
        profilePic,
    })

    if(user){
        res.status(200).json({
            id : user._id,
            name : user.name,
            mail_id : user.mail_id, 
            password : user.password,
            profilePic : user.profilePic,
            createdAt : user.createdAt,
            tocken : getJwtTocken(user._id)
        });
        console.log(user);
    }
    else{
        res.status(400).send('User is not Created.');
    }
}

const comaparePassword = async function (mail_id,enteredPassword) {
    const user = await UserModel.findOne({mail_id});
    console.log(enteredPassword, user.password);
    return await bcrypt.compare(enteredPassword, user.password);
};


const loginUser =async(req,res)=>{
    const { mail_id , password } = req.body;
    const user = await UserModel.findOne({mail_id});
    if(user && ( await comaparePassword(mail_id,password))){
        res.status(200).json({
            id : user._id,
            name : user.name,
            mail_id : user.mail_id, 
            password : user.password,
            profilePic : user.profilePic,
            createdAt : user.createdAt,
            tocken : getJwtTocken(user._id)
        });
        console.log("user = >",user._id);
    }
    else{
        res.status(400).send('Incorrect Mail ID or Password.')
    }

}

module.exports = { registerUser ,loginUser  }




// {
// 	"name" : "Jaivishnu",
// 	"mail_id" : "jai@123gmail.com",
// 	"password" : "123123"
// }