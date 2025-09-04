import { Route, Routes, Outlet } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Layouts/Sidebar';
import Header from './components/Layouts/Header';
import Customer from './components/Pages/customers/Customer';
import Orders from './components/Pages/Orders/Orders';
import Product from './components/Pages/Products/Product';
import Category from './components/Pages/category/Category';
import Attribute from './components/Pages/Attribute/Attribute';
import Coupon from './components/Pages/Couponcode/Coupon';
import ProductDetails from './components/Pages/Products/ProductDetails';
import Invoice from './components/Pages/Orders/Invoice';
import SettingsPage from './components/Pages/Setting/SettingsPage';
import ProfileForm from './components/Pages/Profile/ProfileForm';
import ForgotPassword from './components/Pages/ForgotPassword';
import CreateAccount from './components/Pages/CreateAccount';
import AttributesValues from './components/Pages/Attribute/AttributesValues';
// import Notifications from './components/Pages/Notification/Notifications';
import ViewCategory from './components/Pages/category/ViewCategory';
import CustomerOrderList from './components/Pages/customers/CustomerOrderList';
import AllUser from './components/Pages/Alluser/AllUser';
import Notes from './components/Pages/Notes/Notes';
import Pyq from './components/Pages/PYQ/pyq';
import FAQ from './components/Pages/FAQ/faq';
// import Notifications from './components/Pages/Notifications/notifications';
import CurrentAffairsAdmin from './components/Pages/CurrentAffairs/currentaffairs';

import CourceCategory from './components/Pages/courses/CourceCategory';
import ExamType from './components/Pages/courses/ExamType';
import Exam from './components/Pages/courses/Exam';
import Course from './components/Pages/courses/Course';
import Compo from './components/Pages/courses/Compo';
import Faculty from './components/Pages/courses/Faculty';
import DoubtsTable from './components/Pages/Doubts/Doubt';
import TestSeriesDashboard from './components/Pages/TestSeries/TestSeriesDashboard';
import Banner from './components/Pages/Banner/Banner';
import Notifications from './components/Pages/Notification/Notifications';
import Review from './components/Pages/Review/Reviews';
import Contact from './components/Pages/Contactus/Contact';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className={`h-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-white shadow">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null)

  return (
    <>
          <ToastContainer position="top-right" autoClose={3000} />

    <Routes>
      
      <Route path="/" element={<PublicRoute><Login setUser={setUser}/></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login setUser={setUser}/></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><CreateAccount /></PublicRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard user={user}/>} />

        <Route path="/courses/categories" element={<CourceCategory />} />
        <Route path="/courses/exam-types" element={<ExamType />} />
        <Route path="/courses/exams" element={<Exam />} />
        <Route path="/courses/courses" element={<Course />} />
        <Route path="/courses/compo" element={<Compo />} />
        <Route path="/courses/faculty" element={<Faculty />} />

        <Route path="/customer" element={<Customer />} />
        <Route path="/alluser" element={<AllUser />} />
        <Route path="/customer/:id" element={<CustomerOrderList />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/catalog/products" element={<Product />} />
        <Route path="/catalog/products/:id" element={<ProductDetails />} />
        <Route path="/catalog/categories" element={<Category />} />
        <Route path="/catalog/categories/:id" element={<ViewCategory />} />
        <Route path="/catalog/attributes" element={<Attribute />} />
        <Route path="/catalog/attributes/:id" element={<AttributesValues />} />
        <Route path="/catalog/coupons" element={<Coupon />} />
        <Route path="/invoice/:orderId" element={<Invoice />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route path="/edit-profile" element={<ProfileForm />} />
        <Route path="/notification" element={<Notifications/>} />
        <Route path="/notes" element={<Notes/>} />
        <Route path="/pyq" element={<Pyq/>} />
        <Route path="/faq" element={<FAQ/>} />
        <Route path="/affairs" element={<CurrentAffairsAdmin/>} />
        <Route path="/doubt" element={<DoubtsTable/>} />
        <Route path="/test-series" element={<TestSeriesDashboard/>} />
        <Route path="/banner" element={<Banner/>} />
        <Route path="/review" element={<Review/>} />
        <Route path="/contact" element={<Contact/>} />
        
      </Route>
    </Routes>

        </>

  );
}

export default App;