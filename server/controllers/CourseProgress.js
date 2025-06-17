const Course = require('../models/courseModel')
const SubSection = require('../models/subSectionModel')
const courseProgress = require('../models/courseProgressModel')

exports.updateCourseProgress = async(req,res) => {
    try{
        const {courseId,subSectionId} = req.body;

        const userId = req.user.id;

        
        console.log("hello",userId)

        const subSection = await SubSection.findById(subSectionId)
        if(!subSection){
            return res.status(400).json({
                success:false,
                message:"Sub-Section not found"
            })
        }

        const course_Progress = await courseProgress.findOne({
            courseID:courseId,
            userId:userId
        })

        if(!course_Progress){
            return res.status(400).json({
                success:false,
                message:"Course Progress does not exist"
            })
        }else{
            if(course_Progress.completedVideos.includes(subSectionId)){
                return res.status(200).json({
                    success:false,
                    message:"Subsection already completed"
                })
            }

            course_Progress.completedVideos.push(subSectionId)
        }

        await course_Progress.save();

        return res.status(200).json({
            success:true,
            message:"Course progress updated"
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Problem in updating progress",
            error:error.message
        })
    }
}