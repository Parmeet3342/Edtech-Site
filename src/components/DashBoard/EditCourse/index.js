import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RenderSteps } from '../AddCourse/RenderSteps'
import { setEditCourse,setCourse, setStep } from '../../../slices/courseSlice'
import { useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../../../services/operations/courseDetailApi'

export const EditCourse = () => {
    const {course} = useSelector((state) => state.course)
    const {step} = useSelector((state) => state.course)
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth)

    const fetchDeatils = async () => {
        setLoading(true)       
        const result = await getFullDetailsOfCourse(courseId, token)
        console.log(result)
        if (result?.courseDetails) {
          dispatch(setEditCourse(true))
          dispatch(setCourse(result?.courseDetails))
        }
        setLoading(false)
    }

    useEffect(() => {
           fetchDeatils()
    },[])

    if (loading) {
        return (
          <div className="grid flex-1 place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
  return (
    <div>
        <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
            Edit Course
        </h1>
        <div className="mx-auto max-w-[600px]">
        {
            course ? (<RenderSteps/>) : (
                <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                    Course Not Found
                </p>
            ) 
        }
        </div>
    </div>
  )
}
