const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        amount: {
            type:Number,
            required:true,
        },
        from: {
            type: mongoose.Types.ObjectId ,
            required:true,
            ref: 'User' 
        },
        to: {
            type: mongoose.Types.ObjectId ,
            required:true,
            ref: 'User' 
        },
        idCours: {type: mongoose.Types.ObjectId ,required:false,ref: 'Cours' }
      }
,{
    timestamps: true,
  });

module.exports = mongoose.model('Payment',paymentSchema);