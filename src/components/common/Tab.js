import React from 'react'

export const Tab = ({tabData,field,setField}) => {
  return (
    <div className='bg-richblack-800  rounded-full p-1  my-6 max-w-max flex '>
      {
        tabData.map((tab) => (
          <button key={tab.id}
          onClick={() => setField(tab.type)}
          className={`${field === tab.type?"bg-richblack-900 text-richblack-5":"bg-transparent text-richblack-200"}
          py-2 px-5 rounded-full transition-all duration-200 `}
          >
            {tab?.tabName}
          </button>
        ))
      }
    </div>
  )
}
