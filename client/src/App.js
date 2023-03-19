import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Join from "./components/Join";
import Chat from "./components/Chat";
import PrivateChat from "./components/PrivateChat";
import Navbar from "./components/Navbar";
import PrivateJoin from "./components/PrivateJoin";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/privateJoin" element={<PrivateJoin />} />
          <Route path="/privateChat" element={<PrivateChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
