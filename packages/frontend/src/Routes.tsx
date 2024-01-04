import { Routes, Route } from "react-router-dom";
import { Home } from "./container/Home";

export function RouterOutlet() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}