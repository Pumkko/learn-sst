import { endsWith, minLength, nonNullish, object, optional, required, string, safeParse, uuid, nullish, Input, number, array } from "valibot";

const contentBaseSchema = string([minLength(3)]);
const attachmentBaseSchema = string([endsWith('.jpg', "Must be a JPG file")])

export const CreateNoteSchema = object({
    content: nonNullish(contentBaseSchema),
    attachment: nonNullish(attachmentBaseSchema)
});

export type CreateNote = Input<typeof CreateNoteSchema>;

export const QueryWithNoteIdSchema = object({
    id: string([uuid()])
})

export const UpdateNoteSchema = object({
    content: nonNullish(contentBaseSchema),
    attachment: nonNullish(attachmentBaseSchema)
})


export const NoteSchema =
    object({
        content: nonNullish(contentBaseSchema),
        attachment: nonNullish(attachmentBaseSchema),
        createdAt: number(),
        noteId: string([uuid()]),
        userId: string()
    });

export const NoteArraySchema = array(NoteSchema)

export type NoteArrayType = Input<typeof NoteArraySchema>
export type NoteType = Input<typeof NoteSchema>