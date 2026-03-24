
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BookOpen,
  FileText,
  StickyNote,
  Calendar,
  User,
  HelpCircle,
  Bell,
  CreditCard,
  ChevronDown,
  Tag,
  Bookmark,
  Star,
  MessageSquare,
  Image,
  Phone,
  ClipboardList,
  ClipboardListIcon,
} from "lucide-react";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [isCoursesOpen, setCoursesOpen] = useState(false);

  const toggleCourses = () => {
    setCoursesOpen(!isCoursesOpen);
  };

  const [isBooksOpen, setBooksOpen] = useState(false);

  const toggleBooks = () => {
    setBooksOpen(!isBooksOpen);
  };

  const isBooksActive = () => {
    return booksSubItems.some(item => isActive(item.path));
  };


  // Check if current path matches or starts with the given path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Check if any courses subitem is active
  const isCoursesActive = () => {
    return coursesSubItems.some(item => isActive(item.path));
  };


  const menuItems = [
    { name: "Dashboard", Icon: Home, path: "/dashboard" },
    { name: "Courses", Icon: BookOpen },
    { name: "Books", Icon: Bookmark },   // ✅ ADD

    { name: "Offline Event", Icon: ClipboardListIcon, path: "/offline-event" },
    { name: "Notes", Icon: StickyNote, path: "/notes" },
    { name: "PYQs", Icon: Calendar, path: "/pyq" },
    { name: "Users", Icon: Users, path: "/alluser" },
    { name: "Test Series", Icon: FileText, path: "/test-series" },
    { name: "Current Affairs", Icon: ClipboardList, path: "/affairs" },
    { name: "Home Page FAQ", Icon: HelpCircle, path: "/faq" },
    { name: "Doubts", Icon: HelpCircle, path: "/doubt" },
    { name: "Notification", Icon: Bell, path: "/notification" },
    { name: "Orders", Icon: ShoppingCart, path: "/orders" },
    { name: "Banner", Icon: Image, path: "/banner" },
    { name: "Contact", Icon: Phone, path: "/contact" },
    { name: "Review", Icon: Star, path: "/review" },
    { name: "Coupon", Icon: Tag, path: "/couponmanager" },
  ];

  const coursesSubItems = [
    { name: "All Courses", path: "/courses/courses" },
    { name: "Categories", path: "/courses/categories" },
    { name: "Exam Types", path: "/courses/exam-types" },
    { name: "Exams", path: "/courses/exams" },
    { name: "Combo", path: "/courses/compo" },
    { name: "Faculty", path: "/courses/faculty" },
  ];

  const booksSubItems = [
    { name: "Book Categories", path: "/books/categories" },
    { name: "Book Subcategories", path: "/books/subcategories" },
    { name: "Books", path: "/books/books" },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-6 flex items-center justify-center">
        <img
          src="Images/pv-logo.png"   // should be inside the public/ folder
          alt="PV Classes Logo"
          className="h-20 w-auto"   // height 10 (40px), width auto to keep aspect ratio
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map(({ Icon, name, path }) => (
          <div key={name}>

            {/* COURSES DROPDOWN */}
            {name === "Courses" ? (
              <>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${isCoursesActive()
                    ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                    : "text-gray-700 hover:text-green-600"
                    }`}
                  onClick={toggleCourses}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span className={`${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                      {name}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isCoursesOpen ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </div>

                <div
                  className={`overflow-hidden transition-all ${isCoursesOpen && !isCollapsed ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <div className="ml-7 mt-1 space-y-1 text-sm">
                    {coursesSubItems.map(({ name, path }) => (
                      <Link
                        key={name}
                        to={path}
                        className={`block py-2 px-3 rounded-md ${isActive(path)
                          ? "text-green-600 bg-green-50"
                          : "text-gray-600 hover:text-green-600"
                          }`}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : name === "Books" ? (

              /* 📚 BOOKS DROPDOWN */
              <>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${isBooksActive()
                    ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                    : "text-gray-700 hover:text-green-600"
                    }`}
                  onClick={toggleBooks}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span className={`${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                      {name}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isBooksOpen ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </div>

                <div
                  className={`overflow-hidden transition-all ${isBooksOpen && !isCollapsed ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <div className="ml-7 mt-1 space-y-1 text-sm">
                    {booksSubItems.map(({ name, path }) => (
                      <Link
                        key={name}
                        to={path}
                        className={`block py-2 px-3 rounded-md ${isActive(path)
                          ? "text-green-600 bg-green-50"
                          : "text-gray-600 hover:text-green-600"
                          }`}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : path ? (

              /* NORMAL MENU ITEM */
              <Link
                to={path}
                className={`flex items-center p-3 rounded-lg ${isActive(path)
                  ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                  }`}
              >
                <Icon size={18} />
                <span className={`ml-3 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                  {name}
                </span>
              </Link>

            ) : null}

          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;