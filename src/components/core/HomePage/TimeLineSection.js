import React from 'react';
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timelineImage from '../../../assets/Images/TimelineImage.png'

export const TimeLineSection = () => {
    const timeLine = [
        {
            Logo:Logo1,
            heading:"Leadership",
            Description:"Fully committed to the success of company"
        },
        {
            Logo:Logo2,
            heading:"Responsibility",
            Description:"Students will always be our top priority"
        },
        {
            Logo:Logo3,
            heading:"Flexibility",
            Description:"The ability to switch is an important skills"
        },
        {
            Logo:Logo4,
            heading:"Solve the problem",
            Description:"Code your way to a solution"
        }
    ]

  return (
    <div>
      <div className='flex lg:flex-row flex-col gap-15 lg:items-center w-full'>

        <div className='lg:w-[45%] flex flex-col gap-5 w-full mb-4'>
            {
                timeLine.map( (element, index) => {
                    return (
                        <div className='flex flex-row gap-6' key={index}>

                            <div className='w-[50px] h-[50px] bg-white flex flex-col gap-4 items-center'>
                                <img src={element.Logo} alt='logo'/>
                            </div>

                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                <p className='text-base'>{element.Description}</p>
                            </div>

                        </div>
                    )
                } )
            }
        </div>
        <div className='shadow-blue-200 lg:w-[45%] relative w-full '>

            <img  src={timelineImage}
            alt="timelineImage"
            className='shadow-white object-cover h-fit'
            />

            <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase lg:py-7 py-4
                            left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                <div className='flex flex-row lg:gap-5 items-center border-r border-caribbeangreen-300 px-7 gap-3'>
                    <p className='lg:text-3xl font-bold text-2xl'>10</p>
                    <p className='text-caribbeangreen-300 lg:text-sm text-xs'>Years of Experience</p>
                </div>

                <div className='flex lg:gap-5 items-center px-7 gap-3'>
                <p className='lg:text-3xl font-bold text-2xl'>250</p>
                    <p className='text-caribbeangreen-300 lg:text-sm text-xs'>TYpe of Courses</p>
                </div>

            </div>

        </div>

      </div>
    </div>
  )
}
