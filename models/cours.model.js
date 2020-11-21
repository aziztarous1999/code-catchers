const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required:true,
    ref: 'User'
  },
  listStudients: [{
      type: mongoose.Types.ObjectId ,
      required:true,
      ref: 'User' 
    }],
  price:{
      type: Number,
      required:true,
      trim: true,
      min:0
  },
  feedback:
    [{
      type: mongoose.Types.ObjectId ,
      required:true,
      ref: 'Review' 
    }]
     
  ,
  description:{
      type: String,
      required:true,
      trim: true,
      minlength: 50
  },
  title:{
    type: String,
    required:true,
    trim: true,
    minlength: 10
  },
    listVideo:[{
        type: String,
   }],
    active:{
        type:Boolean,
        default:false
    },likes:{
      type: Number,
      required:true,
      trim: true,
      default:0
    }

  }

  
, {
  timestamps: true,
});

const Cours = mongoose.model('Cours', coursSchema);

module.exports = Cours;