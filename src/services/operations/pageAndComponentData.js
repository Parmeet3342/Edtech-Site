import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from '../apiconnector'
import { categories } from '../apis'

const {
    GET_CATEGORYDETAILS_API
} = categories

export const getCatalogPageData = async (categoryId) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try{

    const response = await apiConnector("POST",GET_CATEGORYDETAILS_API,{categoryId})

    if(!response?.data?.success){
        throw new Error(response?.data?.message)
    }

    result = response?.data?.data
    toast.success("Category details fetched")
  }
  catch(error){
    console.log("CATEGORY DETAIL API error",error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}
