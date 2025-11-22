import React, { useState } from "react";
import { queryLocal } from "../api/api";

function ResultBox({ result }) {
    if (!result) return null;

    const meta = result.meta || {};
    const entries = result.data || [];

    return (
        <div className="mt-6 p-4 rounded border bg-white shadow">
            <h3 className="font-semibold text-lg mb-4">Query Result</h3>

            <div className="text-sm mb-4 space-y-1">
                {meta.category && (
                    <p><b>Category:</b> {meta.category}</p>
                )}
                {meta.from && (
                    <p><b>From:</b> {new Date(meta.from).toLocaleString()}</p>
                )}
                {meta.to && (
                    <p><b>To:</b> {new Date(meta.to).toLocaleString()}</p>
                )}
                {meta.totalEntries !== undefined && (
                    <p><b>Total Entries:</b> {meta.totalEntries}</p>
                )}
                {meta.total !== undefined && (
                    <p><b>Total Spent:</b> ₹ {meta.total}</p>
                )}
            </div>

            <table className="w-full text-xs border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((e) => (
                        <tr key={e._id} className="border">
                            <td className="p-2 border">₹ {e.amount}</td>
                            <td className="p-2 border">{e.category}</td>
                            <td className="p-2 border">
                                {new Date(e.datetime).toLocaleString()}
                            </td>
                            <td className="p-2 border">{e.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function QueryBox() {
    const [queryText, setQueryText] = useState("");
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);

    const doQuery = async () => {
        if (!queryText.trim()) {
            return alert("Enter a query");
        }
        setBusy(true);
        setResult(null);
        try {
            const res = await queryLocal(queryText);
            setResult(res);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Query failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium">Natural Language Query</label>
                <input
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    className="block border p-2 rounded mt-1 w-full"
                    placeholder="How much did I spend on Groceries this month?"
                />
                <div className="mt-2">
                    <button
                        onClick={doQuery}
                        className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                        disabled={busy}
                    >
                        Search Expenses
                    </button>
                </div>
            </div>

            <ResultBox result={result} />
        </div>
    );
}

export default QueryBox;
