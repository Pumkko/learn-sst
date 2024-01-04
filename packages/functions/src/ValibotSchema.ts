import { endsWith, minLength, nonNullish, object, optional, required, string, safeParse, uuid } from "valibot";

export const CreateNoteSchema = object({
    content: nonNullish(string([minLength(3)])),
    attachment: string([endsWith('.jpg', "Must be a JPG file")])
});

export const GetNoteSchema = object({
    id: string([uuid()])
})