const Category = require('../models/categoryModel');

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async(req,res) =>{
    try{

        const {name,description} = req.body;

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        await Category.create({
            name,
            description
        });

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Issue in creating tag",
            data:error.message
        })
    }
}

exports.getAllCategory = async(req,res) => {
    try{

        const allCategory = await Category.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"All tags fetched successfully",
            data:allCategory
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Issue in fetching all tag details",
            data:error.message
        })
    }
}

exports.getCategoryDetails = async(req,res) => {
    try {
        const { categoryId } = req.body
    
        
        const selectedCategory = await Category.findById(categoryId)
          .populate({
            path: "course",
            match: { status: "Published" },
            populate: "ratingAndReviews",
            populate: "instructor"
          })
          .exec()
    
       
        if (!selectedCategory) {
          console.log("Category not found.")
          return res
            .status(404)
            .json({ success: false, message: "Category not found" })
        }
        // Handle the case when there are no courses
        if (selectedCategory.course.length === 0) {
          console.log("No courses found for the selected category.")
          return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
          })
        }
    
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
          _id: { $ne: categoryId },
        })
    
        
        let differentCategory;
        if(categoriesExceptSelected.length > 0){
            differentCategory = await Category.findOne(
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                  ._id
              )
                .populate({
                  path: "course",
                  match: { status: "Published" },
                })
                .exec()
        }
        console.log("hello",differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
          .populate({
            path: "course",
            match: { status: "Published" },
          })
          .exec()
        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10)
    
        res.status(200).json({
          success: true,
          data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
          },
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
}