import { Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tree from "./pages/Tree";
import EditTree from "./pages/Edit";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";
  
function App() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/tree/:name" element={<Tree />} />
          <Route path="/edit/:name" element={<EditTree />} />
        </Routes>
      </Router>
    </Stack>
  );
}

export default App;
