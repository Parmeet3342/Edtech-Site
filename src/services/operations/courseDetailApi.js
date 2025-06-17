import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {
    GET_INSTRUCTOR_COURSE_API,
    DELETE_COURSE_API,
    GET_ALL_CATEGORIES_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    EDIT_COURSE_SECTION_API,
    CREATE_SECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    GET_FULLCOURSEDETAIL_API,
    FETCH_COURSE_DETAILS_API,
    UPDATE_COURSE_PROGRESS_API,
    COURSE_RATING_API
} = courseEndpoints

export const fetchInstructorCourses = async (token) => {
        let result =[];
        const toastId = toast.loading("Loading...");
        try{

            const response = await apiConnector("GET",GET_INSTRUCTOR_COURSE_API,
                null,
                {
                    Authorization:`Bearer ${token}`
                }
            )

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            result = response.data.data;
        }
        catch(error){
            console.log("Fetch courses ERROR............", error)
            toast.error("Failed To fetch instructor courses")
        }
        toast.dismiss(toastId);
        return result;
}

export const fetchCourseCategories = async() => {
    let result = [];
    try{

        const response = await apiConnector("GET",GET_ALL_CATEGORIES_API)
        console.log("hello this is response",response.data.data);
        console.log("success is ",response.data.success)

        if(!response?.data.success){
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        console.log(result);
        toast.success("Category fetched successfully");
    }
    catch(error){
        console.log("Fetch Api error",error);
        toast.error("Can't fetch categories");
    }
    return result;
}

export const  addCourseDetail = async (data,token) =>{
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",CREATE_COURSE_API,
            data,
            {
                "Content-Type": "multipart/form-data",
                Authorization : `Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.data
        toast.success("Course added successfully")
    }
    catch(error){
        console.log("Add Course API error",error)
        toast.error("Cant add course");
    }
    toast.dismiss(toastId);
    return result
}

export const updateSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",EDIT_COURSE_SECTION_API,
            data,
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.data
        toast.success("Section updated successfully")
    }
    catch(error){
        console.log("Update Section API error",error);
        toast.error("Can't update section")
    }
    toast.dismiss(toastId)
    return result
}


export const editCourseDetail = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",EDIT_COURSE_API,
            data,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.data
        toast.success("Course updated successfully")
    }
    catch(error){
        console.log("Edit course Api error",error)
        toast.error("Can't edit course")
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",CREATE_SECTION_API,
            data,
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.data
        toast.success("Section created successfully")
    }
    catch(error){
        console.log("Create Section API erorr",error)
        toast.error("Not able to create error")
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSection = async(sectionId,token) => {
    let result = null
    let toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",DELETE_SECTION_API,sectionId,
            {
                Authorization: `Bearer ${token}`
            }
        )

        if(!response?.data?.success){
            throw new Error(response.data.message)
        }

        result = response?.data?.data
        toast.success("Section Deleted")
    }
    catch(error){
        console.log("DELETE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST",DELETE_SUBSECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE SUB-SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Lecture")
      }
      toast.success("Lecture Deleted")
      result = response?.data?.data
    } catch (error) {
      console.log("DELETE SUB-SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

export const createSubSection = async(formdata,token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",CREATE_SUBSECTION_API,formdata,
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!response?.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.data
        toast.success("Subsection created")
    }
    catch(error){
        console.log("CREATE SUBSECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const editSubSection = async(formData,token) => {
        let result = null
        const toastId = toast.loading("Loading...")
        try{

            const response = await apiConnector("POST",UPDATE_SUBSECTION_API,formData,{
                Authorization : `Bearer ${token}`
            })

            if(!response?.data.success){
                throw new Error(response.data.message)
            }

            result = response?.data?.data
            toast.success("Updated subsection")
        }
        catch(error){
            console.log("DELETE SUBSECTION API ERROR............", error)
            toast.error(error.message)
        }

        toast.dismiss(toastId)
        return result
}

export const deleteCourse = async (courseId,token) => {
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("DELETE",DELETE_COURSE_API,courseId,
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!response?.data?.success){
            throw new Error(response?.data?.message)
        }

        toast.success("course deleted")
    }
    catch(error){
        console.log("DELETE COURSE API error",error)
        toast.error("Can't delete course")
    }
    toast.dismiss(toastId)
}

export const getFullDetailsOfCourse = async (courseId,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{

        const response = await apiConnector("POST",GET_FULLCOURSEDETAIL_API,{courseId},
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!response?.data?.success){
            throw new Error(response.data.message)
        }

        toast.success("course detail fetched")
        result = response?.data?.data
    }
    catch(error){
        console.log("COURSE DETAIL API error",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseDetails = async(courseId) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST",FETCH_COURSE_DETAILS_API,{courseId})

        if(!response?.data?.success){
            throw new Error(response?.data?.message)
        }

        result = response?.data?.data
        toast.success("Course details fetched")
    }
    catch(error){
        console.log("COURSE DETAIL API error",error)
        toast.error("Can't fetch details")
    }
    toast.dismiss(toastId)
    return result
}

export const markLectureCompleted = async(courseId,subSectionId,token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
    try{

        const res = await apiConnector("POST",UPDATE_COURSE_PROGRESS_API,{courseId,subSectionId},
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!res.data.success){
            throw new Error(res.data.message)
        }

        toast.success("Course Marked Completed");
        result = true
    }
    catch(error){
        console.log("COURSE_PROGRESS API ERROR...",error)
        toast.error(error)
        result = false
    }
    toast.dismiss(toastId)
    return result;
}

export const createRating = async(bodyData,token) => {
    const toastId = toast.loading("Loading...")
    let success = false
    try{

        const response = await apiConnector("POST",COURSE_RATING_API,bodyData,
            {
                Authorization:`Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Course Rated successfully")
        success = true
    }catch(error){
        success = false
        console.log("CREATE RATING API error...",error)
        toast.error(error)
    }
    toast.dismiss(toastId)
    return success
}