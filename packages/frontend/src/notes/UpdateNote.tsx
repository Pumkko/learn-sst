import { useRef, useState } from "react";
import { Form, Stack } from "react-bootstrap";
import { NoteType } from "../../../core/src/ValibotNoteSchema"
import LoaderButton from "../common/LoaderButton";
import { CONFIG } from "../config";
import "./UpdateNote.css";

interface UpdateNoteProps {
    note: NoteType
}

export function UpdateNote(props: UpdateNoteProps) {

    const file = useRef<null | File>(null)
    const [content, setContent] = useState(props.note.content);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    function formatFilename(str: string) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.files === null) return;
        file.current = event.currentTarget.files[0];
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
    }

    async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
    }


    return <div className="Notes">
        <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
                <Form.Group controlId="content">
                    <Form.Control
                        size="lg"
                        as="textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-2" controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    {props.note.attachment && (
                        <p>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={props.note.attachment}
                            >
                                {formatFilename(props.note.attachment)}
                            </a>
                        </p>
                    )}
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <Stack gap={1}>
                    <LoaderButton
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Save
                    </LoaderButton>
                    <LoaderButton
                        size="lg"
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </LoaderButton>
                </Stack>
            </Stack>
        </Form>
    </div>
}