const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        like: {
            type:Boolean,
            required:true,
        },
        owner: {
            type: mongoose.Types.ObjectId ,
            required:true,
            ref: 'User' 
        },
        comment:{
            type:String,
            required:false,
            maxlength:200,
        }
      }
,{
    timestamps: true,
  });

module.exports = mongoose.model('Review',reviewSchema);