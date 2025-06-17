import React, { useEffect, useState } from 'react'
import {apiConnector} from '../../services/apiconnector'
import ReactStars from 'react-rating-stars-component'

import { ratingEndpoints } from '../../services/apis'
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import  Autoplay  from "swiper"
import  Pagination  from "swiper"
import  FreeMode  from "swiper"

export const ReviewSlider = () => {

  const [reviews, setReviews] = useState([])
  const truncateWords = 15
  useEffect(() => {
    const fetchAllReviews = async() => {
      const {data} = await apiConnector("GET",ratingEndpoints.GET_ALLRATINGS_API)

      console.log("hello",data)

      if(data?.success){
        
        setReviews(data?.data)
        console.log(reviews[0].user?.imageUrl)
      }

    }

    fetchAllReviews();
  },[])
  return (
    <div className='text-white'>
      <div className='my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent'>
        <Swiper
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        freeMode = {true}
        autoplay = {{
          delay:2500,
          disableOnInteraction:false
        }}
        modules={Pagination}
        className='w-full space-x-2'>
          {
            reviews.map((review,i) =>
             (
                <SwiperSlide key={i}>
                  <div className='flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25'>
                    <div className='flex gap-4 items-center'>
                      <img
                        src={review?.user?.imageUrl ? review?.user?.imageUrl:
                        `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                        className='h-12 w-12 rounded-full object-cover'
                        alt='imagePhoto'
                      />
                      <div className='space-y-1 sapce-x-2'>
                        <p className='text-lg font-semibold'>{review?.user?.firstName} {review?.user?.lastName}</p>
                        <p className='text-sm text-richblack-600'>{review?.user?.email}</p>
                      </div>
                    </div>

                    <p>
                      {
                        review?.reviews.split(" ").length > truncateWords ?
                        `${review?.reviews.split(" ")
                          .slice(0,truncateWords)
                          .join(" ")} ...` :
                          review?.reviews
                      }
                    </p>
                    <div className="flex items-center gap-2 ">
                      <h3 className="font-semibold text-yellow-100">
                        {review.rating.toFixed(1)}
                      </h3>
                        <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              )
            )
          }
        </Swiper>
      </div>
    </div>
  )
}
