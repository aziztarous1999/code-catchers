const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 8
  },
  image: {
    type: String,
    default:""
  },
  role: {
    type: String,
    trim: true,
    default:"user"
  },
  abonner: {
    type: Boolean,
    default:false
  },
  job: {
    type: String,
    minlength: 6,
    default:"Student"
  },
  availableCourses: [{
    type: mongoose.Types.ObjectId ,
    required:true,
    ref: 'Cours' 
  }],
  credit: {
    type: Number,
    default:0
  },
  phone: {
    type: Number,
    required:true,
  },
  gender: {
    type: String,
    required:true,
  },

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;