import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { signIn } from 'aws-amplify/auth';

import "./Login.css";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { onError } from "../lib/error";
import { useFormFields } from "../lib/formField";
import LoaderButton from "../common/LoaderButton";

export function Login() {


    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const authContext = useContext(AuthContext);

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        try {
            const signInResult = await signIn({
                username: fields.email,
                password: fields.password
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
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            value={fields.password}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <LoaderButton isLoading={isLoading} size="lg" type="submit" disabled={!validateForm()}>
                        Login
                    </LoaderButton>
                </Stack>
            </Form>
        </div>
    );
}