import { Routes, Route } from "react-router-dom";
import { Home } from "./container/Home";
import { NotFound } from "./NotFound";

export function RouterOutlet() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />;
        </Routes>
    )
}