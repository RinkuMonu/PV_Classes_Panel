import {
  Car,
  CreditCard,
  Layers,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ToastContainer, toast } from 'react-toastify';

import RecentOrders from "../Pages/Orders/RecentOrders";

// Updated cards data structure
const cardsData = [
  {
    bgColor: "bg-teal-600",
    icon: ShoppingCart,
    title: "Total Orders",
    amount: "0",
    key: "totalOrders"
  },
  {
    bgColor: "bg-orange-400",
    icon: Users,
    title: "Total Users",
    amount: "0",
    key: "totalUsers"
  },
  {
    bgColor: "bg-blue-500",
    icon: BookOpen,
    title: "Total Courses",
    amount: "0",
    key: "totalCourses"
  },
  {
    bgColor: "bg-cyan-700",
    icon: HelpCircle,
    title: "Total FAQ",
    amount: "0",
    key: "totalFaq"
  },
  {
    bgColor: "bg-green-600",
    icon: FileText,
    title: "Total Test Series",
    amount: "0",
    key: "totalTestSeries"
  },
  {
    bgColor: "bg-purple-600",
    icon: Layers,
    title: "Total Notes",
    amount: "0",
    key: "totalNotes"
  },
  {
    bgColor: "bg-pink-500",
    icon: MessageCircle,
    title: "Total Doubts",
    amount: "0",
    key: "totalDoubts"
  },
];

// Sample data for the line chart
const salesData = [
  { date: "2025-07-14", sales: 800 },
  { date: "2025-07-15", sales: 1400 },
  { date: "2025-07-16", sales: 1200 },
];

// Sample data for the pie chart
const pieData = [
  { name: "Mini Lettuce", value: 35 },
  { name: "Organic Baby Carrot", value: 30 },
  { name: "Yellow Sweet Corn", value: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Dashboard({ user }) {
  const [data, setData] = useState({});
  const [recentData, setRecentData] = useState();
  const url = import.meta.env.VITE_API_SERVER_URL;

  useEffect(() => {
    if (user) {
      toast.success(`Welcome ${user}!`);
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await axios.get(`${url}/api/dashboard`);
        setData(dashboardData.data.data);
        setRecentData(dashboardData.data.data.recentOrders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [url]);

  const totalDelivery = (data.deliveredOrders?.[0]?.totalDeliverAmount) || 0;
  const totalPendingData = data.pendingOrders?.[0] || {};

  // Update card amounts based on API response
  const updatedCardsData = cardsData.map(card => ({
    ...card,
    amount: Number(data[card.key] || 0).toLocaleString("en-IN")
  }));

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
            {updatedCardsData.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex justify-center mb-4">
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-medium text-center uppercase tracking-wider opacity-80">
                  {card.title}
                </div>
                <div className="text-2xl font-bold text-center my-3">
                  {card.amount}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 w-full">
            {/* Total Orders */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5 ">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Total Orders
                </div>
                <div className="text-2xl font-bold text-gray-800">{Number(data.totalOrders || 0).toLocaleString("en-IN")}</div>
                <div className="text-xs text-gray-400 mt-1">All time</div>
              </div>
            </div>

            {/* Orders Pending */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Orders Pending
                </div>
                <div className="text-xs font-semibold text-red-500">
                  ₹{Number(totalPendingData.totalPendingAmount || 0).toLocaleString("en-IN")}
                </div>
                <div className="text-2xl font-bold text-gray-800">{totalPendingData?.totalPendingOrders || 0}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Awaiting confirmation
                </div>
              </div>
            </div>

            {/* Orders Processing */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-teal-50 text-teal-500">
                <Car className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Orders Processing
                </div>
                <div className="text-2xl font-bold text-gray-800">{data.processingOrderCount || 0}</div>
                <div className="text-xs text-gray-400 mt-1">In transit</div>
              </div>
            </div>

            {/* Orders Delivered */}
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5 ">
              <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-green-50 text-green-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Orders Delivered
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{Number(totalDelivery).toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-gray-400 mt-1">This month</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
            {/* Weekly Sales Line Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Weekly Sales</h2>
                <div className="text-sm text-gray-500">
                  <span className="mr-4">Sales</span>
                  <span>Orders</span>
                </div>
              </div>

              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 1600]}
                      ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600]}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#10B981"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Selling Products */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Best Selling Products</h2>
              <div className="flex flex-col items-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <RecentOrders recentData={recentData} />
        </div>
      </div>
    </>
  );
} 