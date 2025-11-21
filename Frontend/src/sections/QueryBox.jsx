import React, { useState } from "react";

function QueryBox() {
    const [queryLocalText, setQueryLocalText] = useState("");
    const [queryGeminiText, setQueryGeminiText] = useState("");
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);

    const doLocal = async () => {
        if (!queryLocalText.trim()) {
            return alert("Enter a query");
        }
        setBusy(true);
        setResult(null);
        try {
            const res = await queryLocal(queryLocalText);
            setResult(res);
        } catch (err) {
            console.error(err);
            alert(err || "Local parse failed");
        } finally {
            setBusy(false);
        }
    };

    const doGemini = async () => {
        if (!queryGeminiText.trim()) {
            return alert("Enter a query for Gemini");
        }
        setBusy(true);
        setResult(null);
        try {
            const res = await queryGemini(queryGeminiText);
            setResult(res);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Gemini parse failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium">Use Local Parser</label>
                <input
                    value={queryLocalText}
                    onChange={(e) => setQueryLocalText(e.target.value)}
                    className=" border p-2 rounded mt-1"
                    placeholder="How much did I spend on Groceries this month?"
                />
                <div className="mt-2">
                    <button
                        onClick={doLocal}
                        className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                        disabled={busy}
                    >
                        Run Local Parser
                    </button>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Use Gemini AI</label>
                <input
                    value={queryGeminiText}
                    onChange={(e) => setQueryGeminiText(e.target.value)}
                    className=" border p-2 rounded mt-1"
                    placeholder="Where all did I spend last Saturday?"
                />
                <div className="mt-2">
                    <button
                        onClick={doGemini}
                        className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
                        disabled={busy}
                    >
                        Run Gemini Parser
                    </button>
                </div>
            </div>

            <p>result here</p>

            {result && (
                <div className="mt-4 bg-gray-100 p-3 rounded border-2 border-black border-solid">
                    <p className="font-medium mb-2">Result</p>
                    <p className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                    </p>
                </div>
            )}
        </div>
    );
}

export default QueryBox;
