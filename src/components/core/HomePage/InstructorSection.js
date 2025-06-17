import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import CTAbutton from './Button';

export const InstructorSection = () => {
  return (
    <div className='mt-16 flex lg:flex-row flex-col items-center mb-14 gap-12 justify-center'>
        <div className='lg:relative lg:w-[50%] z-0 lg:ml-8 w-full -mb-8 -ml-3'>
            <div className='lg:w-[440px] lg:h-[400px] bg-pure-greys-5 lg:absolute -z-10 -top-3 lg:-left-3 w-[300px] h-[300px] lg:block hidden'></div>
            <img
                src={Instructor}
                alt='Instructor'
                className='object-contain z-20 h-[400px] lg:mt-0 -mt-24'
            />
        </div>

        <div className='lg:w-[50%] flex flex-col gap-3 w-11/12 -ml-3'>
            <div className='text-white text-3xl font-semibold w-[50%]'>
                Become an  <span className='bg-gradient-to-r from-blue-300 to-blue-50 bg-clip-text text-transparent'>instructor</span>
            </div>
            <p className='text-md text-richblack-500 w-[85%] mb-8'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>

            <CTAbutton active={true} linkto={'signUp'} text={"Start Teaching Today"} arrow={true}/>
        </div>
    </div>
  )
}

