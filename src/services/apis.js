const BASE_URL = process.env.REACT_APP_BASE_URL;

export const categories = {
    CATEGORIES_API:BASE_URL + "/course/getAllCategories",
    GET_CATEGORYDETAILS_API : BASE_URL + "/course/categoryDetails"
}

export const authEndpoints = {
    LOGIN_API:BASE_URL + "/auth/login",
    SendOTP_API: BASE_URL + "/auth/sendOtp",
    SignUp_API:BASE_URL + "/auth/signUp",
    RESETPASSTOKEN_API: BASE_URL + "/auth/resetPasswordToken",
    RESETPASSWORD_API : BASE_URL + "/auth/resetPassword"
}

export const contactusEndpoint ={
    CONTACT_US_API : BASE_URL + "/contact/contactUs"
}

export const settingsEndpoint = {
    UPDATE_DISPLAY_PICTURE_API : BASE_URL + "/profile/updatePicture",
    UPDATE_PROFILE_API : BASE_URL + "/profile/updateProfile",
    UPDATE_PASSWORD_API : BASE_URL + "/auth/changePassword",
    DELETE_PROFILE_API : BASE_URL + "/profile/deleteAccount"
}

export const profileEndpoint = {
    GET_USER_ENROLLEDCOURSE_API : BASE_URL + "/profile/enrolledCourses",
    GET_INSTRUCTORDATA_API : BASE_URL + '/profile/instructorDashBoard'
}

export const courseEndpoints = {
    GET_INSTRUCTOR_COURSE_API : BASE_URL + "/course/getInstructorCourses",
    DELETE_COURSE_API : BASE_URL + "/course/deleteCourse",
    GET_ALL_CATEGORIES_API : BASE_URL + "/course/getAllCategories",
    CREATE_COURSE_API : BASE_URL + "/course/createCourse",
    EDIT_COURSE_API : BASE_URL + "/course/editCourse",
    EDIT_COURSE_SECTION_API : BASE_URL + "/course/updateSection",
    CREATE_SECTION_API : BASE_URL + "/course/createSection",
    DELETE_SECTION_API : BASE_URL + "/course/deleteSection",
    DELETE_SUBSECTION_API : BASE_URL + "/course/deleteSubSection",
    CREATE_SUBSECTION_API : BASE_URL + "/course/createSubSection",
    UPDATE_SUBSECTION_API : BASE_URL + "/course/updateSubSection",
    GET_FULLCOURSEDETAIL_API : BASE_URL + "/course/getCourseDetails",
    FETCH_COURSE_DETAILS_API : BASE_URL + "/course/getCourseDetails",
    UPDATE_COURSE_PROGRESS_API : BASE_URL + "/course/updateCourseProgress",
    COURSE_RATING_API : BASE_URL + "/course/createRating"
}

export const ratingEndpoints = {
    GET_ALLRATINGS_API: BASE_URL + "/course/getAllRating"
}

export const studentEndpoints = {
    COURSE_PAYMENT_API : BASE_URL + "/payment/capturePayment",
    COURSE_VERIFY_API : BASE_URL + "/payment/verifySignature",
    SEND_PAYMENT_SUCCESS_API : BASE_URL + "/payment/sendPaymentSuccessfull"
}