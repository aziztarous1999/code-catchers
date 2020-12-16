const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const ReportSchema = new Schema({
    owner :{ 
        type: mongoose.Types.ObjectId ,
        required:true,
        ref: 'User' 
    },
    title:{ 
        type: String ,
        required:true
    },
    description : { 
        type: String ,
        required:true
    },
    status :  { 
        type: String ,
        required:true,
        default : "in progress"
    },
    admin :{ 
        type: String,
        default : "admin"
    },
     

}      
,{
    timestamps: true,
  });

module.exports = mongoose.model('Report',ReportSchema);