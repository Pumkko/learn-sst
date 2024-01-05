import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useFormFields } from "../lib/formField";
import { AuthContext } from "../AuthContext";
import LoaderButton from "../common/LoaderButton";
import { SignUpOutput, confirmSignUp, signIn, signUp } from "aws-amplify/auth";
import { onError } from "../lib/error";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });

    const nav = useNavigate();
    const authContext = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState<null | SignUpOutput>(null);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUserOutput = await signUp({
                username: fields.email,
                password: fields.password
            });
            setNewUser(newUserOutput);
        } catch (error) {
            onError(error);
        }

        setIsLoading(false);
    }

    async function handleConfirmationSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setIsLoading(true);
        try {
            await confirmSignUp({
                username: fields.email,
                confirmationCode: fields.confirmationCode
            });
            await signIn({
                username: fields.email,
                password: fields.password
            });
            authContext.setIsAuthenticated(true);
            nav("/");
        } catch (e) {
            onError(e);
        }
        setIsLoading(false);
    }

    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Stack gap={3}>
                    <Form.Group controlId="confirmationCode">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control
                            size="lg"
                            autoFocus
                            type="tel"
                            onChange={handleFieldChange}
                            value={fields.confirmationCode}
                        />
                        <Form.Text muted>Please check your email for the code.</Form.Text>
                    </Form.Group>
                    <LoaderButton
                        size="lg"
                        type="submit"
                        variant="success"
                        isLoading={isLoading}
                        disabled={!validateConfirmationForm()}
                    >
                        Verify
                    </LoaderButton>
                </Stack>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Stack gap={3}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            size="lg"
                            autoFocus
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
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            onChange={handleFieldChange}
                            value={fields.confirmPassword}
                        />
                    </Form.Group>
                    <LoaderButton
                        size="lg"
                        type="submit"
                        variant="success"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Signup
                    </LoaderButton>
                </Stack>
            </Form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}