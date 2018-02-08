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

export function getHeightAtPosition(imageData: ImageData, x: number, y: number): number {
    const top = getLastTopSamePixel(imageData, x, y);
    const bottom = getLastBottomSamePixel(imageData, x, y);
    return bottom - top + 1;
}

export function getWidthAtPosition(imageData: ImageData, x: number, y: number): number {
    const left = getLastLeftSamePixel(imageData, x, y);
    const right = getLastRightSamePixel(imageData, x, y);
    return right - left + 1;
}

export function getLastLeftSamePixel(imageData: ImageData, x: number, y: number): number {
    const startPixel = getPixel(imageData, x, y);
    let xToCheck = x - 1;
    while (xToCheck != 0) {
        const currentPixel = getPixel(imageData, xToCheck, y);
        if (!pixelAreSimilar(currentPixel, startPixel)) {
            return xToCheck + 1;
        }
        xToCheck--;
    }
    return xToCheck;
}

export function getLastRightSamePixel(imageData: ImageData, x: number, y: number): number {
    const startPixel = getPixel(imageData, x, y);
    let xToCheck = x + 1;
    while (xToCheck != 0) {
        const currentPixel = getPixel(imageData, xToCheck, y);
        if (!pixelAreSimilar(currentPixel, startPixel)) {
            return xToCheck - 1;
        }
        xToCheck++;
    }
    return xToCheck;
}

export function colorDistance(color1: Pixel, color2: Pixel): number {
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        sum += (color1[i] - color2[i]) ** 2;
    }
    return Math.sqrt(sum);
}
