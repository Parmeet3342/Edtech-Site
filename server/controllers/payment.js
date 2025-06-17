const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const { instance } = require('../config/Razorpay');
const User = require('../models/UserModel');
const { courseEnrollmentEmail } = require('../mail/template/courseEnrollmentEmail');
const { paymentSuccessEmail } = require('../mail/template/paymentSuccessEmail');
require('dotenv').config()
const crypto = require('crypto')
const mailSender = require('../util/mailSender')
const courseProgress = require('../models/courseProgressModel')

exports.capturePayment = async(req,res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0){
        return res.status(200).json({
            success:false,
            message:"Please provide the course id"
        })
    }

    let totalAmount = 0;

    for( const courseId of courses){
        let course;
        try{
            course = await Course.findById(courseId);

            if(!course){
                return res.status(200).json({
                    success:false,
                    message:"Course not  found"
                })
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"Student already enrolled in course"
                })
            }

            totalAmount += course.price
        }
        catch(error){
            return res.status(200).json({
                success:false,
                message:error.message
            })
        }
    }

    const options = {
        amount:totalAmount * 100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString()
    }

    
    try{
        const paymentResponse = await instance.orders.create(options)
        console.log("hello...",paymentResponse)
        return res.json({
            success:true,
            data:paymentResponse
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Could not initiate order"
        })
    }
}

exports.verifySignature = async(req,res) => {

    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature ||
        !courses || ! userId
    ){
        return res.status(200).json({
            success:false,
            message:"Payment Failed"
        })
    }

    console.log("Hello parmeets verification2")
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
                                .createHmac("sha256",process.env.RAZORPAY_SECRET)
                                .update(body.toString())
                                .digest("hex")


    if(expectedSignature === razorpay_signature){

        await enrollStudent(courses,userId,res)

        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }

    return res.status(500).json({
        success:false,
        message:"Payment failed"
    })
}

exports.sendPaymentSuccessfull = async(req,res) => {
    const {orderId,paymentId,amount} = req.body;
    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide all the fields"
        })
    }

    try{

        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                amount/100,orderId,paymentId
            )
        )
    }
    catch(error){
        console.log("error in sending email",error)
        return res.status(400).json({
            success:false,
            message:"Could not send email"
        })
    }
}

const enrollStudent = async(courses,userId,res) => {

    if(!courses || !userId){
        return res.status(500).json({
            success:false,
            message:"Please provid eboth userId and courseId"
        })
    }

    for(const courseId of courses){

        try{
            const enrollCourse = await Course.findByIdAndUpdate({_id:courseId},
                {
                    $push:{
                        studentEnrolled:userId
                    }
                },
                {
                    new:true
                }
            )
    
            if(!enrollCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }

            const course_Progress = await courseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos:[]
            })
    
            const enrolledStudent = await User.findByIdAndUpdate({_id:userId},
                {
                    $push:{
                        courses:courseId,
                        courseProgress:course_Progress._id
                    }
                },
                {
                    new:true
                }
            )
    
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrollCourse.name}`,
                courseEnrollmentEmail(
                    enrollCourse.name,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )
            console.log("Email sent successfully",emailResponse.response)
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    
}