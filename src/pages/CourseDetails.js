import React, { useEffect, useState } from 'react'
import { RatingStars } from '../components/common/RatingStars'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCourseDetails } from '../services/operations/courseDetailApi'
import {BiInfoCircle} from "react-icons/bi"
import GetAvgRating from '../utils/avgRating'
import { formatDate } from '../services/formatDate'
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import { CourseDetailsCard } from '../components/core/Course/CourseDetailsCard'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from "react-markdown"
import {Footer} from '../components/common/footer'
import {ConfirmationModal} from '../components/common/ConfirmationModal'
import { CourseAccordionBar } from '../components/core/Course/CourseAccordionBar'
import { buyCourse } from '../services/operations/studentFeaturesAPI'

export const CourseDetails = () => {

    const {courseId} = useParams();
    const [response,setResponse] = useState(null)
    const [avgReviewCount,setAvgReviewCount] = useState(0)
    const {loading} = useSelector((state) => state.profile)
    const [confirmationModal,setConfirmationModal] = useState(null)
    const {paymentLoading} =useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        ;(async () => {
          try {
            const res = await fetchCourseDetails(courseId)
            console.log(res?.courseDetails?.instructor?.additionalDetails?.about)
            setResponse(res)
          } catch (error) {
            console.log("Could not fetch Course Details")
          }
        })()
      }, [courseId])

      useEffect(() => {
        const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
        setAvgReviewCount(count)
      }, [response])

      const [isActive, setIsActive] = useState(Array(0))
      const handleActive = (id) => {
             
        setIsActive(
            !isActive.includes(id)
            ? isActive.concat([id])
            : isActive.filter((e) => e !== id)
        )
      }

      const [totalNoOfLectures,setTotalNoOfLectures] = useState(0);

      useEffect(() => {
        let lectures = 0
        response?.courseDetails?.courseContent.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures)
      },[response])

      if(loading || !response){
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
      }


    
    const handleBuyCourse = () => {
        console.log("before hello")
        if(token){
            console.log("after hello")
            buyCourse(token,[courseId],user,navigate,dispatch)
            return
        }

        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1text: "Login",
            btn2text: "Cancel",
            btn1handler: () => navigate("/login"),
            btn2handler: () => setConfirmationModal(null)
        })
    }

    if(paymentLoading){
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

  return (
    <>
        {/* Section 1 */}
        <div className='relative w-full bg-richblack-800'>
            <div className='mx-auto lg:w-[1260px] box-content px-14 2xl:relative'>
                <div className='mx-auto grid justify-items-center lg:justify-items-start min-h-[450px] py-8 lg:py-0 xl:max-w-[810px] lg:mx-0'>
                    <div className='relative max-h-[30rem] block lg:hidden '>
                        <div className='absolute left-0 bottom-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'></div>
                        <img
                            src= {response?.courseDetails?.thumbnail}
                            alt='thumbnail'
                            className='aspect-auto w-full rounded-lg'
                        />
                    </div>
                    <div className='flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5'>
                        <p>{response?.courseDetails?.name}</p>
                        <p>{response?.courseDetails?.description}</p>
                        <div className='flex gap-2 text-md flex-wrap items-center'>
                            <span className='text-yellow-25'>{}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
                            <span>{`(${response?.courseDetails?.ratingAndReviews.length} reviews)`}</span>
                            <span>{`${response?.courseDetails?.studentEnrolled.length} students enrolled`}</span>
                        </div>
                        <p>
                            Created By {`${response?.courseDetails?.instructor?.firstName} ${response?.courseDetails?.instructor?.lastName}`}
                        </p>
                        <div className='flex flex-wrap gap-5 text-lg'>
                            <p className='flex items-center gap-2'>
                                {" "}
                                <BiInfoCircle/> Created at {formatDate(response?.courseDetails?.createdAt)}
                            </p>
                            <p className='flex items-center gap-2'>
                                {" "}
                                <HiOutlineGlobeAlt/> English
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col w-full lg:hidden gap-4 border-y border-y-richblack-500 py-4'>
                        <p>Rs. {response?.courseDetails?.price}</p>
                        <button className='yellowButton' onClick={handleBuyCourse}>
                            Buy Now
                        </button>
                        <button className='blackButton'>Add to Cart</button>
                    </div>
                </div>

                {/* Course-Card */}
                <div className='lg:absolute hidden mx-auto right-[1rem] w-1/3 top-[60px] min-h-[600px] max-w-[410px] translate-y-24 md:translate-y-0 lg:block'>
                    <CourseDetailsCard
                        course = {response?.courseDetails}
                        setConfirmationModal= {setConfirmationModal}
                        handleBuyCourse = {handleBuyCourse}
                    />
                </div>
            </div>
        </div>

        {/* Section 2 */}
        <div className='mx-auto box-content px-14 text-start text-richblack-5 lg:w-[1260px]'>
            <div className='mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[750px]'>
                <div className='my-8 border border-richblack-600 p-8'>
                    <p className='text-3xl font-semibold'>What you'll learn</p>
                    <div>
                        <ReactMarkdown>{response?.courseDetails?.whatuwillLearn}</ReactMarkdown>
                    </div>
                </div>
                {/* Course-Content */}
                <div className='max-w-[830px]'>
                    <div className='flex flex-col gap-3'>
                        <p className='text-[28px] font-semibold'>Course Content</p>
                        <div className='flex flex-wrap justify-between gap-2'>
                            <div className='flex gap-2'>
                                <span>
                                    {response?.courseDetails?.courseContent.length} {`section(s)`}
                                </span>
                                <span>
                                    {totalNoOfLectures} {`lecture(s)`}
                                </span>
                                <span>
                                    {response?.totalDuration} total length
                                </span>
                            </div>
                            <div>
                                <button
                                className='text-yellow-25'
                                onClick={() => setIsActive([])}>
                                    Collapse all sections
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Course Detail Accordion */}
                    <div className='py-4'>
                        {
                            response?.courseDetails?.courseContent?.map((course,index) => (
                                <CourseAccordionBar
                                    course = {course}
                                    key = {index}
                                    isActive = {isActive}
                                    handleActive = {handleActive}
                                />
                            ))
                        }
                    </div>

                    {/* Author Details */}
                    <div className="mb-12 py-4">
                        <p className="text-[28px] font-semibold">Author</p>
                        <div className="flex items-center gap-4 py-4">
                            <img
                                src={
                                   response?.courseDetails?.instructor?.imageUrl
                                    ? response?.courseDetails?.instructor?.imageUrl
                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${response?.courseDetails?.instructor?.firstName} ${response?.courseDetails?.instructor?.lastName}`
                                }
                               alt="Author"
                               className="h-14 w-14 rounded-full object-cover"
                            />
                            <p className="text-lg">{`${response?.courseDetails?.instructor?.firstName} ${response?.courseDetails?.instructor?.lastName}`}</p>
                        </div>
                        <p className="text-richblack-50">
                            {response?.courseDetails?.instructor?.additionalDetails?.about}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        {confirmationModal && <ConfirmationModal modalData = {confirmationModal}/>}
    </>
  )
}
