import { Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tree from "./pages/Tree";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tree/:name" element={<Tree />} />
        </Routes>
      </Router>
    </Stack>
  );
}

export default App;