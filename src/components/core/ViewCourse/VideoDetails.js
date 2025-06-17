import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";
import { IconBtn } from "../../common/IconBtn";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { markLectureCompleted } from "../../../services/operations/courseDetailApi";


export default function VideoDetails(){

    const {courseId ,sectionId,subSectionId} = useParams();
    const [loading,setLoading] = useState(false)

    const {token} = useSelector((state) => state.auth);

    const [videoData,setVideoData] = useState([]);
    const [previewSource,setPreviewSource] = useState("")
    const [videoEnded,setVideoEnded] = useState(false)

    const location = useLocation();
    const playerRef = useRef(null)

    const {courseSectionData,courseEntireData,
        totalNoOfLectures,completedLectures} = useSelector((state) => state.viewCourse);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        ;(async () => {
            if(!courseSectionData.length) return
            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses")
            }
            else{
                console.log(courseSectionData)
                const filterData = courseSectionData.filter((sec) => (
                    sec._id === sectionId
                ))

                console.log("hellob",filterData)

                const filterVideoData = filterData?.[0].subSection.filter((subSec) => (
                    subSec._id === subSectionId
                ))

                setVideoData(filterVideoData[0])
                setPreviewSource(courseEntireData?.thumbnail)
            }
        })()
    },[courseId,subSectionId,location.pathname])
    
    const handleLectureCompletion = async () => {
        setLoading(true)
        
        const res = await markLectureCompleted(courseId,subSectionId,token)
        console.log("heloo",res)

        if(res){
            dispatch(updateCompletedLectures(subSectionId))
        }
        setLoading(false)
        
    }

    const isFirstVideo = () => {
        const currSectionIndex = courseSectionData.findIndex((sec) => sec._id === sectionId)

        const currSubSectionIndex = courseSectionData[
            currSectionIndex
        ].subSection.findIndex((subSec) => subSec._id === subSectionId)

        if(currSectionIndex === 0 && currSubSectionIndex === 0){
            return true
        }
        else{
            return false
        }
    }

    const isLastVideo = () => {
        const currSectionIndex = courseSectionData.findIndex((sec) => sec._id === sectionId)

        const currSubSectionIndex = courseSectionData[
            currSectionIndex
        ].subSection.findIndex((subSec) => subSec._id === subSectionId)

        if(currSectionIndex === courseSectionData.length-1 && 
           currSubSectionIndex === courseSectionData[currSectionIndex].subSection.length-1){
            return true
        }else{
            return false
        }
    }

    const goToPrevVideo = () => {
        const currSectionIndex = courseSectionData.findIndex((sec) => sec._id === sectionId)

        const currSubSectionIndex = courseSectionData[
            currSectionIndex
        ].subSection.findIndex((subSec) => subSec._id === subSectionId)

        if(currSubSectionIndex != 0){
            const prevSubsectionId = courseSectionData[currSectionIndex].subSection[currSubSectionIndex-1]._id

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubsectionId}`)
        }else{
            const prevSectionId = courseSectionData[currSectionIndex - 1]._id
            const prevSubSectionLength =
              courseSectionData[currSectionIndex - 1].subSection.length
            const prevSubSectionId =
              courseSectionData[currSectionIndex - 1].subSection[
                prevSubSectionLength - 1
              ]._id
            navigate(
              `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
            )
        }
    }

    const goToNextVideo = () => {
        const currSectionIndex = courseSectionData.findIndex((sec) => sec._id === sectionId)
        const currSubSectionIndex = courseSectionData[
            currSectionIndex
        ].subSection.findIndex((subSec) => subSec._id === subSectionId)

        const noOfSubSection = courseSectionData[currSectionIndex].subSection.length

        if(currSubSectionIndex !== noOfSubSection-1){
            const nextSubSectionId = courseSectionData[currSectionIndex].subSection[currSubSectionIndex+1]._id
            navigate(`/view-coures/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }else{
            const nextSectionId = courseSectionData[currSectionIndex+1]._id

            const nextSubSectionId = courseSectionData[currSectionIndex+1].subSection[0]._id

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    return (
        <>
            <div className="flex flex-col gap-5 text-white">
                {
                    !videoData ? (
                        <img
                            src={previewSource}
                            alt="Preview"
                            className="h-full w-full object-cover rounded-md"
                        />
                    ):(
                        <Player
                            src={videoData?.videoUrl}
                            playsInline
                            aspectRatio="16:9"
                            ref={playerRef}
                            onEnded={() => setVideoEnded(true)}
                        >
                            <BigPlayButton position="center"/>

                            {
                                videoEnded && (
                                    <div
                                    className="w-full h-full font-inter absolute grid place-content-center inset-0 z-[100]"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                                    }}>
                                        {!completedLectures.includes(subSectionId) && (
                                            <IconBtn
                                                text={!loading ? "Mark as Complete":"Loading..."}
                                                onclick={() => handleLectureCompletion()}
                                                customClasses="text-xl"
                                            />
                                        )}

                                        <IconBtn
                                            text="Rewatch"
                                            disabled={loading}
                                            onclick={() => {
                                                if(playerRef?.current){
                                                    playerRef?.current?.seek(0)
                                                    setVideoEnded(false)
                                                }
                                            }}

                                            customClasses="w-fit mt-2 mx-auto text-xl max-w-max px-4"
                                        />

                                        <div className={`flex min-w-[250px] mt-2 ${isFirstVideo() || isLastVideo() ? "justify-center":"justify-between"}`}>
                                            {
                                                !isFirstVideo() && (
                                                    <button
                                                    className="bg-yellow-50 text-xl font-semibold px-2 py-2 rounded-md text-richblack-900"
                                                    onClick={goToPrevVideo}>
                                                        Prev
                                                    </button>
                                                )
                                            }
                                            {
                                                !isLastVideo() && (
                                                    <button
                                                    className="bg-yellow-50 text-xl font-semibold px-2 py-2 rounded-md text-richblack-900"
                                                    onClick={goToNextVideo}>
                                                        Next
                                                    </button>
                                                )
                                            }
                                        </div>

                                    </div>
                                )
                            }
                        </Player>
                    )
                }

                <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
                <p className="pb-6">{videoData?.description}</p>
            </div>
        </>
    )
}