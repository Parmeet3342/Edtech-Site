import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { NavBar } from "./components/common/NavBar";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { VerifyEmail } from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import  UpdatePassword  from "./pages/UpdatePassword";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { OpenRoute } from "./components/core/Auth/OpenRoute";
import { PrivateRoute } from "./components/core/Auth/PrivateRoute";
import { Dashboard } from "./pages/Dashboard";
import { MyProfile } from "./components/DashBoard/MyProfile";
import EnrolledCourse from "./components/DashBoard/EnrolledCourse";
import { Settings } from "./components/DashBoard/Settings";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from "./components/DashBoard/Cart";
import { MyCourses } from "./components/DashBoard/MyCourses";
import AddCourse from "./components/DashBoard/AddCourse";
import { EditCourse } from "./components/DashBoard/EditCourse";
import { Catalog } from "./pages/Catalog";
import {CourseDetails} from "./pages/CourseDetails"
import { ViewCourse } from "./pages/ViewCourse";
import VideoDetails from  "./components/core/ViewCourse/VideoDetails"
import { Instructor } from "./components/DashBoard/InstructorDashBoard/Instructor";
import { Error } from "./pages/Error";

function App() {
  const {user} = useSelector((state) => state.profile);
  return (
    <div className="w-screen bg-richblack-900 min-h-screen  flex flex-col font-inter">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element = {<About/>}/>
        <Route path="/contact" element = {<Contact/>}/>
        <Route path="/catalog/:catalogName" element = {<Catalog/>}/>
        <Route path="/course/:courseId" element={<CourseDetails/>}/>

        {/* Open route for only non logged-in user */}
        <Route path="login" 
          element = {
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />
        <Route path = "signUp"
          element = {
            <OpenRoute>
              <SignUp/>
            </OpenRoute>
          }
        />
        <Route path="verify-email" 
          element = {
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />
        <Route path="forgot-password" 
          element = {
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
        />
        <Route path="/update-password/:id" 
          element = {
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
        />

        <Route
          element = {
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element ={<MyProfile/>}/>
          
          
          <Route path="dashboard/settings" element = {<Settings/>}/>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" element ={<EnrolledCourse/>}/>
                <Route path="dashboard/cart" element ={<Cart/>}/>
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
              <Route path="dashboard/instructor" element = {<Instructor/>}/>
                <Route path="dashboard/my-courses" element = {<MyCourses/>}/>
                <Route path="dashboard/add-course" element={<AddCourse/>}/>
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              </>
            )
          }
        </Route>

        <Route
          element = {
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }
          >
            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route
                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    element = {<VideoDetails/>}
                  />
                </>
              )
            }
          </Route>

          <Route path="*" element = {<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;

