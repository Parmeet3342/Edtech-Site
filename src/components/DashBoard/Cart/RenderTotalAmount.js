import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {IconBtn} from '../../common/IconBtn'
import { buyCourse } from '../../../services/operations/studentFeaturesAPI'
import { useNavigate } from 'react-router-dom'

export const RenderTotalAmount = () => {
    const {total,cart} = useSelector((state) => state.cart)
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlebuyCourse = () =>{
        const courses = cart.map((course) => course._id);
        console.log(courses);
        if(token){
          buyCourse(token,[courses],user,navigate,dispatch);
        }
    }

  return (
    <div className='p-6 bg-richblack-800 border-[1px] rounded-md min-w-[280px] border-richblack-700'>
        <p className='mb-1 text-sm font-medium text-richblack-300'>Total:</p>
        <p className='mb-6 text-3xl font-medium text-yellow-100'>₹ {total}</p>
        <IconBtn
            text="Buy Now"
            onclick={handlebuyCourse}
            customClasses="w-full justify-center"
        />
    </div>
  )
}
