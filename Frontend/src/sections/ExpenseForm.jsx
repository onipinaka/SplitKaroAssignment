import React, { useState } from "react";
import { addExpense } from "../api/api";

function ExpenseForm() {

    const [amount,setAmount] = useState("")
    const [category,setCategory] = useState("grocery")
    const [description,setDescription] = useState("")
    const [datetime,setDatetime] = useState("")
    const [busy,setBusy] = useState(false)

    const submit = async (e)=>{

        e.preventDefault();
        setBusy(true);
        try {
            await addExpense({
                amount: Number(amount),
                category,
                datetime: datetime || new Date().toISOString(),
                description,
            });

            setAmount("")
            setDatetime("")
            setDescription("")
            setCategory("grocery")
            alert("added successfully")

        } catch (error) {
            console.error(error);
            alert(error || "failed to add expense")
        } finally{
            setBusy(false);
        }

    }


    return (
        <>
            <div>
                <p>Add Expense</p>
                <form action="" onSubmit={submit}>
                    <input
                        className=" border p-2 rounded"
                        placeholder="Amount"
                        type="number"
                        value={amount}
                        required
                        onChange={(e)=>(setAmount(e.target.value))}
                    />
                    <select className="rounded border-2 h-12 w-40" name="category" value={category} id="category" onChange={(e)=>(setCategory(e.target.value))}>
                        <option value="grocery">grocery</option>
                        <option value="food">food</option>
                        <option value="bill">bill</option>
                        <option value="rent">rent</option>
                    </select>
                    <input
                        className=" border p-2 rounded"
                        type="datetime-local"
                        value={datetime}
                        onChange={(e)=>(setDatetime(e.target.value))}
                    />
                    <input
                        className=" border p-2 rounded"
                        placeholder="Description"
                        value={description}
                        onChange={(e)=>(setDescription(e.target.value))}
                        
                    />
                    <button
                        className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50" disabled={busy}
                    >
                        Add Expense
                    </button>
                </form>
            </div>
        </>
    );
}

export default ExpenseForm;
