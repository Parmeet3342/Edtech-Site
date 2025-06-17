import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri"
import { deleteSection } from '../../../../services/operations/courseDetailApi';
import { setCourse } from '../../../../slices/courseSlice';
import { FaPlus } from 'react-icons/fa';
import { SubSectionModel } from './SubSectionModel';
import { ConfirmationModal } from '../../../common/ConfirmationModal';
import { deleteSubSection } from '../../../../services/operations/courseDetailApi';


export const NestedView = ({handleChangeEditSectionName}) => {

  const {course} = useSelector((state) => state.course)
  const {token} = useSelector((state) => state.auth)
  const [confirmationModel,setConfirmationModel] = useState(null)
  const dispatch = useDispatch()

  const [viewSubSection,setViewSubSection] = useState(null)
  const [addSubSection,setAddSubSection] = useState(null)
  const [editSubSection,setEditSubSection] = useState(null)

  const handleDeleteSection = async(sectionId) => {
    let result = await deleteSection({
      sectionId,
      courseId:course._id,
      token
    })

    if(result){
      dispatch(setCourse(result))
    }

    setConfirmationModel(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    console.log("hello",result)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModel(null)
  } 

  return (
   <>
     <div className='bg-richblack-700 rounded-lg px-6 py-8 mt-4'>
      {
        course?.courseContent?.map((section) => (
          <details key={section._id} open>
            <summary className='flex item-center justify-between cursor-pointer border-b-2  border-b-richblack-600 py-2'>
              <div className='flex items-center gap-x-2'>
                <RxDropdownMenu className='text-2xl text-richblack-50'/>
                <p className='text-richblack-50 font-semibold'>{section.name}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <button
                onClick={() => handleChangeEditSectionName(section._id,section.name)}>
                  <MdEdit className='text-lg text-richblack-50'/>
                </button>
                <button
                onClick={
                  () => setConfirmationModel({
                    text1: "Delete this Section?",
                    text2: "All the lectures in this section will be deleted",
                    btn1text: "Delete",
                    btn2text: "Cancel",
                    btn1handler:() => handleDeleteSection(section._id),
                    btn2handler:() => setConfirmationModel(null)
                  })
                }>
                  <RiDeleteBinLine className='text-lg text-richblack-50'/>
                </button>
              </div>
            </summary>
            <div className='px-6 pb-4'>
              {
                section?.subSection?.map((data) => (
                  <div
                  key={data._id}
                  onClick={() => setViewSubSection(data)}
                  className ='flex items-center justify-between cursor-pointer border-b-2 border-b-richblack-600 py-2'>
                    <div className='flex items-center gap-x-2'>
                      <RxDropdownMenu className='text-xl text-richblack-50'/>
                      <p className='font-semibold text-richblack-50'>{data.title}</p>
                    </div>
                    <div 
                    onClick={(e) => e.stopPropagation()}
                    className='flex items-center gap-x-2'>
                       <button
                       onClick={() => setEditSubSection({...data,sectionId:section._id})}>
                          <MdEdit className='text-xl text-richblack-300'/>
                       </button>

                       <button
                       onClick={() => setConfirmationModel({
                        text1: "Delete this Sub-Section?",
                        text2: "This lecture will be deleted",
                        btn1text:"Delete",
                        btn2text:"Cancel",
                        btn1handler:() => handleDeleteSubSection(data._id,section._id),
                        btn2handler:() => setConfirmationModel(null)
                       })}>
                        <RiDeleteBin6Line className='text-xl text-richblack-300'/>
                       </button>
                    </div>
                  </div>
                ))
              }

              <button
              onClick={() => setAddSubSection(section._id)}
              className='mt-3 text-yellow-50 flex items-center gap-x-2'>
                <FaPlus className='text-lg'/>
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))
      }
     </div>

     {addSubSection ? ( 
        <SubSectionModel
          modaldata = {addSubSection}
          setModalData = {setAddSubSection}
          add = {true}
        />) :
      viewSubSection ? (
        <SubSectionModel
          modaldata = {viewSubSection}
          setModalData = {setViewSubSection}
          view = {true}
        />) :
      editSubSection ? (
        <SubSectionModel
          modaldata = {editSubSection}
          setModalData = {setEditSubSection}
          edit = {true}
        />) : (<></>)
     }

     {
      confirmationModel && <ConfirmationModal modalData={confirmationModel}/>
     }
   </>
  )
}
