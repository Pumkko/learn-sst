import { Routes, Route } from "react-router-dom";
import { Home } from "./container/Home";
import { NotFound } from "./notFound/NotFound";
import { Login } from "./container/Login";

export function RouterOutlet() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />}/>
        </Routes>
    )
}