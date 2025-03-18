import { firebase } from '../config/firebase'

const uploadMedia = async (selectedImages) => {
    try {
        const downloadURLs = [];
        const promises = [];

        for (let i = 0; i < selectedImages.length; i++) {
            const image = selectedImages[i];
            const blob = await new Promise((resolve, reject) => {
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

            const ref = firebase.storage().ref().child(`pictures/img-${new Date().getTime()}-${i}`);
            const snapshot = ref.put(blob);

            const promise = new Promise((resolve, reject) => {
                snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    () => {
                        // Handle upload progress if needed
                    },
                    (error) => {
                        // Handle upload error
                        reject(error);
                    },
                    () => {
                        // Handle successful upload
                        snapshot.snapshot.ref.getDownloadURL().then((url) => {
                            downloadURLs.push(url);
                            resolve();
                        });
                    }
                );
            });
            promises.push(promise);
        }

        await Promise.all(promises);
        return downloadURLs;

    } catch (error) {
        throw new Error('Error uploading images: ' + error.message);
    }
};


export default uploadMedia;
