import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { signIn } from 'aws-amplify/auth';

import "./Login.css";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { BsArrowRepeat } from "react-icons/bs";
import { onError } from "../lib/error";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const authContext = useContext(AuthContext);

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        try {
            const signInResult = await signIn({
                username: email,
                password
            });
            console.log(signInResult);
            authContext.setIsAuthenticated(signInResult.isSignedIn);
            nav("/");
        } catch (error) {
            onError(error);
        }

        setIsLoading(false);
    }



    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Stack gap={3}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            size="lg"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button size="lg" className="LoaderButton" type="submit" disabled={!validateForm()}>
                        {isLoading && <BsArrowRepeat className="spinning" />}
                        Login
                    </Button>
                </Stack>
            </Form>
        </div>
    );
}