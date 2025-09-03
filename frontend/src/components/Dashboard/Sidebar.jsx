import { AiFillRedditCircle } from "react-icons/ai";
import { AiFillTool } from "react-icons/ai";
import { IoPieChartSharp } from "react-icons/io5";
import { IoBarChartSharp } from "react-icons/io5";
import { BsTable } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
function Sidebar() {
    return (
        <div className="fixed top-0 left-0 h-screen w-20 m-0 z-1
         flex flex-col items-center space-y-4 p-6 bg-gray-900 
         sm:flex hidden">
            <a href="#dashboardDiv" 
            className="hover:bg-green-600 p-[10px] hover:p-[10px]">
                <SidebarIcon icon={<FaHome />} />
            </a>
            <a href="#transactionDiv"
            className="hover:bg-green-600 p-[10px] hover:p-[10px]">
                <SidebarIcon icon={<BsTable />} />
            </a>
            <a href="#Charts"
            className="hover:bg-green-600 p-[10px] hover:p-[10px]">
                <SidebarIcon icon={<IoBarChartSharp />} />
            </a>
             <a href="#Charts"
            className="hover:bg-green-600 p-[10px] hover:p-[10px]">
                <SidebarIcon icon={<AiFillRedditCircle />} />
            </a>
              <a href="#Charts"
            className="hover:bg-green-600 p-[10px] hover:p-[10px]">
                <SidebarIcon icon={<AiFillTool />} />
            </a>
            
        </div>
    )
}

const SidebarIcon = ({ icon }) => <i className="text-[40px]">{icon}</i>;

export default Sidebar