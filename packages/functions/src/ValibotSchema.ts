import { endsWith, minLength, nonNullish, object, optional, required, string, safeParse, uuid, nullish } from "valibot";

const contentBaseSchema = string([minLength(3)]);
const attachmentBaseSchema = string([endsWith('.jpg', "Must be a JPG file")])

export const CreateNoteSchema = object({
    content: nonNullish(contentBaseSchema),
    attachment: nonNullish(attachmentBaseSchema)
});

export const QueryWithNoteIdSchema = object({
    id: string([uuid()])
})

export const UpdateNoteSchema = object({
    content: nonNullish(contentBaseSchema),
    attachment: nonNullish(attachmentBaseSchema)
})