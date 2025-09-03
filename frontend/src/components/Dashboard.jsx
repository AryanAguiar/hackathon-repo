import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addAccount, deleteUser, getUser } from '../services/api';
import ListTransactions from './ListTransactions';


// IMPORTS
import Sidebar from './Dashboard/Sidebar';
import Example from './Dashboard/Example';
import ChartsPie from './Charts/ChartsPie';
import ChartsBar from './Charts/ChartsBar';
import ChartsLine from './Charts/ChartsLine';
import ColorThemes from './Charts/ColorThemes';


// MENU
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

// ICONS
import { MdAccountCircle } from "react-icons/md";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";

// Topbar
function Topbar(props) {
  return (

    <>
      <div className="absolute flex items-center space-x-2 w-full bg-black z-0
        justify-end p-4 h-20 ">
        <Menu as="div" className="flex space-x-1.5 p-2 items-center flex-col
            hover:bg-green-900 rounded-md"
        >
          <MenuButton className='flex space-x-1.5 p-2 items-center
            hover:bg-green-500 rounded-md'>
            <TopbarIcon icon={<MdAccountCircle />} />
            <h1>{props.userName}</h1>
            <TopbarIcon icon={<IoMdArrowDropdown className="size-5" />} />
          </MenuButton>
          <MenuItems anchor="bottom start" className="bg-gradient-to-b from-gray-950/70 to-gray-700/30 backdrop-blur-2xl opacity-90 rounded-xl mt-4 px-4 hover:bg-gray-900">
            <MenuItem className='flex space-x-2 my-4 p-4 items-center hover:bg-green-500 rounded-md'>
              <button onClick={props.logoutFunc}>
                <h1>Logout</h1> <IoIosLogOut className='size-5' />
              </button>
            </MenuItem>
            <MenuItem className='flex space-x-2 my-4 p-4 items-center hover:bg-green-400 rounded-md'>
              <button onClick={props.deleteUserFunc} className='text-red-500 hover:bg-red-500 hover:text-amber-50'>
                <h1>Delete</h1> <MdDeleteForever className='size-5' />
              </button>
            </MenuItem>

          </MenuItems>
        </Menu>
      </div>
    </>
  )
}

const TopbarIcon = ({ icon }) => <i className="text-4xl">{icon}</i>;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [newAccount, setNewAccount] = useState({
    // accountId: "",
    // bankName: "",
    // accountType: "savings",
    // balance: 0,
    bankName: "",
    mobile: "",
  });

  // Toggle Display
  const [display, setDisplay] = useState(true);

  const navigate = useNavigate();
  const [refreshTransactions, setRefreshTransactions] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await addAccount(user._id, newAccount);
      const updatedUser = { ...user, accounts: res.data.accounts };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // setNewAccount({ accountId: "", bankName: "", accountType: "", balance: 0 });
      setNewAccount({ bankName: "", mobile: "" });
      setRefreshTransactions(prev => prev + 1); //this re-renders the table component everytime an account is added
    } catch (err) {
      alert(err.response?.data?.message || "Error adding account");
    }
  };

  const refetchTransactions = () => {
    setRefreshTransactions(prev => prev + 1);
  }

  const handleDeleteUser = async () => {

    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteUser(user._id);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting account");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div id='dashboardDiv' className='grid grid-cols-20 bg-gradient-to-br from-black to-blue-500'>
      <Sidebar />
      <Topbar userName={user.name} logoutFunc={handleLogout} deleteUserFunc={handleDeleteUser} />
      <div style={{ padding: "20px" }}
        className='flex flex-col text-4xl  mt-20
        col-start-1 col-span-20
        sm:ml-20'>
        <h1 className='text-6xl font-bold'>Welcome, {user.name}</h1>
        <p>{user.email}</p>

        <div className='flex flex-col bg-gradient-to-br from-pink-700 via-pink-700/30 to-red-600 backdrop-blur-3xl rounded-3xl p-10 mt-10 
        drop-shadow-10xl
        space-y-1.5 lg:w-180'>
          <h2 className='text-5xl font-bold drop-shadow-amber-500/50'>Balance: ₹{user.balance}</h2> <h2 className='text-3xl'>Your account</h2>
          {user.accounts.length > 0 ? (
            <ul>
              {user.accounts.map((acc) => {
                <li key={acc.accountId}>
                  {acc.bankName} ({acc.accountType}) - Balance: ₹{acc.balance}
                </li>
              })}
            </ul>
          ) : (
            <p className='text-2xl text-red-500'>No account linked yet!</p>
          )}

          <h3 className='font-semibold mt-2'>Link account</h3>

          <form onSubmit={handleAddAccount} className='mt-5 space-x-10 space-y-4 flex flex-col 
          justify-between text-center'>
            {/* <input
          type="text"
          placeholder='Account ID'
          value={newAccount.accountId}
          onChange={(e) => setNewAccount({ ...newAccount, accountId: e.target.value })}
        />

        <input
          type="text"
          placeholder="Bank Name"
          value={newAccount.bankName}
          onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
          required
        />

        <select
          value={newAccount.accountType}
          onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
        </select>

        <input
          type="number"
          placeholder="Balance"
          value={newAccount.balance}
          onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
        />
        <button type="submit">Add Account</button> */}
            <label className='inline-flex'>Bank Name: </label>
            <input
              type="text"
              placeholder="Bank Name"
              value={newAccount.bankName}
              onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
              required
              className='border-1 border-gray-100 rounded-lg p-3 w-full lg:w-160 bg-black text-gray-400'
            />

            <label className='flex'>PIN:</label>
            <input
              type="text"
              placeholder="xxx-xxx-xxxxx"
              value={newAccount.mobile}
              onChange={(e) => setNewAccount({ ...newAccount, mobile: e.target.value.replace(/\D/g, "") })} //ensures that only digits are stored
              maxLength={10}
              pattern="\d{10}"
              required
              className='border-1 border-gray-100 rounded-lg p-2 w-full sm:w-80 bg-black text-gray-400 text-center flex'
            />

            <button type="submit" className='border-1 border-gray-100 rounded-lg p-2 w-full sm:w-80 
          bg-gray-400 text-black
          hover:bg-gray-600 hover:text-white hover:border-white
          font-bold text-2xl uppercase'>Add Account</button>
          </form>
        </div>

        <div id='transactionDiv' 
        className='flex flex-col 
        w-full
        bg-gray-950/30 backdrop-blur-3xl rounded-3xl p-10 mt-10 space-y-1.5 opacity-[90%]'>
          <button onClick={refetchTransactions} className='mt-5 flex space-x-4 items-center'>
            <TfiReload />
            <h1>Reload transactions</h1>
          </button>


          {/* these Buttons shifted to Topbar 
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleDeleteUser} style={{ color: "red", marginLeft: "10px" }}>
            Delete User
          </button>
          */}
          <div>
            <button className='mt-10 flex space-x-2 items-center cursor-pointer' onClick={() => setDisplay(!display)}>
              <h1 id="transactionH1">Transactions</h1>
              {
                display ? <IoMdArrowDropdown /> : <IoMdArrowDropdown className='rotate-180' />
              }
              </button>


            {
              display ?  
              <>
              <ListTransactions refreshTransactions={refreshTransactions} />      
              </>
              : null
           
            }
             
          </div>
        </div>

        {/* Charts */}
        <div className='p-15 inline-flex 
        flex-col bg-gray-700 rounded-3xl 
        xl:divide-x-4 divide-gray-600 xl:flex-row
        mt-10 space-x-1.5'>
          <ChartsPie colors={ColorThemes.VioletTheme} />
          <ChartsPie colors={ColorThemes.Ordinary} />
        </div>
        <div id='Charts' className='lg:grid grid-cols-10
        gap-x-5'>
          <div className='space-y-20 col-span-5 p-15 
         bg-gray-700 rounded-3xl mt-5 justify-around'> 
            <ChartsPie colors={ColorThemes.rainbowBright} />
            <ChartsPie colors={ColorThemes.cyberpunk} />
          </div>
          <div className='space-y-20 col-span-5 p-15
         bg-gray-700 rounded-3xl mt-5 justify-around'>
              <ChartsPie colors={ColorThemes.rainbowBright} />
          <ChartsPie colors={ColorThemes.cyberpunk} />
          </div>
          <div className='space-y-20 col-span-5 p-15 
         bg-gray-700 rounded-3xl mt-5 justify-around'>
              <ChartsPie colors={ColorThemes.rainbowBright} />
          </div>
          <div className='space-y-20 col-span-5 p-15
         bg-gray-700 rounded-3xl mt-5 justify-around'>
              <ChartsBar colors={ColorThemes.rainbowBright} />
          </div>

          <div className='space-y-20 col-span-7 p-15
         bg-gray-700 rounded-3xl mt-5 justify-around'> 
            <ChartsLine />
          </div>
          <div className='space-y-20 p-15 col-span-3
         bg-gray-700 rounded-3xl mt-5 justify-around'> 
            <ChartsPie />
          </div>
        </div>

        <div className='p-15 inline-flex flex-col bg-gray-700 rounded-3xl mt-10 space-y-20 w-[50%]'>
          
        </div>
      </div>
    </div>
  )
}

export default Dashboard