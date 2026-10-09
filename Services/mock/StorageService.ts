// Nothing is uploaded: the local URIs are returned as-is, so mocked photos only display on this device.
export const uploadMedia = async (selectedImages: string[]): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...selectedImages];
};
