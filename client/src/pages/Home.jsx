import Navbar from "../components/Navbar";
import RepoInput from "../components/RepoInput";
import ChatBox from "../components/ChatBox";
import { useEffect, useState } from "react";
import api from "../services/api";
import RepositorySelector from "../components/RepositorySelector";

function Home() {

    const [isIndexed, setIsIndexed] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [repoUrl, setRepoUrl] = useState("");

    const [repositories, setRepositories] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState("");

    async function loadRepositories() {

        try {

            const { data } = await api.get("/repositories");

            setRepositories(data.repositories);

            if (data.repositories.length === 0) {

                setSelectedRepo("");
                setRepoUrl("");
                setIsIndexed(false);

                return;
            }

            const exists = data.repositories.find(
                r => r.name === selectedRepo
            );

            const repo = exists || data.repositories[0];

            setSelectedRepo(repo.name);
            setRepoUrl(repo.name);
            setIsIndexed(true);

        } catch (error) {

            console.log(error);

        }

    }

    useEffect(() => {
        loadRepositories();
    }, []);

    function handleIndexed(message = "Repository indexed successfully") {

        setIsIndexed(true);

        setSuccessMessage(message);

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        loadRepositories();

    }

    function handleRepoSelect(repo) {

        setSelectedRepo(repo);
        setRepoUrl(repo);

    }

    return (
        <div className="min-h-screen bg-[#0B1120] text-white">

            {
                successMessage && (

                    <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">

                        {successMessage}

                    </div>

                )
            }

            <div className="max-w-6xl mx-auto px-6">

                <Navbar />

                <div className="py-20 text-center">

                    <h1 className="text-6xl font-bold">
                        RepoLens AI
                    </h1>

                    <p className="text-gray-400 text-xl mt-6">
                        Chat with any GitHub repository using AI
                    </p>

                </div>

                <RepoInput
                    successMessage={successMessage}
                    onIndexed={handleIndexed}
                    onRepoChange={setRepoUrl}
                />

                <RepositorySelector
                    repositories={repositories}
                    selectedRepo={selectedRepo}
                    onSelect={setSelectedRepo}
                    onRefresh={loadRepositories}
                    onIndexed={handleIndexed}
                />

                {isIndexed && (
                    <ChatBox
                        key={repoUrl}
                        repoUrl={repoUrl}
                    />
                )}

            </div>

        </div>
    );
}

export default Home;