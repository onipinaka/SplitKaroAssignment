import React from 'react'
import ExpenseForm from '../sections/ExpenseForm'
import QueryBox from '../sections/QueryBox'

function Home() {
  return (
    <div className='flex flex-col justify-center items-center  h-screen lg:w-screen w-[80vw]'>
        <p>SplitKaro</p>
        <div>
            <ExpenseForm/>
            <QueryBox/>
        </div>
    </div>
  )
}

export default Home