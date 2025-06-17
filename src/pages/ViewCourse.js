import React, { useEffect,useState } from 'react'
import { VideoDetailsSidebar } from '../components/core/ViewCourse/VideoDetailsSidebar'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailApi';
import { setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import { ReviewModal } from '../components/core/ViewCourse/ReviewModal';

export const ViewCourse = () => {

    const [reviewModal,setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const setCourseSpecificDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId,token)
            dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
            dispatch(setEntireCourseData(courseData?.courseDetails))
            let totalLectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                totalLectures += sec.subSection.length;
            });

            dispatch(setTotalNoOfLectures(totalLectures))
        }
        setCourseSpecificDetails();
    },[])

  return (
    <>
        <div className='relative min-h-[calc(100vh-3.5rem)] flex'>
            <VideoDetailsSidebar setReviewModal = {setReviewModal}/>
            <div className='h-[calc(100vh-3rem)] flex-1 overflow-auto'>
                <div className='mx-6 my-2'>
                    <Outlet/>
                </div>
            </div>
        </div>

        {
            reviewModal && <ReviewModal setReviewModal = {setReviewModal}/>
        }
    </>
  )
}
