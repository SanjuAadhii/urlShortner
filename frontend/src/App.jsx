import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import AccountActivation from "./components/AccountActivation";
import UrlManager from "./components/UrlManager";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<UrlManager />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activate/:token" element={<AccountActivation />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset/:token" element={<NewPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
