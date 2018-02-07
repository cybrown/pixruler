export function getPixelOffset(x: number, y: number, w: number) {
    return (x + y * w) * 4;
}

export function getPixel(data: ImageData, x: number, y: number): [number, number, number, number] {
    const offset = getPixelOffset(x, y, data.width);
    return [data.data[offset], data.data[offset + 1], data.data[offset + 2], data.data[offset + 3]];
}

export type Pixel = [number, number, number, number];

export function pixelAreSimilar(a: Pixel, b: Pixel): boolean {
    for (let i = 0; i < 4; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

export function getLastTopSamePixel(imageData: ImageData, x: number, y: number) {
    const startPixel = getPixel(imageData, x, y);
    let yToCheck = y - 1;
    while (yToCheck != 0) {
        const currentPixel = getPixel(imageData, x, yToCheck);
        if (!pixelAreSimilar(currentPixel, startPixel)) {
            return yToCheck + 1;
        }
        yToCheck--;
    }
    return yToCheck;
}

export function getLastBottomSamePixel(imageData: ImageData, x: number, y: number) {
    const startPixel = getPixel(imageData, x, y);
    let yToCheck = y + 1;
    while (yToCheck != 0) {
        const currentPixel = getPixel(imageData, x, yToCheck);
        if (!pixelAreSimilar(currentPixel, startPixel)) {
            return yToCheck - 1;
        }
        yToCheck++;
    }
    return yToCheck;
}
