import api from "../services/api";

function RepositorySelector({
    repositories,
    selectedRepo,
    onSelect,
    onRefresh,
    onIndexed
}) {

    async function handleDelete() {

        if (!selectedRepo) return;

        const ok = window.confirm(
            `Delete "${selectedRepo}"?`
        );

        if (!ok) return;

        try {

            await api.delete(`/repositories/${selectedRepo}`);

            onRefresh();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete repository."
            );

        }

    }

    async function handleReindex() {

        if (!selectedRepo) return;

        try {

            await api.post(
                `/repositories/${selectedRepo}/reindex`
            );

            onRefresh();

            onIndexed("Repository re-indexed successfully");

        } catch (error) {

            console.log(error);

            alert(error.message);

        }

    }

    if (repositories.length === 0) {
        return null;
    }

    return (

        <div className="max-w-3xl mx-auto mt-8">

            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5">

                <div className="flex gap-3 items-center">

                    <select
                        value={selectedRepo}
                        onChange={(e) => onSelect(e.target.value)}
                        className="flex-1 bg-[#0B1120] border border-gray-700 rounded-xl px-4 py-3 outline-none"
                    >
                        {repositories.map(repo => (

                            <option
                                key={repo.name}
                                value={repo.name}
                            >
                                {repo.name}
                            </option>

                        ))}
                    </select>

                    <button
                        onClick={handleReindex}
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold"
                    >
                        Re-index
                    </button>

                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RepositorySelector;