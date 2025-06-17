import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IconBtn } from '../../../common/IconBtn'
import { useDispatch, useSelector } from 'react-redux'
import { setStep } from '../../../../slices/courseSlice'
import { COURSE_STATUS } from '../../../../utils/constants'
import { editCourseDetail } from '../../../../services/operations/courseDetailApi'
import { useNavigate } from 'react-router-dom'
import { setResetCourse } from '../../../../slices/courseSlice'

export const PublishCourse = () => {

    const {
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
        register
    } = useForm()

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch();
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth)
    const {step} = useSelector((state) => state.course)

    const goBack = () => {
        dispatch(setStep(2))
    }

    const goToCourses = () => {
        dispatch(setResetCourse())
        navigate('/dashboard/my-courses')
    }


    const handleCoursePublish = async () => {
        if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true ||
           course?.status === COURSE_STATUS.DRAFT && getValues("public") === false){
            goToCourses()
            return
        }

        const formdata = new FormData()
        formdata.append("courseId",course._id)
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
        formdata.append("status",courseStatus)
        setLoading(true)
        const result = await editCourseDetail(formdata,token)
        if(result){
            goToCourses()
        }
        setLoading(false)
    }

    const onSubmit = (data) => {
        handleCoursePublish();
    }

  return (
    <div className='rounded-md bg-richblack-800 border-[1px] border-richblack-700 p-6'>
        <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>
           <div className='my-6 mb-8'>
            <label className="inline-flex items-center text-lg">
               <input
                type='checkbox'
                name='public'
                {...register("public")}
                className = "border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
               />
               <span className='ml-2 text-richblack-400'>
                Make this course as public
               </span>
            </label>
           </div>

           <div className='ml-auto flex max-w-max items-center gap-x-4'>
            <button
            onClick = {goBack}
            className='flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900'>
                Back
            </button>
            <IconBtn disabled={loading} type="submit" text ="Save Changes"/>
           </div>
        </form>

        
    </div>
  )
}
