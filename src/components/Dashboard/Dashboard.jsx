import {
  ShoppingCart,
  Users,
  BookOpen,
  FileQuestionMark,
  FileText,
  Layers,
  MessageCircle,
  IndianRupee,
  ArrowUpRight,
  Activity,
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
import WelcomeOverlay from "./WelcomeOverlay";
const cardsData = [
  { iconBg: "bg-blue-50", iconColor: "text-blue-600", icon: ShoppingCart, title: "Total Successful Orders", key: "orders", route: "/orders" },
  { iconBg: "bg-green-50", iconColor: "text-green-600", icon: Users, title: "Total Users", key: "users", route: "/alluser" },
  { iconBg: "bg-violet-50", iconColor: "text-violet-600", icon: BookOpen, title: "Total Courses", key: "courses", route: "/courses/courses" },
  // UI-only: match the FAQ card icon with the FAQ sidebar entry and page header.
  { iconBg: "bg-orange-50", iconColor: "text-orange-500", icon: FileQuestionMark, title: "Total FAQ", key: "faqs", route: "/faq" },
  { iconBg: "bg-blue-50", iconColor: "text-blue-600", icon: FileText, title: "Total Test Series", key: "testSeries", route: "/test-series" },
  { iconBg: "bg-cyan-50", iconColor: "text-cyan-600", icon: Layers, title: "Total Notes", key: "notes", route: "/notes" },
  { iconBg: "bg-pink-50", iconColor: "text-pink-500", icon: MessageCircle, title: "Total Doubts", key: "doubts", route: "/doubt" },
];

const COLORS = ["#204972", "#87b105", "#f59e0b"];

export default function Dashboard({ user }) {
  // UI-only: show the welcome overlay once per browser tab/session.
  const [showWelcome, setShowWelcome] = useState(
    () => sessionStorage.getItem("pvWelcomeShown") !== "true"
  );
  const [counts, setCounts] = useState({});
  const [today, setToday] = useState({});
  const [revenue, setRevenue] = useState({});
  const [ordersChart, setOrdersChart] = useState([]);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_SERVER_URL;

  // UI-only: remember the first display and close the overlay automatically.
  useEffect(() => {
    if (!showWelcome) return undefined;

    sessionStorage.setItem("pvWelcomeShown", "true");
    const welcomeTimer = window.setTimeout(() => setShowWelcome(false), 5000);
    return () => window.clearTimeout(welcomeTimer);
  }, [showWelcome]);

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

  const salesData = ordersChart.map((item) => ({ date: item._id, orders: item.orders }));
  // Data-only UI correction: build the pie chart from the existing dashboard totals.
  const pieData = [
    { name: "Courses", value: Number(counts.courses || 0) },
    { name: "Test Series", value: Number(counts.testSeries || 0) },
    { name: "Notes", value: Number(counts.notes || 0) },
  ];
  const hasPieData = pieData.some((item) => item.value > 0);

  return (
    <>
      {/* UI-only: reusable overlay is connected through state and an onClose callback. */}
      <WelcomeOverlay
        isOpen={showWelcome}
        userName={user?.name}
        onClose={() => setShowWelcome(false)}
      />
      {/* UI-only redesign: data fetching, calculations, and navigation remain unchanged. */}
      <div className="min-h-screen bg-[#f5f7fb] p-2 sm:p-6">
        {/* UI-only: subtle accessible motion makes the overview banner feel more dynamic. */}
        {/* UI-only: Dashboard header intentionally displays its title without a page icon. */}
        <section className="dashboard-hero relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#204972] to-[#87b105] p-6 text-white shadow-lg sm:p-8">
          <div className="dashboard-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-sm" />
          <div className="dashboard-orb dashboard-orb-one absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="dashboard-orb dashboard-orb-two absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />
          <div className="dashboard-hero-content relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="dashboard-live mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Activity className="h-3.5 w-3.5" /> Live overview
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">Dashboard Overview</h1>
              <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">Track your platform performance, activity, and revenue in one place.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold">₹{Number(revenue.total || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </section>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cardsData.map((card) => (
            <div key={card.key} onClick={() => navigate(card.route)} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.10)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#204972] to-[#87b105] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}><card.icon className={`h-6 w-6 ${card.iconColor}`} /></div>
                <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#87b105]" />
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-none text-slate-900">{Number(counts?.[card.key] || 0).toLocaleString("en-IN")}</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat icon={Users} color="bg-blue-50 text-blue-600" label="Today's Users" value={today.users || 0} />
          <MiniStat icon={ShoppingCart} color="bg-emerald-50 text-emerald-600" label="Today's Orders" value={today.orders || 0} />
          <MiniStat icon={IndianRupee} color="bg-violet-50 text-violet-600" label="Total Revenue" value={`₹${Number(revenue.total || 0).toLocaleString("en-IN")}`} />
          <MiniStat icon={IndianRupee} color="bg-rose-50 text-rose-600" label="Today's Revenue" value={`₹${Number(revenue.today || 0).toLocaleString("en-IN")}`} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <PanelTitle title="Order Activity" subtitle="Orders received during the last 7 days" />
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} accessibilityLayer={false} style={{ outline: "none" }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(15,23,42,.08)" }} />
                  <Line type="monotone" dataKey="orders" stroke="#87b105" strokeWidth={3} dot={{ fill: "#87b105", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <PanelTitle title="Product Distribution" subtitle="Content mix across the platform" />
            <div className="h-[300px]">
              {hasPieData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart accessibilityLayer={false} style={{ outline: "none" }}>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={4} label stroke="none">
                      {pieData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="none" style={{ outline: "none" }} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No distribution data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MiniStat({ icon: Icon, color, label, value }) {
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div><div className="min-w-0"><p className="text-sm text-slate-500">{label}</p><h2 className="mt-0.5 truncate text-xl font-bold text-slate-900">{value}</h2></div></div>;
}

function PanelTitle({ title, subtitle }) {
  return <div className="mb-6"><h2 className="text-lg font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>;
}
