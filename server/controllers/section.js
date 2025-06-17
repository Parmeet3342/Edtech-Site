const Section = require("../models/sectionModel");
const Course = require('../models/courseModel');
const SubSection = require('../models/subSectionModel')

exports.createSection = async(req,res) => {
    try{

        const {name,courseId} = req.body;

        if(!name || !courseId){
            return res.status(500).json({
                success:false,
                message:"All fields are required"
            })
        }

        const newSection = await Section.create({name});

        const updatedCourse = await Course.findByIdAndUpdate({_id:courseId},
                                       {
                                        $push: {courseContent:newSection._id}
                                       },
                                       {new:true} 
                                    )
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection",
                                        },
                                    })
                                    .exec();

        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            data:updatedCourse
        })                            

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Issue in creating section",
            data:error.message
        })
    }
}

exports.updateSection = async(req,res) => {
    try{

        const {name,sectionId,courseId} = req.body;


        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                                {
                                                                    name:name
                                                                },
                                                                {new:true}
                                                            );

        const updatedCourse = await Course.findById(courseId)
                                           .populate({
                                            path:"courseContent",
                                            populate: {
                                                path:"subSection"
                                            }
                                           }).exec()

        console.log(updatedCourse)


        
        return res.status(200).json({
            success:true,
            message:updatedSection,
            data:updatedCourse
        })                                                    
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Issue in updating section name try again",
            data:error.message
        })
    }
}


exports.deleteSection = async(req,res) => {
    try{

        const {sectionId,courseId} = req.body;
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
              courseContent: sectionId,
            },
        })

        const section = await Section.findById(sectionId);

        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }

        await SubSection.deleteMany({_id: {$in: section.subSection}})
        await Section.findByIdAndDelete(sectionId);

        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:'subSection'
            }
        }).exec()

        return res.status(200).json({
            success:true,
            message:"Section deleted",
            data:updatedCourse
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Issue in deleting section",
            data:error.message
        })
    }
}