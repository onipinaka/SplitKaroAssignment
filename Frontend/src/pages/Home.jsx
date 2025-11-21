import React from 'react'
import ExpenseForm from '../sections/ExpenseForm'
import QueryBox from '../sections/QueryBox'

function Home() {
  return (
    <div>
        <p>SplitKaro</p>
        <div>
            <ExpenseForm/>
            <QueryBox/>
        </div>
    </div>
  )
}

export default Home