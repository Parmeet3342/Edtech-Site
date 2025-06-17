const SubSection = require('../models/subSectionModel');
const Section = require('../models/sectionModel');
const {uploadFileToCloudinary} = require('../util/imageUploader');
require('dotenv').config();

exports.createSubSection = async(req,res) => {
    try{

        const {title,description,sectionId} = req.body;

        const video = req.files.video;

        if(!title || !description || !video || !sectionId){
            return res.status(500).json({
                success:false,
                message:"All fields are required"
            })
        }

        const videoURL = await uploadFileToCloudinary(video,process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({
            title,
            description,
            timeDuration:`${videoURL.duration}`,
            videoUrl:videoURL.secure_url
        })

        const sectionDetails = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {
                                                                    $push: {
                                                                        subSection:newSubSection._id
                                                                    }
                                                                },
                                                                {new:true}
                                                            ).populate("subSection");

        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            data:sectionDetails
        })                                                    
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Issue in creating sub-section",
            data:error.message
        })
    }
}


exports.updateSubSection = async(req,res) => {
    try{

        const {title,description,subSectionId,sectionId} = req.body;
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(500).json({
                success:false,
                message:"Subsection not found"
            })
        }

        if(title !== undefined){
            subSection.title = title;
        }
        if(description !== undefined){
            subSection.description = description;
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const videoResponse = await uploadFileToCloudinary(video,process.env.FOLDER_NAME);

            subSection.videoUrl = videoResponse.secure_url;
            subSection.timeDuration = `${videoResponse.duration}`;
        }

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success:true,
            message:"Sub-section updated successfully",
            data:updatedSection
        })



        
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:"Issue in updating subSection",
            data:error.message
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }