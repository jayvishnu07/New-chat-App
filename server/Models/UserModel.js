const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    mail_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
        type: String,
        default: 'https://freesvg.org/img/abstract-user-flat-4.png',
    },
    token : { type: String}
},
    { timestamps: true }
)

//Creating method to schema to campare password
// UserSchema.methods.comaparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

//Decrypting the password before saving it to DB
UserSchema.pre('save', async function(next) {
    if (!this.isModified) {
        console.log('this.isModified', this.isModified);
        console.log('this', this);
        next();
    }
    console.log('below this', this);

    //DECRYPTION
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
    console.log(this.password);
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;



