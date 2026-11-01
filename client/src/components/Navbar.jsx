import { GitBranch } from "lucide-react";

function Navbar() {

    return (

        <nav className="flex justify-between items-center py-6">

            <h2 className="text-2xl font-bold text-blue-500">
                RepoLens AI
            </h2>

            <a
                href="https://github.com"
                target="_blank"
                className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
                <GitBranch size={20} />
                GitHub
            </a>

        </nav>

    );

}

export default Navbar;