import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { HiClock } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Th, Thead, Tr, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { ConfirmationModal } from "../../common/ConfirmationModal";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailApi";
import { deleteCourse } from "../../../services/operations/courseDetailApi";
import { formatDate } from "../../../services/formatDate";

export const CourseTable = ({ courses, setCourses }) => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const handleCourseDelete = async (courseId) => {
    setloading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    console.log(result);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setloading(false);
  };
  return (
    <>
      <Table className="rounded-xl  border border-richblack-800 lg:block hidden">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="text-richblack-100 text-center py-10 text-2xl font-medium">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr className="flex gap-x-10 px-6 py-8 border-b border-b-richblack-800">
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={course?.thumbnail}
                    alt={course?.name}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-richblack-5 text-lg font-semibold">
                      {course?.name}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course?.description.split(" ").length > 30
                        ? course?.description
                            .split(" ")
                            .slice(0, 30)
                            .join(" ") + "..."
                        : course?.description}
                    </p>
                    <p className="text-white text-12px">
                      Created: {formatDate(course?.createdAt)}
                    </p>
                    <div
                      className={`flex gap-1 p-1 ${
                        course?.status === "Draft"
                          ? "text-richblack-500"
                          : "text-yellow-300"
                      } 
                                        bg-richblack-400 rounded-md`}
                    >
                      {course?.status === "Draft" ? (
                        <p>
                          <HiClock fontSize={14} />
                          Drafted
                        </p>
                      ) : (
                        <p>
                          <FaCheck fontSize={8} />
                          Published
                        </p>
                      )}
                    </div>
                  </div>
                </Td>

                <Td className="text-sm font-medium text-richblack-100">
                  {course?.duration}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{course?.price}
                </Td>

                <Td className="text-sm font-medium text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit fontSize={20} />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                        btn1text: !loading ? "Delete" : "Loading...",
                        btn2text: !loading ? "Cancel" : "Loading...",
                      })
                    }
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line fontSize={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <div className="lg:hidden block">
        {courses.length === 0 ? (
          <div className="w-[96%] border-[1px] border-richblack-700 h-[400px]">
            <p className="text-richblack-100 text-center py-10 text-2xl font-medium ;">
              No Courses Found
            </p>
          </div>
        ) : (
          <div className="w-[100%] border-richblack-600 border-[2px] rounded-md">
            {courses.map((course, index) => (
              <div
                className={`${
                  courses.length - 1 === index
                    ? ""
                    : "border-b-[1px] text-richblack-700"
                } mt-1 flex flex-col gap-y-1`}
              >
                <div className="flex gap-x-4 ml-1">
                  <p className="text-sm font-medium uppercase text-richblack-100 flex justify-center items-center">
                    Course
                  </p>
                  <div className="flex flex-col gap-y-1 w-full">
                    <img
                      src={course?.thumbnail}
                      alt={course?.name}
                      className="h-[148px] w-full rounded-lg object-cover"
                    />

                    <p className="text-richblack-5 text-lg font-semibold">
                      {course?.name}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course?.description.split(" ").length > 30
                        ? course?.description
                            .split(" ")
                            .slice(0, 30)
                            .join(" ") + "..."
                        : course?.description}
                    </p>
                    <p className="text-white text-[14px]">
                      Created: {formatDate(course?.createdAt)}
                    </p>
                    <div
                      className={`flex gap-1 p-1 ${
                        course?.status === "Draft"
                          ? "text-richblack-500"
                          : "text-yellow-300"
                      } 
                                        bg-richblack-400 rounded-md`}
                    >
                      {course?.status === "Draft" ? (
                        <p>
                          <HiClock fontSize={14} />
                          Drafted
                        </p>
                      ) : (
                        <p>
                          <FaCheck fontSize={8} />
                          Published
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-x-8 mt-2 ml-1">
                  <p className="text-sm font-medium uppercase text-richblack-100 flex justify-center items-center">
                    Price
                  </p>

                  <p className="text-[16px] font-medium text-richblack-100">
                    ₹{course?.price}
                  </p>
                </div>
                <div className="flex gap-x-8 mt-2 ml-1">
                  <p className="text-[13px] font-medium uppercase text-richblack-100 flex justify-center items-center">
                    Duration
                  </p>

                  <p className="text-[16px] font-medium text-richblack-100">
                    {course?.duration}
                  </p>
                </div>
                <div className="flex gap-x-6 mt-2 ml-1">
                  <p className="text-sm font-medium uppercase text-richblack-100 flex justify-center items-center">
                    Actions
                  </p>

                  <p className="text-sm font-medium text-richblack-100">
                    <button
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`);
                      }}
                      className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                    >
                      <FiEdit fontSize={20} color="text-richblack-100" />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All the data related to this course will be deleted",
                          btn1handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                          btn1text: !loading ? "Delete" : "Loading...",
                          btn2text: !loading ? "Cancel" : "Loading...",
                        })
                      }
                      title="Delete"
                      className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                    >
                      <RiDeleteBin6Line fontSize={20} />
                    </button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};
