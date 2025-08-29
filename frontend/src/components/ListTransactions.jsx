import React, { useEffect, useState } from 'react'
import { fetchTransactions } from '../services/api';
import moment from 'moment';
import TransactionsFilter from './TransactionFilter';

const ListTransactions = ({ refreshTransactions }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const res = await fetchTransactions();
                const transactions = res.data;
                setTransactions(transactions);
            } catch (err) {
                console.error("Error fetching transactions: ", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        getTransactions();
    }, [refreshTransactions]);

    if (loading) return <p>Loading Transactions...</p>;

    return (
        <div className="p-4 text-xl">
            <TransactionsFilter setTransactions={setTransactions}/>
            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table className="table-auto w-full border-collapse border-2
                 border-gray-700 bg-gradient-to-bl from-cyan-600 to-gray-900 ">
                    <thead>
                        <tr className="bg-black text-cyan-400 ">
                            <th className="border px-4 py-2">Bank Name</th>
                            <th className="border px-4 py-2">Account ID</th>
                            <th className="border px-4 py-2">Transaction ID</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Category</th>
                            <th className="border px-4 py-2">Amount</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Balance</th>
                            <th className="border px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx._id.$oid} >
                                <td className="border px-4 py-2">{tx.account.bankName}</td>
                                <td className="border px-4 py-2">{tx.accountId}</td>
                                <td className="border px-4 py-2">{tx.transactionId}</td>
                                <td className="border px-4 py-2">{tx.type}</td>
                                <td className="border px-4 py-2">{tx.category}</td>
                                <td className="border px-4 py-2">{tx.amount}</td>
                                <td className="border px-4 py-2">{tx.description}</td>
                                <td className="border px-4 py-2">{tx.balanceAfter}</td>
                                <td className="border px-4 py-2">{moment(tx.date).format("DD/MM/YYYY HH:mm")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ListTransactions