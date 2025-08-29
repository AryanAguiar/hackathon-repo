import React, { useState } from "react";
import { fetchTransactions } from "../services/api";

const TransactionsFilter = ({ setTransactions }) => {
  const [filter, setFilter] = useState("");

  const handleChange = async (e) => {
    const selected = e.target.value;
    setFilter(selected);

    // Call backend with filter
    const { data } = await fetchTransactions({ range: selected }); //important has to be range because backend takes the parameter range
    setTransactions(data);
  };

  return (
    <select value={filter} onChange={handleChange} className="bg-gray-900 border border-gray-300 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 my-4" >
      <option value="">All</option>
      <option value="weekly">Last 7 Days</option>
      <option value="monthly">Last 30 Days</option>
      <option value="quarterly">Last 3 Months</option>
    </select>
  );
};

export default TransactionsFilter;
