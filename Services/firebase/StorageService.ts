import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getFirebaseStorage } from '../../config/firebase'

// Uploads local image URIs to Firebase Storage and returns their download URLs.
export const uploadMedia = async (selectedImages: string[]): Promise<string[]> => {
    try {
        const timestamp = new Date().getTime();
        return await Promise.all(selectedImages.map(async (image, i) => {
            const blob = await new Promise<Blob>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', image, true);
                xhr.send(null);
            });

            const imageRef = ref(getFirebaseStorage(), `pictures/img-${timestamp}-${i}`);
            await uploadBytes(imageRef, blob);
            return getDownloadURL(imageRef);
        }));
    } catch (error) {
        throw new Error('Error uploading images: ' + error.message);
    }
};
