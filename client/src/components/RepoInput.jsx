import { useState } from "react";
import api from "../services/api";

function RepoInput({ onIndexed, successMessage, onRepoChange }) {

    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleIndex() {

        if (!repoUrl.trim()) {
            alert("Please enter a GitHub repository URL");
            return;
        }

        try {

            setLoading(true);

            const { data } = await api.post(
                "/repositories/upload",
                {
                    repoUrl
                }
            );

            onRepoChange(repoUrl);

            onIndexed("Repository indexed successfully");


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-3xl mx-auto mt-12">

            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

                <div className="flex gap-3">

                    <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="Paste GitHub Repository URL..."
                        className="flex-1 bg-[#0B1120] border border-gray-700 rounded-xl px-5 py-4 outline-none text-white"
                    />

                    <button
                        onClick={handleIndex}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 transition rounded-xl px-8 font-semibold disabled:opacity-50"
                    >
                        {loading ? "..." : "Index"}
                    </button>

                </div>

                {
                    successMessage ? (
                        <p className="text-center text-green-400 mt-4">
                            ✓ {successMessage}
                        </p>
                    ) : (
                        <p className="text-center text-gray-500 mt-4">
                            Supports any public GitHub repository
                        </p>
                    )
                }

            </div>

        </div>

    );

}

export default RepoInput;