import { useMemo } from "react";
import { useNotes } from "./getNotes";

export function useNoteById(id: string) {
    const { data: notes, isLoading } = useNotes();
    return useMemo(() => {
        return {
            note: notes?.find(n => n.noteId === id),
            isLoading
        };
    }, [id, notes, isLoading])

}