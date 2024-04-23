const mongoose = require('mongoose')
var bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require("dotenv")

const userSchema = new mongoose.Schema({
username:{
    type:String,
    required:[true, 'please provide name'],

},
email:{
    type:String,
    required:[true, 'please provide email'],
    unique: true,
},
password:{
    type:String,
    required:[true, 'please provide password'],

},
otp:{
    type: String,
    default: null
},
otpExpire:{
    type: String,
    default: null
},
avatar: {
    type:String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8Gl9eN3We2TcCYbPyAxqG6SqN02Wey-1vB0iuhZfyw&s"
}
,
question1:{
    type: String,
    default: null
}
,
question2:{
    type: String,
    default: null
}

});



userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    this.question1 =  crypto.createHash('sha256').update(this.question1.toString()).digest('hex')
    this.question2 =  crypto.createHash('sha256').update(this.question2.toString()).digest('hex')
    next()
})

userSchema.methods.createJWT = function (){
    return jwt.sign({userID:this._id,username:this.username},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}


userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}

userSchema.methods.createOtp = function(){
    let otp_ = Math.floor(1000 + Math.random() * 9000).toString()
    this.otp =  crypto.createHash('sha256').update(otp_.toString()).digest('hex')
    this.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    return otp_.toString()
 
}
module.exports = mongoose.model('User',userSchema)