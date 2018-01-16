const mongoose = require(`mongoose`);
var bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});
// auth input against db documents
UserSchema.statics.authenticate = (userName, password, cb) =>{
    User.findOne({ username: userName})
        .exec((error, user)=>{
            if(error) {
                return cb(error);
            } else if (!user){
                var err = new Error('User not found');
                err.status = 401;
                return cb(err);
            }
            bcrypt.compare(password, user.password, (error, result)=>{
                if(result === true){
                    return cb(null, user);
                } else {
                    return cb(error);
                }
            });
        });
}


// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

let User = mongoose.model('User', UserSchema);
module.exports = User;