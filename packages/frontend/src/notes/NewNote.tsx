import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../common/LoaderButton";
import { CONFIG } from "../config";
import "./NewNote.css"
import { post } from "aws-amplify/api";
import { CreateNote } from "../../../functions/src/ValibotSchema"
import { s3Upload } from "../lib/awsLib";
import { onError } from "../lib/error";

export function NewNote() {
    const file = useRef<null | File>(null);
    const nav = useNavigate();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.files === null) return
        file.current = event.currentTarget.files[0];
    }

    async function createNote(attachmentName: string) {
        const response = await post({
            apiName: "Api",
            path: "/notes",
            options: {
                body: {
                    attachment: attachmentName,
                    content
                } satisfies CreateNote
            }
        }).response;

        return response.statusCode;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (file.current && file.current.size > CONFIG.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${CONFIG.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
            );
            return;
        }

        setIsLoading(true);
        try {
            const attachment = file.current
                ? await s3Upload(file.current)
                : undefined;

            if (attachment) {

                await createNote(attachment);
            }
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }

    }

    return (
        <div className="NewNote">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="content">
                    <Form.Control
                        value={content}
                        as="textarea"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-2" controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <LoaderButton
                    size="lg"
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}