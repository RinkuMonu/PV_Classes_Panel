
import {
  ShoppingCart,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
  MessageCircle,
  IndianRupee,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

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
  CartesianGrid,
} from "recharts";

import { ToastContainer, toast } from "react-toastify";

const cardsData = [
  { bgColor: "bg-teal-600", icon: ShoppingCart, title: "Total Orders", key: "orders", route: "/orders" },
  { bgColor: "bg-orange-400", icon: Users, title: "Total Users", key: "users", route: "/alluser" },
  { bgColor: "bg-blue-500", icon: BookOpen, title: "Total Courses", key: "courses", route: "/courses/courses" },
  { bgColor: "bg-cyan-700", icon: HelpCircle, title: "Total FAQ", key: "faqs", route: "/faq" },
  { bgColor: "bg-green-600", icon: FileText, title: "Total Test Series", key: "testSeries", route: "/test-series" },
  { bgColor: "bg-purple-600", icon: Layers, title: "Total Notes", key: "notes", route: "/notes" },
  { bgColor: "bg-pink-500", icon: MessageCircle, title: "Total Doubts", key: "doubts", route: "/doubt" },
];

const pieData = [
  { name: "Courses", value: 40 },
  { name: "Test Series", value: 35 },
  { name: "Notes", value: 25 },
];

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

export default function Dashboard({ user }) {

  const [counts, setCounts] = useState({});
  const [today, setToday] = useState({});
  const [revenue, setRevenue] = useState({});
  const [ordersChart, setOrdersChart] = useState([]);

  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_SERVER_URL;

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const res = await axios.get(`${url}/api/count`);

        const dashboard = res.data.dashboard;

        setCounts(dashboard.totals);
        setToday(dashboard.today);
        setRevenue(dashboard.revenue);
        setOrdersChart(dashboard.charts.orders);

      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchDashboardData();
  }, [url]);

  const salesData = ordersChart.map((item) => ({
    date: item._id,
    orders: item.orders,
  }));

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-gray-50 p-6">

        <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

        {/* TOTAL STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {cardsData.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className={`${card.bgColor} text-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer`}
            >
              <div className="flex justify-center mb-3">
                <card.icon className="h-6 w-6" />
              </div>

              <p className="text-xs uppercase text-center opacity-80">
                {card.title}
              </p>

              <h2 className="text-2xl font-bold text-center mt-2">
                {Number(counts?.[card.key] || 0).toLocaleString("en-IN")}
              </h2>
            </div>
          ))}

        </div>

        {/* TODAY + REVENUE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Today's Users</p>
            <h2 className="text-2xl font-bold text-blue-600 mt-1">
              {today.users || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Today's Orders</p>
            <h2 className="text-2xl font-bold text-green-600 mt-1">
              {today.orders || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-2">
            <IndianRupee className="text-purple-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h2 className="text-xl font-bold text-purple-600">
                ₹{Number(revenue.total || 0).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-2">
            <IndianRupee className="text-pink-500" />
            <div>
              <p className="text-gray-500 text-sm">Today's Revenue</p>
              <h2 className="text-xl font-bold text-pink-600">
                ₹{Number(revenue.today || 0).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-4">
              Last 7 Days Orders
            </h2>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={salesData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-4">
              Product Distribution
            </h2>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}