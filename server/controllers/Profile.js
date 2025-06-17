const Profile = require("../models/profileModel");
const User = require("../models/UserModel");
const Course = require('../models/courseModel');
const {uploadFileToCloudinary} = require('../util/imageUploader');
const CourseProgress = require('../models/courseProgressModel')
require('dotenv').config();
const {convertSecondsToDuration} = require('../util/secToDuration')

exports.createProfile = async(req,res) => {
    try{
        console.log("running")
        const {gender = "",contactNumber,dateOfBirth = "",about = "",lastname = ""} =req.body;
        console.log(gender);
        const userId = req.user.id;

        const userDetails = await User.findById(userId);

        const user = await User.findByIdAndUpdate(userId,{
            lastName:lastname
        },
        {new:true}
       )
        console.log(user);

        await user.save();

        const profile = await Profile.findById(userDetails.additionalDetails);
        console.log(profile);

        profile.gender = gender;
        profile.DOB = dateOfBirth;
        profile.contactNumber = contactNumber;
        profile.about = about;

        await profile.save();

        console.log("After Saving",profile)

        const updatedUserDetails = await User.findById(userId)
        .populate("additionalDetails")
        .exec()
        console.log(updatedUserDetails);

        return res.status(200).json({
            success:true,
            message:"Profile information added successfully",
            data:updatedUserDetails
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Issue in adding profile deatils",
            data:error.message
        })
    }
}

exports.deleteAccount = async(req,res) => {
    try{

        const userId = req.user.id;

        console.log(userId);

        const user = await User.findById(userId);
        if(!user){
            return res.status(500).json({
                success:false,
                message:"User does not exist"
            })
        }
        console.log("running");

        await Profile.findByIdAndDelete({_id:user.additionalDetails});

        // to unenroll user from enrolled courses
        const courses = user.courses;
        for(let course of courses){
            await Course.findByIdAndUpdate({_id:course},
            {
                $pull:{
                    studentEnrolled:userId
                }
            })
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occured while deleting account try again",
            data:error.message
        })
    }
}

exports.getUserAllDetails = async(req,res) => {
    try{

        const userId = req.user.id;

        const userDetails = await User.findById(userId)
                                               .populate("additionalDetails").exec();
 
        return res.status(200).json({
            success:true,
            message:"All user deatails fetched successfully",
            data:userDetails
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Can't fetch user details",
            data:error.message
        })
    }
}



exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.profileImage
      const userId = req.user.id
      const image = await uploadFileToCloudinary(
        displayPicture,process.env.FOLDER_NAME,1000,1000
      );
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { imageUrl: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

exports.getEnrolledCourses = async(req,res) => {
    try{

        const userId = req.user.id;

        let userDetails = await User.findById(userId)
                                               .populate({
                                                path:"courses",
                                                populate:{
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection"
                                                    },
                                                },
                                               })
                                               .exec();
        
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                     j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                     totalDurationInSeconds
                )
                SubsectionLength +=
                     userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                                                   courseID: userDetails.courses[i]._id,
                                                   userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                    // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                Math.round(
                       (courseProgressCount / SubsectionLength) * 100 * multiplier
                ) / multiplier
            }
        }
                                           
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Fetched all enrolled courses of user",
            data:userDetails.courses
        })                                       
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while getting enrolled courses",
            data:error.message
        })
    }
}

exports.instructorDashboard = async(req,res) => {
    try{

        const courseDetails = await Course.find({instructor:req.user.id})

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            const courseDataWithStats = {
                _id:course._id,
                courseName:course.name,
                courseDescription:course.description,
                totalAmountGenerated,
                totalStudentsEnrolled
            }
            return courseDataWithStats
        })

        return res.status(200).json({
            success:true,
            courses:courseData
        })

    }catch(error){
        console.log(error)
        res.status(400).json({
            success:false,
            message:error.message,
            data:"Internal server error"
        })
    }
}