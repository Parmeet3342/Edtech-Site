import toast from "react-hot-toast";
import { profileEndpoint } from "../apis";
import { apiConnector } from "../apiconnector";

const {
    GET_USER_ENROLLEDCOURSE_API,
    GET_INSTRUCTORDATA_API
} = profileEndpoint;

export const getUserEnrolledCourses = async (token) => {
        const toastId = toast.loading("Loading...");
        let result = [];
        try{

            const response = await apiConnector("GET",
            GET_USER_ENROLLEDCOURSE_API,
            null,
            {
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
            throw new Error(response.data.message);
            }

            result = response.data.data;
        }
        catch(error){
            console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
            toast.error("Could Not Get Enrolled Courses")
        }
        toast.dismiss(toastId);
        return result;
    }

export async function getInstructorData(token){
    const toastId = toast.loading("Loading...")
    let result = []
    try{

        const response = await apiConnector("GET",GET_INSTRUCTORDATA_API,null,{
            Authorization:`Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.courses
        console.log("helli",result)
    }
    catch(error){
        console.log("GET_INSTRUCTOR_API error...",error)
        toast.error(error)
    }
    toast.dismiss(toastId)
    return result
}