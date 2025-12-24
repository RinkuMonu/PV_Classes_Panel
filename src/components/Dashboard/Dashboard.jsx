import {
  ShoppingCart,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";

import RecentOrders from "../Pages/Orders/RecentOrders";

// Cards config
const cardsData = [
  { bgColor: "bg-teal-600", icon: ShoppingCart, title: "Total Orders", key: "totalOrders" },
  { bgColor: "bg-orange-400", icon: Users, title: "Total Users", key: "totalUsers" },
  { bgColor: "bg-blue-500", icon: BookOpen, title: "Total Courses", key: "totalCourses" },
  { bgColor: "bg-cyan-700", icon: HelpCircle, title: "Total FAQ", key: "totalFaq" },
  { bgColor: "bg-green-600", icon: FileText, title: "Total Test Series", key: "totalTestSeries" },
  { bgColor: "bg-purple-600", icon: Layers, title: "Total Notes", key: "totalNotes" },
  { bgColor: "bg-pink-500", icon: MessageCircle, title: "Total Doubts", key: "totalDoubts" },
];

// API → frontend key mapping
const keyMapping = {
  totalOrders: "orders",
  totalUsers: "users",
  totalCourses: "courses",
  totalFaq: "faqs",
  totalTestSeries: "testSeries",
  totalNotes: "notes",
  totalDoubts: "doubts",
};

// Sample chart data (replace with API later if needed)
const salesData = [
  { date: "2025-07-14", sales: 800 },
  { date: "2025-07-15", sales: 1400 },
  { date: "2025-07-16", sales: 1200 },
];

const pieData = [
  { name: "Mini Lettuce", value: 35 },
  { name: "Organic Baby Carrot", value: 30 },
  { name: "Yellow Sweet Corn", value: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Dashboard({ user }) {
  const [counts, setCounts] = useState({});
  const [_recentData, setRecentData] = useState([]);
  const url = import.meta.env.VITE_API_SERVER_URL;

  useEffect(() => {
    if (user) {
    toast.success(`Welcome back, ${user.name}!`);
    }
  }, [user]);

  console.log("Dashboard user:", user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${url}/api/count`);
        const apiCounts = res.data?.counts || {};
        setCounts(apiCounts); 

        // ⚡ if backend later adds recentOrders inside count response
        setRecentData(res.data?.recentOrders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [url]);

  // Map API counts into card data
  const updatedCardsData = cardsData.map((card) => ({
    ...card,
    amount: Number(counts?.[keyMapping[card.key]] || 0).toLocaleString("en-IN"),
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

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
            {/* Weekly Sales Line Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Weekly Sales</h2>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
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

          {/* Recent Orders */}
          {/* <RecentOrders recentData={recentData} /> */}
        </div>
      </div>
    </>
  );
}
