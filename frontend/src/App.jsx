import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Signin from "./pages/Signin";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          {/* Nested routes for recruiter dashboard */}
          <Route path="/recruiter-dashboard/*" element={<RecruiterDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;