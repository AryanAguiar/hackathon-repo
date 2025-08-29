import { AiFillRedditCircle } from "react-icons/ai";
import { AiFillTool } from "react-icons/ai";

function Sidebar() {
    return (
        <div className="fixed top-0 left-0 h-screen w-20 m-0 z-1
         flex flex-col items-center space-y-6 p-6 bg-gray-900 
         sm:flex hidden">
            <SidebarIcon icon={<AiFillRedditCircle />} />
            <SidebarIcon icon={<AiFillTool />} />
        </div>
    )
}

const SidebarIcon = ({ icon }) => <i className="text-5xl hover:bg-green-400">{icon}</i>;

export default Sidebar