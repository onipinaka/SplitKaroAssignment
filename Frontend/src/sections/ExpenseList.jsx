import React from 'react'

function ExpenseList() {
  return (
   <div>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Amount</th>
            <th className="p-2">Category</th>
            <th className="p-2">Date</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e._id} className="border-b">
              <td className="p-2">₹ {e.amount.toFixed(2)}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2">{new Date(e.datetime).toLocaleString()}</td>
              <td className="p-2">{e.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseList;