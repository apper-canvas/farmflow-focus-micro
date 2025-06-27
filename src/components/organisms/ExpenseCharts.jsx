import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ExpenseCharts = ({ expenses = [], loading = false }) => {
  const [dateRange, setDateRange] = useState('last3months');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const dateRangeOptions = [
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const expenseCategories = [
    { value: 'seeds', label: 'Seeds & Seedlings', color: '#10B981' },
    { value: 'fertilizer', label: 'Fertilizer', color: '#F59E0B' },
    { value: 'pesticides', label: 'Pesticides', color: '#EF4444' },
    { value: 'equipment', label: 'Equipment', color: '#8B5CF6' },
    { value: 'fuel', label: 'Fuel', color: '#F97316' },
    { value: 'labor', label: 'Labor', color: '#06B6D4' },
    { value: 'maintenance', label: 'Maintenance', color: '#84CC16' },
    { value: 'utilities', label: 'Utilities', color: '#6366F1' },
    { value: 'insurance', label: 'Insurance', color: '#EC4899' },
    { value: 'other', label: 'Other', color: '#6B7280' }
  ];

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    let start, end;

    switch (dateRange) {
      case 'last30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = now;
        break;
      case 'last3months':
        start = subMonths(now, 3);
        end = now;
        break;
      case 'last6months':
        start = subMonths(now, 6);
        end = now;
        break;
      case 'last12months':
        start = subMonths(now, 12);
        end = now;
        break;
      case 'custom':
        start = customStartDate ? new Date(customStartDate) : subMonths(now, 3);
        end = customEndDate ? new Date(customEndDate) : now;
        break;
      default:
        start = subMonths(now, 3);
        end = now;
    }

    return { start, end };
  };

  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    const { start, end } = getDateRange();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start, end });
    });
  }, [expenses, dateRange, customStartDate, customEndDate]);

  // Prepare trend data (monthly aggregation)
  const trendData = useMemo(() => {
    const { start, end } = getDateRange();
    const months = [];
    let current = startOfMonth(start);
    
    while (current <= end) {
      months.push({
        month: format(current, 'MMM yyyy'),
        date: current,
        ...expenseCategories.reduce((acc, cat) => ({ ...acc, [cat.value]: 0 }), {})
      });
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    filteredExpenses.forEach(expense => {
      const expenseMonth = startOfMonth(new Date(expense.date));
      const monthData = months.find(m => m.date.getTime() === expenseMonth.getTime());
      if (monthData && expense.category) {
        monthData[expense.category] = (monthData[expense.category] || 0) + (expense.amount || 0);
      }
    });

    return months;
  }, [filteredExpenses]);

  // Prepare category totals for pie chart
  const categoryTotals = useMemo(() => {
    const totals = expenseCategories.map(category => ({
      ...category,
      total: filteredExpenses
        .filter(expense => expense.category === category.value)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0)
    })).filter(category => category.total > 0);

    return totals;
  }, [filteredExpenses]);

  // Chart configurations
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      categories: trendData.map(item => item.month),
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' },
        formatter: (value) => `$${value.toFixed(0)}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    colors: expenseCategories.map(cat => cat.color)
  };

  const lineChartSeries = expenseCategories.map(category => ({
    name: category.label,
    data: trendData.map(item => item[category.value] || 0)
  })).filter(series => series.data.some(value => value > 0));

  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: 350
    },
    labels: categoryTotals.map(cat => cat.label),
    colors: categoryTotals.map(cat => cat.color),
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '45%'
        }
      }
    }
  };

  const pieChartSeries = categoryTotals.map(cat => cat.total);

  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    xaxis: {
      categories: trendData.map(item => item.month),
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' },
        formatter: (value) => `$${value.toFixed(0)}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    grid: {
      borderColor: '#E5E7EB'
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']
  };

  const barChartSeries = [{
    name: 'Total Expenses',
    data: trendData.map(item => 
      expenseCategories.reduce((sum, cat) => sum + (item[cat.value] || 0), 0)
    )
  }];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="BarChart3" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expense Data</h3>
          <p className="text-gray-600">Add some expenses to see spending trends and analytics.</p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Date Range Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Spending Analytics</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {dateRange === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends Line Chart */}
        <Card>
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 flex items-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-forest-600" />
              Spending Trends by Category
            </h4>
            <p className="text-sm text-gray-600">Track spending patterns over time</p>
          </div>
          {lineChartSeries.length > 0 ? (
            <Chart
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              height={350}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available for selected period
            </div>
          )}
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card>
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 flex items-center">
              <ApperIcon name="PieChart" className="w-5 h-5 mr-2 text-earth-600" />
              Category Breakdown
            </h4>
            <p className="text-sm text-gray-600">Expense distribution by category</p>
          </div>
          {categoryTotals.length > 0 ? (
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="donut"
              height={350}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available for selected period
            </div>
          )}
        </Card>

        {/* Monthly Comparison Bar Chart */}
        <Card>
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 flex items-center">
              <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-amber-600" />
              Monthly Comparison
            </h4>
            <p className="text-sm text-gray-600">Total expenses by month</p>
          </div>
          {trendData.some(item => expenseCategories.some(cat => item[cat.value] > 0)) ? (
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={350}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available for selected period
            </div>
          )}
        </Card>

        {/* Category Summary Card */}
        <Card>
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Target" className="w-5 h-5 mr-2 text-blue-600" />
              Category Summary
            </h4>
            <p className="text-sm text-gray-600">Top spending categories</p>
          </div>
          <div className="space-y-3">
            {categoryTotals
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((category, index) => (
                <div key={category.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-gray-900 text-sm">{category.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">${category.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">
                      {((category.total / categoryTotals.reduce((sum, cat) => sum + cat.total, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default ExpenseCharts;