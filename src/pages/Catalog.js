import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { useSelector } from 'react-redux'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import  CourseSlider  from '../components/core/Catalog/CourseSlider'
import { Course_Card } from '../components/core/Catalog/Course_Card'
import {Footer} from "../components/common/footer"

export const Catalog = () => {

    const { catalogName } = useParams()
    const {loading} = useSelector((state) => state.profile)
    const [categoryId,setCategoryId] = useState(null)
    const [catalogPageData,setcatalogPageData] = useState("")
    const [active, setActive] = useState(1)

    useEffect(() => {
        ;(async () => {
            try{

                const res = await apiConnector("GET",categories.CATEGORIES_API)
                const category_id = res?.data?.data.filter((ct) => 
                    ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
                setCategoryId(category_id)
            }
            catch(error){
                console.log("Could not fetch categories",error)
            }
        })()
    },[catalogName])

    useEffect(() => {
        if(categoryId){
            ;(async () => {
                try{
                    const result = await getCatalogPageData(categoryId)
                   setcatalogPageData(result)
                }
                catch(error){
                    console.log(error)
                }
            })()
        }
    },[categoryId])
  return (
    <>
        {/* Section 1 */}
        <div className='bg-richblack-800 px-14 box-content'>
            <div className='min-h-[260px] max-w-maxContentTab justify-center mx-auto flex flex-col gap-4 lg:max-w-maxContent'>
                <p className='text-sm text-richblack-300'>
                    {'Home/Catalog/'}
                    <span className='text-yellow-25'>{catalogPageData?.selectedCategory?.name}</span>
                </p>
                <p className='text-richblack-25 text-3xl font-bold uppercase'>
                    {catalogPageData?.selectedCategory?.name}
                </p>
                <p className='text-richblack-300 max-w-[870px]'>
                    {
                        catalogPageData?.selectedCategory?.description
                    }
                </p>
            </div>
        </div>

        {/* Section 2 */}
        <div className='box-content w-full max-w-maxContentTab px-14 py-12 lg:max-w-maxContent flex flex-col mx-auto'>
            <div className='section_heading'>Course to get you started</div>
            <div className='flex border-b border-richblack-600 my-4 text-sm'>
                <p className={`${active === 1 ?
                              "text-yellow-25 border-b border-yellow-25":"text-richblack-50"}
                              px-4 py-2 cursor-pointer`}
                onClick={() => setActive(1)}
                >
                    Most Popular
                </p>
                <p className={`${active === 2 ? 
                               "text-yellow-25 border-b border-yellow-25":"text-richblack-50"}
                               cursor-pointer px-4 py-2`}
                onClick={() => setActive(2)}
                >
                    New
                </p>
            </div>
            <div>
                <CourseSlider Courses = {catalogPageData?.selectedCategory?.course}/>
            </div>
        </div>

        {/* Section 3 */}
        <div className='mx-auto box-content max-w-maxContentTab lg:max-w-maxContent w-full px-14 py-12'>
            <div className='section_heading'>
                Top courses in {catalogPageData?.differentCategory?.name}
            </div>
            <div className='py-8'>
                <CourseSlider
                    Courses = {catalogPageData?.differentCategory?.course}
                />
            </div>
        </div>

        {/* Section-4 */}
        <div className='mx-auto box-content max-w-maxContentTab lg:max-w-maxContent px-14 py-12 w-full'>
            <div className='section_heading'>Frequently Brought</div>
            <div className='py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                    {
                        catalogPageData?.mostSellingCourses?.slice(0,4).map((course,i) => (
                            <Course_Card course = {course} key={i} Height={"h-[300px]"}/>
                        ))
                    }
                </div>

            </div>
        </div>

        <Footer/>
    </>
  )
}
