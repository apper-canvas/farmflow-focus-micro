import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import StatsCard from '@/components/molecules/StatsCard';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { useExpenses } from '@/hooks/useExpenses';
import { useFarms } from '@/hooks/useFarms';
import { toast } from 'react-toastify';

const Expenses = ({ selectedFarmId }) => {
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense, fetchExpenses } = useExpenses();
  const { farms } = useFarms();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    farmId: selectedFarmId,
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseCategories = [
    { value: 'seeds', label: 'Seeds & Seedlings' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'labor', label: 'Labor' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Categories' },
    ...expenseCategories
  ];

  const farmExpenses = expenses.filter(expense => expense.farmId === selectedFarmId);

  const filteredExpenses = farmExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalExpenses = farmExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = farmExpenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenseCategories.map(category => ({
    ...category,
    total: farmExpenses
      .filter(expense => expense.category === category.value)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(category => category.total > 0);

  const handleFormChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const expenseData = {
        ...formData,
        farmId: selectedFarmId,
        amount: parseFloat(formData.amount)
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await addExpense(expenseData);
        toast.success('Expense recorded successfully');
      }
      
      setShowForm(false);
      setEditingExpense(null);
      setFormData({
        farmId: selectedFarmId,
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error('Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      farmId: expense.farmId,
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date
    });
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        toast.success('Expense deleted successfully');
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData({
      farmId: selectedFarmId,
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'seeds': 'Sprout',
      'fertilizer': 'Droplets',
      'pesticides': 'Bug',
      'equipment': 'Wrench',
      'fuel': 'Fuel',
      'labor': 'Users',
      'maintenance': 'Settings',
      'utilities': 'Zap',
      'insurance': 'Shield',
      'other': 'Package'
    };
    return iconMap[category] || 'DollarSign';
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={fetchExpenses} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">
            Track expenses for {farms.find(f => f.id === selectedFarmId)?.name || 'Selected Farm'}
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add Expense
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          icon="DollarSign"
          color="earth"
          gradient
        />
        <StatsCard
          title="This Month"
          value={`$${monthlyExpenses.toFixed(2)}`}
          icon="Calendar"
          color="amber"
          gradient
        />
        <StatsCard
          title="Categories"
          value={categoryTotals.length}
          icon="Tag"
          color="forest"
          gradient
        />
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTotals.map((category) => (
              <div key={category.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-earth-400 to-earth-500 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name={getCategoryIcon(category.value)} className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{category.label}</span>
                </div>
                <span className="font-semibold text-gray-900">${category.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        
        <div className="w-full sm:w-48">
          <FormField
            type="select"
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            options={filterOptions}
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-forest-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingExpense ? 'Edit Expense' : 'Record New Expense'}
            </h3>
            <Button variant="ghost" size="sm" icon="X" onClick={handleCancel} />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                options={expenseCategories}
                required
              />
              
              <FormField
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleFormChange}
                placeholder="0.00"
                required
                icon="DollarSign"
              />
              
              <FormField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Describe the expense..."
              required
            />
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingExpense ? 'Update Expense' : 'Record Expense'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Empty
          type="expenses"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">
                        {expenseCategories.find(cat => cat.value === expense.category)?.label || expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEdit(expense)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Expenses;