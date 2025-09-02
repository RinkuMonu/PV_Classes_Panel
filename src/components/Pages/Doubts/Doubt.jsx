import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";

const DoubtsTable = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [solutions, setSolutions] = useState({}); // store solutions per doubt
    const [selectedDoubt, setSelectedDoubt] = useState(null);

    // Fetch all doubts
    const fetchDoubts = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/doubt/all");
            let fetchedDoubts = res?.data?.doubts || [];

            // Sort so that unsolved doubts come first
            fetchedDoubts.sort((a, b) => {
                if (a.status === "unsolved" && b.status !== "unsolved") return -1;
                if (a.status !== "unsolved" && b.status === "unsolved") return 1;
                return 0; // keep relative order if same status
            });

            setDoubts(fetchedDoubts);
        } catch (error) {
            console.error("Error fetching doubts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch a doubt by ID
    const fetchDoubtById = async (id) => {
        try {
            const res = await axiosInstance.get(`/doubt/${id}`);
            setSelectedDoubt(res?.data || null);
        } catch (error) {
            console.error("Error fetching doubt by ID:", error);
            setSelectedDoubt(null);
        }
    };

    // Solve a doubt
    const handleSolve = async (id) => {
        const solution = solutions[id];
        if (!solution?.trim()) {
            alert("Please enter a solution before resolving!");
            return;
        }

        try {
            await axiosInstance.post(`/doubt/solve/${id}`, { solution });
            alert("Doubt resolved successfully!");
            setSolutions((prev) => ({ ...prev, [id]: "" }));
            fetchDoubts(); // refresh list
            if (selectedDoubt && selectedDoubt._id === id) {
                fetchDoubtById(id); // refresh selected doubt
            }
        } catch (error) {
            console.error("Error solving doubt:", error);
            alert("Failed to resolve doubt.");
        }
    };

    useEffect(() => {
        fetchDoubts();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Doubts List</h2>

            {loading ? (
                <p>Loading doubts...</p>
            ) : (
                <table className="w-full border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-3 py-2">#</th>
                            <th className="border px-3 py-2">User</th>
                            <th className="border px-3 py-2">Question</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doubts.map((doubt, idx) => (
                            <tr key={doubt.id}>
                                <td className="border px-3 py-2">{idx + 1}</td>
                                <td className="border px-3 py-2">{doubt.userName}</td>
                                <td className="border px-3 py-2">{doubt.title}</td>
                                <td className="border px-3 py-2">
                                    {doubt.status === "resolved" ? (
                                        <span className="text-green-600">✅ Resolved</span>
                                    ) : (
                                        <span className="text-red-600">❌ Pending</span>
                                    )}
                                </td>
                                <td className="border px-3 py-2 space-y-2">
                                    <button
                                        onClick={() => fetchDoubtById(doubt.id)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>

                                    {doubt.status !== "resolved" && (
                                        <div className="flex gap-2 mt-1">
                                            <input
                                                type="text"
                                                placeholder="Enter solution"
                                                value={solutions[doubt.id] || ""}
                                                onChange={(e) =>
                                                    setSolutions((prev) => ({
                                                        ...prev,
                                                        [doubt.id]: e.target.value,
                                                    }))
                                                }
                                                className="border p-1 text-sm flex-1"
                                            />
                                            <button
                                                onClick={() => handleSolve(doubt.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                            >
                                                Resolve
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Doubt details section */}
            {selectedDoubt && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Doubt Details</h3>
                    <p>
                        <strong>Question:</strong> {selectedDoubt.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {selectedDoubt.description}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {selectedDoubt.status === "resolved" ? (
                            <span className="text-green-600">✅ Resolved</span>
                        ) : (
                            <span className="text-red-600">❌ Pending</span>
                        )}
                    </p>
                    {selectedDoubt.status !== "resolved" && (
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                placeholder="Enter solution"
                                value={solutions[selectedDoubt._id] || ""}
                                onChange={(e) =>
                                    setSolutions((prev) => ({
                                        ...prev,
                                        [selectedDoubt._id]: e.target.value,
                                    }))
                                }
                                className="border p-1 text-sm flex-1"
                            />
                            <button
                                onClick={() => handleSolve(selectedDoubt._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Resolve
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoubtsTable;