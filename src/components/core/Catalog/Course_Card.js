import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GetAvgRating from '../../../utils/avgRating'
import { RatingStars } from '../../common/RatingStars'

export const Course_Card = ({course,Height}) => {
    const [avgReviewCount,setAvgReviewCount] = useState(0)

    useEffect(() => {
        const count = GetAvgRating(course.ratingAndReviews)
        setAvgReviewCount(count)
        console.log(avgReviewCount)
    },[course])
  return (
    <>
        <Link 
        to={`/course/${course._id}`}>
            <div>
                <div className='rounded-lg max-w-[550px]'>
                    <img
                        src={course?.thumbnail}
                        alt='course thumbnail'
                        className={`${Height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div className='flex flex-col gap-1 px-1 py-3'>
                    <p className='text-lg text-richblack-5'>{course?.name}</p>
                    <p className='text-lg text-richblack-5'>{course?.instructor?.firstName}</p>
                    <div className='flex items-center gap-1'>
                        <span className='text-yellow-5'>{avgReviewCount || 0}</span>
                        <RatingStars Review_Count = {avgReviewCount}/>
                        <span className='text-richblack-400'>
                            {course?.ratingAndReviews?.length} Ratings
                        </span>
                    </div>
                    <p className='text-xl text-richblack-5'>Rs. {course.price}</p>
                </div>
            </div>
        </Link>
    </>
  )
}
