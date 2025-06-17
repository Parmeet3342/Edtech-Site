import React, { useEffect, useState } from 'react'
import { IoIosArrowBack  } from "react-icons/io";
import { IconBtn } from '../../common/IconBtn';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {BsChevronRight} from 'react-icons/bs'

export const VideoDetailsSidebar = ({setReviewModal}) => {

  
  const {courseSectionData,courseEntireData,totalNoOfLectures,completedLectures} = useSelector((state) => state.viewCourse)
  const {sectionId,subSectionId} = useParams();
  const [activeStatus,setActiveStatus] = useState("")
  const [activeVideoBar,setActiveVideoBar] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    ;(async () => {
      if(!courseSectionData.length) return
      const currSectionIdx = courseSectionData.findIndex((data) => data._id === sectionId)
      const currSubSectionIndex = courseSectionData?.[currSectionIdx]?.subSection.findIndex((data) => data._id === subSectionId)

      const activeSubSectionId = courseSectionData?.[currSectionIdx]?.subSection?.[currSubSectionIndex]?._id
      setActiveStatus(courseSectionData?.[currSectionIdx]._id)
      setActiveVideoBar(activeSubSectionId)

      console.log(totalNoOfLectures)
    
    })()
  },[courseSectionData,courseEntireData,location.pathname])

  return (
    <>
      <div
      className='flex flex-col min-h-[calc(100vh-3.5rem)] max-w-[350px] w-[320px] border-r-[1px] border-r-richblack-700 bg-richblack-800'>
        <div className='flex flex-col gap-5 py-5 mx-5 border-b-[2px] border-richblack-700'>
          <div className='flex justify-between items-center'>
            <IoIosArrowBack  
            onClick={() => navigate('/dashboard/enrolled-courses')}
            className='text-2xl bg-richblack-500 rounded-full cursor-pointer'/>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-richblack-25 text-lg font-semibold'>{courseEntireData?.name}</p>
            <p className='text-sm font-semibold text-richblack-500'>
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>
        <div className='h-[calc(100vh-5rem)] overflow-y-auto'>
          {
            courseSectionData.map((section,index) =>(
              <div className='mt-2 cursor-pointer'
              onClick={() => setActiveStatus(section._id)}>
                <div className='flex flex-row justify-between items-center bg-richblack-700 px-2 py-2'>
                  <p className='font-semibold'>{section?.name}</p>
                  <span className={`${activeStatus === section?.name ? "rotate-0":"rotate-180"} transition-all duration-200`}>
                    <BsChevronRight/>
                  </span>
                </div>

                {
                  activeStatus === section._id && (
                    <div className='transition-[height] overflow-y-auto'>
                      {
                        section?.subSection.map((subSec,index) => (
                          <div className={`flex gap-3 px-5 py-2 ${
                          activeVideoBar === subSec._id ? "bg-yellow-200 font-semibold text-richblack-800":
                          "hover:bg-richblack-900 hover:text-richblack-25 bg-richblack-600"}`}
                          key={index}
                          onClick={() => {
                            navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subSec?._id}`)
                            setActiveVideoBar(subSec._id)
                          }}
                          >
                           <input
                            type='checkbox'
                            checked = {completedLectures.includes(subSec._id)}
                            onChange={() =>{}}
                           /> 

                           <p>{subSec.title}</p>
                          </div>
                        ))
                      }
                    </div>
                  )
                }

              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}
