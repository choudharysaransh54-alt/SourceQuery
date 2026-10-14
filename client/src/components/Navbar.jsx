import { GitBranch } from "lucide-react";

function Navbar() {

    return (

        <nav className="flex justify-between items-center py-6">

            <h2 className="text-2xl font-bold text-blue-500">
                SourceQuery
            </h2>

            <a
                href="https://github.com/choudharysaransh54-alt/SourceQuery"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
                <GitBranch size={20} />
                GitHub
            </a>

        </nav>

    );

}

export default Navbar;