import { useState, ChangeEvent, ChangeEventHandler } from "react";



export function useFormFields<T extends object>(
    initialState: T
): [T, ChangeEventHandler] {
    const [fields, setValues] = useState(initialState);

    return [
        fields,
        function (event: ChangeEvent<HTMLInputElement>) {
            setValues({
                ...fields,
                [event.target.id]: event.target.value,
            });
            return;
        },
    ];
}