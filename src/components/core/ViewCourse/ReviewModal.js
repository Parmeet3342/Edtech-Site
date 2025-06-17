import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import ReactStars from 'react-rating-stars-component'
import { IconBtn } from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailApi';

export const ReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state) => state.profile)
    const {courseEntireData} = useSelector((state) => state.viewCourse)
    const {token} = useSelector((state) => state.auth)

    const {
        setValue,
        getValues,
        handleSubmit,
        formState:{errors},
        register
    } = useForm()

    useEffect(() => {
           setValue("courseExperience","")
           setValue("rating",0)
    },[])

    const ratingChanged = (newRating) => {
        setValue("rating",newRating)
    }

    const onSubmit = async(data) => {
        const result = await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.rating,
                reviews:data.courseExperience
            },
            token
        )
        if(result){
            setReviewModal(false)
        }
    }
  return (
    <>
        <div className='fixed inset-0 !mt-0 bg-white bg-opacity-10 h-screen w-screen backdrop-blur-sm
         grid place-items-center z-[1000] overflow-auto'>
            <div className=' my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800'>
                <div className='flex justify-between items-center rounded-t-md px-4 py-2 text-richblack-25 bg-richblack-700'>
                        <p className='text-lg font-semibold'>Add Review</p>
                        <IoCloseSharp/>
                </div>

                <div className='p-6'>
                        <div className='flex justify-center items-center gap-x-4'>
                            <img
                                src={user?.imageUrl}
                                alt={user?.firstName + "profile"}
                                className='aspect-square w-[50px] rounded-full object-cover'
                            />

                            <div className=''>
                                <p className='text-richblack-25 font-semibold'>{user?.firstName} {user?.lastName}</p>
                                <p className='text-sm text-richblack-25'>Posting Publicly</p>
                            </div>
                        </div>

                        <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 flex flex-col items-center"
                        >
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                                activeColor="#ffd700"
                            />
                            <div className="flex w-11/12 flex-col space-y-2">
                                <label
                                    className="text-sm text-richblack-5"
                                    htmlFor="courseExperience"
                                >
                                    Add Your Experience <sup className="text-pink-200">*</sup>
                                </label>
                                <textarea
                                id="courseExperience"
                                placeholder="Add Your Experience"
                                {...register("courseExperience", { required: true })}
                                className="form-style resize-x-none min-h-[130px] w-full"
                                />
                                {errors.courseExperience && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    Please Add Your Experience
                                </span>
                                )}
                            </div>
                            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                                <button
                                    onClick={() => setReviewModal(false)}
                                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                                >
                                    Cancel
                                </button>
                                <IconBtn text="Save" />
                            </div>
                        </form>
                </div>
            </div>
         </div>
    </>
  )
}
