import { useParams } from "react-router-dom";
import { UpdateNote } from "./UpdateNote";
import { useNoteById } from "../lib/getNoteById";

export function Note() {
    const { id } = useParams();

    const {isLoading, note} = useNoteById(id ?? "");

    if(isLoading){
        return <div>Loading</div>;
    }

    if(!note){
        return <div>Could not find Note</div>
    }

    return <UpdateNote note={note} />
}