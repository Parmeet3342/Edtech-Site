const express = require('express');
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getInstructorCourses,
    deleteCourse,
    editCourse,
    getFullCourseDetails
} = require('../controllers/courses');

const {
    updateCourseProgress
} = require('../controllers/CourseProgress')

const {
    createCategory,
    getAllCategory,
    getCategoryDetails
} =require('../controllers/Category');

const {
    createSection,
    updateSection,
    deleteSection
} = require('../controllers/section');

const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} =require('../controllers/subSection');

const {
    createRating,
    getAllRatings,
    getAverageRatings
} =require('../controllers/ratingAndReview');

const {auth,isInstructor,isStudent,isAdmin} = require('../middlewares/auth');
const { get } = require('mongoose');

router.post('/createCourse',auth,isInstructor,createCourse);
router.post('/createSection',auth,isInstructor,createSection);
router.post('/updateSection',auth,isInstructor,updateSection);
router.post('/deleteSection',auth,isInstructor,deleteSection);
router.post('/createSubSection',auth,isInstructor,createSubSection);
router.post('/updateSubSection',auth,isInstructor,updateSubSection);
router.post('/deleteSubSection',auth,isInstructor,deleteSubSection);
router.get('/getCourses',getAllCourses);
router.post('/getCourseDetails',getCourseDetails);
router.get('/getInstructorCourses',auth,isInstructor,getInstructorCourses);
router.delete('/deleteCourse',deleteCourse);
router.post('/editCourse',auth,isInstructor,editCourse)
router.post('/getFullCourseDetails',auth,getFullCourseDetails)
router.post('/updateCourseProgress',auth,isStudent,updateCourseProgress);



router.post('/createCategory',auth,isAdmin,createCategory);
router.get('/getAllCategories',getAllCategory);
router.post('/categoryDetails',getCategoryDetails);


router.post('/createRating',auth,isStudent,createRating);
router.get('/getAllRating',getAllRatings);
router.get('/getAverageRating',getAverageRatings);

module.exports = router;