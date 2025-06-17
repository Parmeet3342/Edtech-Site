import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IconBtn } from '../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSubSection,editSubSection } from '../../../../services/operations/courseDetailApi';
import  Upload from '../Upload';
import { RxCross2 } from 'react-icons/rx';


export const SubSectionModel = ({
  modaldata,
  setModalData,
  add = false,
  view = false,
  edit = false
}) => {

  const {
    handleSubmit,
    setValue,
    getValues,
    register,
    formState:{errors}
  } = useForm();

  const {token} = useSelector((state) => state.auth)
  const {course} = useSelector((state) => state.course);

  const [loading,setLoading] =useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    if(view || edit){
      setValue("lectureTitle",modaldata.title)
      setValue("lectureDesc",modaldata.description)
      setValue("lectureVideo",modaldata.videoUrl)
    }
  },[])

  const isFormatted = () => {
    const currentValues = getValues()

    if(currentValues.lectureTitle !== modaldata.title ||
       currentValues.lectureDesc !== modaldata.description ||
       currentValues.lectureVideo !== modaldata.videoUrl
    ){
      return true
    }
    else{
      return false
    }
  }

  const handleEditSubSection = async() => {
    const currentValues = getValues()

    let formdata = new FormData();
    formdata.append("sectionId",modaldata.sectionId)
    formdata.append("subSectionId",modaldata._id)
    if(currentValues.lectureTitle !== modaldata.title){
      formdata.append("title",currentValues.lectureTitle)
    }
    if(currentValues.lectureDesc !== modaldata.description){
      formdata.append("description", currentValues.lectureDesc)
    }
    if(currentValues.lectureVideo !== modaldata.videoUrl){
      formdata.append("video",currentValues.lectureVideo)
    }
    setLoading(true)
    const result = await editSubSection(formdata,token)
    if(result){
      const updatedCourseContent = course.courseContent.map((section) => 
      section._id === modaldata.sectionId ? result : section)

      const updatedCourse = {...course,courseContent:updatedCourseContent}
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async(data) => {
    if(view) return

    if(edit){
      if(!isFormatted()){
        toast.error("No changes made to the form")
      }
      else{
        handleEditSubSection()
      }
      return
    }

    let formdata = new FormData()
    formdata.append("title",data.lectureTitle)
    formdata.append("description",data.lectureDesc)
    formdata.append("sectionId",modaldata)
    formdata.append("video",data.lectureVideo)

    setLoading(true)
    console.log("video",formdata.video);
    const result = await createSubSection(formdata,token)
    if(result){
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modaldata ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }
  return (
    <div className='fixed inset-0 !mt-0 bg-white h-screen w-screen overflow-auto bg-opacity-10 backdrop-blur-sm grid place-items-center'>
        <div className='my-10 w-11/12 max-w-[800px] bg-richblack-800 rounded-lg border border-richblack-400'>
          <div className='flex items-center justify-between bg-richblack-600 p-5 rounded-t-lg border-b border-richblack-400'>
             <p className='text-lg text-richblack-5 font-semibold'>
              {add && "Adding"} {view && "Viewing"} {edit && "Editing"} Lecture
             </p>
             <button onClick={() => (!loading ? setModalData(null) : {})}>
                <RxCross2 className="text-2xl text-richblack-5 font-bold" />
             </button>
          </div>

          <form 
          onSubmit={handleSubmit(onSubmit)}
          className='p-4 flex flex-col gap-y-4'>

            <Upload
              name= "lectureVideo"
              label = "Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video = {true}
              viewData = { view ? modaldata.videoUrl : null}
              editData={ edit ? modaldata.videoUrl : null}
            /> 

            <div>
              <label>
                <p className='lable-style mb-1'>Lecture Title {!view && <sup>*</sup>}</p>
                <input
                disabled = {view || loading}
                  type='text'
                  id='lectureTitle'
                  placeholder='Enter the lecture title'
                  name='lecturTitle'
                  className='form-style w-full'
                  {...register("lectureTitle",{required:true})}
                />
              </label>
              {
                errors.lectureTitle && (
                  <span>Lecture title is required</span>
                )
              }
            </div>

            <div>
              <label>
                <p className='lable-style mb-1'>Lecture Description {!view && <sup>*</sup>}</p>
                <textarea
                  disabled = {view || loading}
                  id='lectureDesc'
                  name='lectureDesc'
                  placeholder='Enter lecture description'
                  className='form-style w-full resize-x-none min-h-[130px]'
                  {...register("lectureDesc",{required:true})}
                />
              </label>
              {
                errors.lectureDesc && (
                  <span>Lecture description is required</span>
                )
              }
            </div>

            {
              !view && (
                <div className='flex justify-end'>
                  <IconBtn
                    disabled = {loading}
                    text = {loading ? "Loading":edit ? "Save Changes":"Save"}
                    type = "submit"
                  />
                </div>
              )
            }
          </form>
        </div>
    </div>
  )
}
