import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addAccount, deleteUser, getUser } from '../services/api';
import ListTransactions from './ListTransactions';

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
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>

      <h2>Your account</h2>
      {user.accounts.length > 0 ? (
        <ul>
          {user.accounts.map((acc) => {
            <li key={acc.accountId}>
              {acc.bankName} ({acc.accountType}) - Balance: ₹{acc.balance}
            </li>
          })}
        </ul>
      ) : (
        <p>No account linked yet</p>
      )}

      <h3>Link account</h3>
      <form onSubmit={handleAddAccount}>
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

        <input
          type="text"
          placeholder="Bank Name"
          value={newAccount.bankName}
          onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="min 10 digits"
          value={newAccount.mobile}
          onChange={(e) => setNewAccount({ ...newAccount, mobile: e.target.value.replace(/\D/g, "") })} //ensures that only digits are stored
          maxLength={10}
          pattern="\d{10}"
          required
        />

        <button type="submit">Add Account</button>
      </form>
      <button onClick={refetchTransactions}>Reload transactions</button>
      <br />
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDeleteUser} style={{ color: "red", marginLeft: "10px" }}>
        Delete User
      </button>

      <ListTransactions refreshTransactions={refreshTransactions} />
    </div>
  )
}

export default Dashboard