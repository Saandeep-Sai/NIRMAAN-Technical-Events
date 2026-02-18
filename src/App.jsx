import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CodingDebugger from "./pages/CodingDebugger";
import WebsiteDesign from "./pages/WebsiteDesign";
import BlindCode from "./pages/BlindCode";
import Admin from "./pages/Admin";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coding-debugger" element={<CodingDebugger />} />
            <Route path="/website-design" element={<WebsiteDesign />} />
            <Route path="/blind-code" element={<BlindCode />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
}
