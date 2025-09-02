// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Package,
//   Users,
//   ShoppingCart,
//   UserCog,
//   Settings,
//   Store,
//   LogOut,
//   ChevronDown,
// } from "lucide-react";

// const Sidebar = ({ isCollapsed }) => {
//   const location = useLocation();
//   const [isCatalogOpen, setCatalogOpen] = useState(false);

//   const toggleCatalog = () => {
//     setCatalogOpen(!isCatalogOpen);
//   };

//   // Check if current path matches or starts with the given path
//   const isActive = (path) => {
//     return location.pathname === path || location.pathname.startsWith(`${path}/`);
//   };

//   // Check if any catalog subitem is active
//   const isCatalogActive = () => {
//     return catalogSubItems.some(item => isActive(item.path));
//   };

//   const menuItems = [
//     { name: "Dashboard", Icon: Home, path: "/dashboard" },
//     { name: "Catalog", Icon: Package },
//     { name: "Customers", Icon: Users, path: "/customer" },
//     { name: "Orders", Icon: ShoppingCart, path: "/orders" },
//     // { name: "Our Staff", Icon: UserCog },
//     { name: "Settings", Icon: Settings , path: "/setting"},
//     // { name: "Online Store", Icon: Store },
//   ];

//   const catalogSubItems = [
//     { name: "Products", path: "/catalog/products" },
//     { name: "AllUser", path: "/catalog/products" },
//     { name: "Categories", path: "/catalog/categories" },
//     // { name: "Attributes", path: "/catalog/attributes" },
//     { name: "Coupons", path: "/catalog/coupons" },
//   ];

//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-6 text-green-600 text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
//         {isCollapsed ? 'A' : 'Admin'}
//       </div>

//       <nav className="flex-1 space-y-2 px-4 overflow-y-auto overflow-x-hidden">
//         {menuItems.map(({ name, Icon, path }) => (
//           <div key={name}>
//             {name === "Catalog" ? (
//               <>
//                 <div
//                   className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
//                     isCatalogActive() 
//                       ? 'bg-green-50 text-green-600' 
//                       : 'text-gray-700 hover:text-green-600'
//                   }`}
//                   onClick={toggleCatalog}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <Icon size={18} className="flex-shrink-0" />
//                     <span className={`transition-opacity duration-300 ${
//                       isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
//                     }`}>
//                       {name}
//                     </span>
//                   </div>
//                   {!isCollapsed && (
//                     <ChevronDown
//                       size={16}
//                       className={`transition-transform duration-200 ${
//                         isCatalogOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   )}
//                 </div>
                
//                 <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
//                   isCatalogOpen && !isCollapsed ? 'max-h-96' : 'max-h-0'
//                 }`}>
//                   <div className="ml-6 mt-1 space-y-1 text-sm">
//                     {catalogSubItems.map(({ name, path }) => (
//                       <Link
//                         to={path}
//                         key={name}
//                         className={`block py-1 transition-colors duration-200 ${
//                           isActive(path)
//                             ? 'text-green-600 font-medium'
//                             : 'text-gray-600 hover:text-green-600'
//                         }`}
//                       >
//                         – {name}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             ) : path ? (
//               <Link
//                 to={path}
//                 className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
//                   isActive(path)
//                     ? 'bg-green-50 text-green-600'
//                     : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
//                 }`}
//               >
//                 <Icon size={18} className="flex-shrink-0" />
//                 <span className={`ml-3 transition-opacity duration-300 ${
//                   isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
//                 }`}>
//                   {name}
//                 </span>
//               </Link>
//             ) : (
//               <div className="flex items-center p-2 rounded-md hover:bg-gray-100 
//                 text-gray-700 hover:text-green-600 cursor-pointer transition-colors duration-200">
//                 <Icon size={18} className="flex-shrink-0" />
//                 <span className={`ml-3 transition-opacity duration-300 ${
//                   isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
//                 }`}>
//                   {name}
//                 </span>
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

//       {/* <div className="p-4">
//         <Link to="/login" className={`w-full flex items-center justify-center px-4 py-2 
//           bg-green-500 hover:bg-green-600 text-white rounded transition-all duration-300
//           ${isCollapsed ? 'px-2' : 'px-4'}`}>
//           <LogOut size={18} className="flex-shrink-0" />
//           <span className={`ml-2 transition-opacity duration-300 ${
//             isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
//           }`}>
//             Log Out
//           </span>
//         </Link>
//       </div> */}
//     </div>
//   );
// };

// export default Sidebar;



//=====================================================================================



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
} from "lucide-react";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [isCoursesOpen, setCoursesOpen] = useState(false);
  const [isCatalogOpen, setCatalogOpen] = useState(false);

  const toggleCourses = () => {
    setCoursesOpen(!isCoursesOpen);
  };

  const toggleCatalog = () => {
    setCatalogOpen(!isCatalogOpen);
  };

  // Check if current path matches or starts with the given path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Check if any courses subitem is active
  const isCoursesActive = () => {
    return coursesSubItems.some(item => isActive(item.path));
  };

  // Check if any catalog subitem is active
  const isCatalogActive = () => {
    return catalogSubItems.some(item => isActive(item.path));
  };

  const menuItems = [
    { name: "Dashboard", Icon: Home, path: "/dashboard" },
    { name: "Courses", Icon: BookOpen },
    { name: "Test Series", Icon: FileText, path: "/test-series" },
    { name: "Notes", Icon: StickyNote, path: "/notes" },
    { name: "PYQs", Icon: Calendar, path: "/pyq" },
    { name: "FAQ", Icon: Calendar, path: "/faq" },
    { name: "Current Affairs", Icon: Calendar, path: "/affairs" },
    { name: "Users", Icon: Users, path: "/users" },
    { name: "Doubts", Icon: HelpCircle, path: "/doubts" },
    { name: "Notification", Icon: Bell, path: "/notification" },
    { name: "Orders", Icon: CreditCard, path: "/orders" },
  ];

  const coursesSubItems = [
    { name: "All Courses", path: "/courses/courses" },
    { name: "Categories", path: "/courses/categories" },
    { name: "Exam Types", path: "/courses/exam-types" },
    { name: "Exams", path: "/courses/exams" },
  ];

  const catalogSubItems = [
    { name: "Products", path: "/catalog/products" },
    { name: "Categories", path: "/catalog/categories" },
    { name: "Coupons", path: "/catalog/coupons" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 text-green-600 text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
        {isCollapsed ? 'A' : 'Admin'}
      </div>

      <nav className="flex-1 space-y-2 px-4 overflow-y-auto overflow-x-hidden">
        {menuItems.map(({ name, Icon, path }) => (
          <div key={name}>
            {name === "Courses" ? (
              <>
                <div
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                    isCoursesActive() 
                      ? 'bg-green-50 text-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                  onClick={toggleCourses}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className="flex-shrink-0" />
                    <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}>
                      {name}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isCoursesOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isCoursesOpen && !isCollapsed ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="ml-6 mt-1 space-y-1 text-sm">
                    {coursesSubItems.map(({ name, path }) => (
                      <Link
                        to={path}
                        key={name}
                        className={`block py-1 transition-colors duration-200 ${isActive(path)
                            ? 'text-green-600 font-medium'
                            : 'text-gray-600 hover:text-green-600'
                          }`}
                      >
                        – {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : path ? (
              <Link
                to={path}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 ${isActive(path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                  {name}
                </span>
              </Link>
            ) : (
              <div className="flex items-center p-2 rounded-md hover:bg-gray-100 
                text-gray-700 hover:text-green-600 cursor-pointer transition-colors duration-200">
                <Icon size={18} className="flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                  {name}
                </span>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;