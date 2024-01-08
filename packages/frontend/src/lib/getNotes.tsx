
import {
    useQuery,
} from '@tanstack/react-query'
import { get } from 'aws-amplify/api'
import { safeParse } from 'valibot';

import { NoteArraySchema } from '../../../core/src/ValibotNoteSchema'

export function useNotes() {
    return useQuery({
        queryKey: ["notes"],
        queryFn: async () => {
            const response = await get({
                apiName: "notes",
                path: "/notes",
            }).response;

            const json = await response.body.text();
            const o = JSON.parse(json);

            const safeParseResult = safeParse(NoteArraySchema, o);

            if (!safeParseResult.success) {
                console.error(safeParseResult.issues);
                throw safeParseResult.issues;
            };

            return safeParseResult.output;
        }
    })
}