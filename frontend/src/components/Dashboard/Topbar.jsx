import { MdAccountCircle } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
function Topbar(props) {
    return (
        <div className="absolute flex items-center space-x-2 w-full bg-black z-0
        justify-end p-4 h-20 ">
            <button className="flex space-x-1.5 p-2 items-center
            hover:bg-green-400 rounded-md"
            >
            <TopbarIcon icon={<MdAccountCircle />} />
            <h1>{props.userName}</h1>
            <TopbarIcon icon={<IoMdArrowDropdown className="size-5" />} />
            </button>
        </div>
    )
}

const TopbarIcon = ({ icon }) => <i className="text-4xl">{icon}</i>;

export default Topbar