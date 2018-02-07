export function loadSampleImageData() {
    let img: HTMLImageElement;
    return new Promise((resolve, reject) => {
        img = document.createElement('img');
        img.src = require('../test-samples/img1.png');
        img.addEventListener('load', resolve);
        img.addEventListener('error', reject);
    }).then(() => {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        if (ctx == null) {
            throw new Error('context is null');
        }
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    });
}
