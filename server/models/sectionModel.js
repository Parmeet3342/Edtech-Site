const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        subSection:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        }],

    }
)

module.exports = mongoose.model("Section",sectionSchema);