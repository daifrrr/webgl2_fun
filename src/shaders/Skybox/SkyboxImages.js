let skybox = require.context('./Images', true);

export const sk_images = {
    name: 'SkyboxImages',
    files: []
};

skybox.keys().forEach((file) => {
    let image = new Image();
    image.src = file;
    sk_images.files.push(image);
});