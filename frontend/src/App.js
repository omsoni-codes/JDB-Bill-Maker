import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BillMaker from "./pages/BillMaker";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BillMaker />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
