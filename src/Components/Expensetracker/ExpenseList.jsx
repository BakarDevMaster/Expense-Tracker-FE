// src/components/Expenses/ExpenseList.jsx
import React, { useEffect, useState } from 'react';

import ExpenseItem from './ExpenseItem'; // Adjust the import path as needed
import PropTypes from 'prop-types'; // For prop type validation
import LoadingSpinner from './LoadingSpinner';

const ExpenseList = ({ refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8090/expenses/', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data.reverse());
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]); // Re-fetch expenses when refreshTrigger changes

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8090/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      setExpenses((currentExpenses) => currentExpenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      setError(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4" role="alert">
          {error}
        </div>
      )}
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map(expense => (
            <ExpenseItem key={expense.id} expense={expense} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

ExpenseList.propTypes = {
  refreshTrigger: PropTypes.number.isRequired, // Ensure refreshTrigger is provided and is a number
};

export default ExpenseList;
