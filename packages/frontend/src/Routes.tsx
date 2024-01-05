import { Routes, Route } from "react-router-dom";
import { Home } from "./home/Home";
import { NotFound } from "./notFound/NotFound";
import { Login } from "./signIn/Login";
import Signup from "./signUp/SignUp";

export function RouterOutlet() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />} />
        </Routes>
    )
}