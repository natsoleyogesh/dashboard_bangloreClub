import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Footer from "./components/common/Footer";
import {
  AddProduct,
  Customers,
  Products,
  Settings,
  SingleCustomer,
  SingleProduct,
} from "./pages";
import AddMember from "./pages/AddMember";
import AddFamilyMember from "./pages/AddFamilyMember";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";

import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import SingleEvent from "./pages/SingleEvent";
import AddCategory from "./pages/AddCategory";
import Categories from "./pages/Categories";
import SingleCategory from "./pages/SingleCategory";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import SingleRoom from "./pages/SingleRoom";
import EditRoom from "./pages/EditRoom";
import Offers from "./pages/Offers";
import SingleOffer from "./pages/SingleOffer";
import AddOffer from "./pages/AddOffer";
import GetKeeparScanner from "./pages/GetKeeparScanner";
import ClubHods from "./pages/ClubHods";
import SingleHod from "./pages/SingleHod";
import AddHod from "./pages/AddHod";
import Downloads from "./pages/Downloads";
import AddDownload from "./pages/AddDownload";
import SingleDownload from "./pages/SingleDownload";
import ClubNotices from "./pages/ClubNotices";
import SingleNotice from "./pages/SingleNotice";
import AddNotice from "./pages/AddNotice";
import AddGCM from "./pages/AddGCM";
import SingleGCM from "./pages/SingleGCM";
import GCMs from "./pages/GCMs";
import Rules from "./pages/Rules";
import ByeLaws from "./pages/ByeLaws";
import SingleRuleByeLaw from "./pages/SingleRuleByeLaw";
import AddRuleByeLaw from "./pages/AddRuleByeLaw";
import FAQs from "./pages/FAQs";
import SingleFAQ from "./pages/SingleFAQ";
import AddFAQ from "./pages/AddFAQ";
import COMs from "./pages/COMs";
import SingleCOM from "./pages/SingleCOM";
import AddCOM from "./pages/AddCOM";
import FoodAndBeverages from "./pages/FoodAndBeverages";
import SingleFoodAndBeverage from "./pages/SingleFoodAndBeverage";
import AddFoodAndBeverage from "./pages/AddFoodAndBeverage";

const sideBarWidth = 250;

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";
  // Retrieve the user role from localStorage or sessionStorage
  const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");
  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer />
      {/* Conditionally render Navbar and Sidebar */}
      {!isLoginPage && (
        <>
          <Navbar
            sideBarWidth={sideBarWidth}
            handleDrawerToggle={handleDrawerToggle}
          />
          {/* <Sidebar
            sideBarWidth={sideBarWidth}
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          /> */}
          {userRole !== "gatekeeper" && (
            <Sidebar
              sideBarWidth={sideBarWidth}
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 1, md: 2 },
          width: { xs: "100%", md: `calc(100% - ${sideBarWidth}px)` },
        }}
      >
        {/* Routes */}
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gatekeeper/qrScanner"
            element={
              <ProtectedRoute>
                <GetKeeparScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <SingleProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <SingleCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/add"
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/:parentUserId/add-family-member"
            element={
              <ProtectedRoute>
                <AddFamilyMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/add"
            element={
              <ProtectedRoute>
                <AddEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <SingleEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id"
            element={
              <ProtectedRoute>
                <SingleCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/add"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <ProtectedRoute>
                < SingleRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/add"
            element={
              <ProtectedRoute>
                <AddRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room/edit/:id"
            element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            }
          />

          {/* Offers Route */}
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer/:id"
            element={
              <ProtectedRoute>
                < SingleOffer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer/add"
            element={
              <ProtectedRoute>
                <AddOffer />
              </ProtectedRoute>
            }
          />

          {/* HOD Route */}
          <Route
            path="/hods"
            element={
              <ProtectedRoute>
                <ClubHods />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/:id"
            element={
              <ProtectedRoute>
                < SingleHod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/add"
            element={
              <ProtectedRoute>
                <AddHod />
              </ProtectedRoute>
            }
          />

          {/* Downloads Route */}
          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Downloads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download/:id"
            element={
              <ProtectedRoute>
                < SingleDownload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download/add"
            element={
              <ProtectedRoute>
                <AddDownload />
              </ProtectedRoute>
            }
          />

          {/* Notice Route */}
          <Route
            path="/notices"
            element={
              <ProtectedRoute>
                <ClubNotices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notice/:id"
            element={
              <ProtectedRoute>
                < SingleNotice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notice/add"
            element={
              <ProtectedRoute>
                <AddNotice />
              </ProtectedRoute>
            }
          />

          {/* GCM Route */}
          <Route
            path="/gcms"
            element={
              <ProtectedRoute>
                <GCMs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gcm/:id"
            element={
              <ProtectedRoute>
                < SingleGCM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gcm/add"
            element={
              <ProtectedRoute>
                <AddGCM />
              </ProtectedRoute>
            }
          />

          {/* RULE BYE LAWS Route */}
          <Route
            path="/rules"
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/byeLaws"
            element={
              <ProtectedRoute>
                <ByeLaws />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ruleByeLaw/:id"
            element={
              <ProtectedRoute>
                < SingleRuleByeLaw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ruleByeLaw/add"
            element={
              <ProtectedRoute>
                <AddRuleByeLaw />
              </ProtectedRoute>
            }
          />

          {/* FAQ Route */}
          <Route
            path="/faqs"
            element={
              <ProtectedRoute>
                <FAQs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq/:id"
            element={
              <ProtectedRoute>
                < SingleFAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq/add"
            element={
              <ProtectedRoute>
                <AddFAQ />
              </ProtectedRoute>
            }
          />

          {/* Consideration Of Membership Route */}
          <Route
            path="/coms"
            element={
              <ProtectedRoute>
                <COMs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/com/:id"
            element={
              <ProtectedRoute>
                < SingleCOM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/com/add"
            element={
              <ProtectedRoute>
                <AddCOM />
              </ProtectedRoute>
            }
          />

          {/*FoodAndBeverages Route */}
          <Route
            path="/foodAndBeverages"
            element={
              <ProtectedRoute>
                <FoodAndBeverages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foodAndBeverage/:id"
            element={
              <ProtectedRoute>
                < SingleFoodAndBeverage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foodAndBeverage/add"
            element={
              <ProtectedRoute>
                <AddFoodAndBeverage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
        {/* Conditionally render Footer */}
        {!isLoginPage && <Footer />}
      </Box>
    </Box>
  );
}

export default App;

