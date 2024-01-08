import { uploadData } from "aws-amplify/storage";

export async function s3Upload(file: File) {
    const fileNameWithTimestam = `${Date.now()}-${file.name}`;
    const stored = uploadData({
        data: file,
        key: fileNameWithTimestam,
        options: {
            accessLevel: 'private'
        }

    });
    const transferResult = await stored.result;
    return transferResult.key;
}