const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const abonnementSchema = new Schema(
    {
        idUser: {
            type: mongoose.Types.ObjectId ,
            required:true,
            ref: 'User' 
        },
        nbMonths: {
            type: Number,
            required:true 
        }
      }
,{
    timestamps: true,
  });

module.exports = mongoose.model('Abonnement',abonnementSchema);