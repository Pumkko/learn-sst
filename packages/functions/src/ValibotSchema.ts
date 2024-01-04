import { endsWith, minLength, nonNullish, object, optional, required, string, safeParse} from "valibot";

export const CreateNoteSchema = object({
    content:  nonNullish(string([minLength(3)])),
    attachment: string([endsWith('.jpg', "Must be a JPG file")])
});