export function getPixelOffset(x: number, y: number, w: number) {
    return (x + y * w) * 4;
}

export function getPixel(data: ImageData, x: number, y: number): [number, number, number, number] {
    const offset = getPixelOffset(x, y, data.width);
    return [data.data[offset], data.data[offset + 1], data.data[offset + 2], data.data[offset + 3]];
}

export type Pixel = [number, number, number, number];

export function pixelAreSimilar(a: Pixel, b: Pixel, maxDistance: number): boolean {
    for (let i = 0; i < 4; i++) {
        if (colorDistance(a, b) > maxDistance) {
            return false;
        }
    }
    return true;
}

export function colorDistance(color1: Pixel, color2: Pixel): number {
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        sum += (color1[i] - color2[i]) ** 2;
    }
    return Math.sqrt(sum);
}

export function measureFromPosition(imageData: ImageData, x: number, y: number, maxDistance = 0): {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
} {
    return {
        bottom: getLastBottomSamePixel(imageData, x, y, maxDistance),
        height: getHeightAtPosition(imageData, x, y, maxDistance),
        left: getLastLeftSamePixel(imageData, x, y, maxDistance),
        right: getLastRightSamePixel(imageData, x, y, maxDistance),
        top: getLastTopSamePixel(imageData, x, y, maxDistance),
        width: getWidthAtPosition(imageData, x, y, maxDistance),
    };
}

function getLastTopSamePixel(imageData: ImageData, x: number, y: number, maxDistance: number) {
    const startPixel = getPixel(imageData, x, y);
    let yToCheck = y - 1;
    while (yToCheck != 0) {
        const currentPixel = getPixel(imageData, x, yToCheck);
        if (!pixelAreSimilar(currentPixel, startPixel, maxDistance)) {
            return yToCheck + 1;
        }
        yToCheck--;
    }
    return yToCheck;
}

function getLastBottomSamePixel(imageData: ImageData, x: number, y: number, maxDistance: number) {
    const startPixel = getPixel(imageData, x, y);
    let yToCheck = y + 1;
    while (yToCheck != 0) {
        const currentPixel = getPixel(imageData, x, yToCheck);
        if (!pixelAreSimilar(currentPixel, startPixel, maxDistance)) {
            return yToCheck - 1;
        }
        yToCheck++;
    }
    return yToCheck;
}

function getHeightAtPosition(imageData: ImageData, x: number, y: number, maxDistance: number): number {
    const top = getLastTopSamePixel(imageData, x, y, maxDistance);
    const bottom = getLastBottomSamePixel(imageData, x, y, maxDistance);
    return bottom - top + 1;
}

function getWidthAtPosition(imageData: ImageData, x: number, y: number, maxDistance: number): number {
    const left = getLastLeftSamePixel(imageData, x, y, maxDistance);
    const right = getLastRightSamePixel(imageData, x, y, maxDistance);
    return right - left + 1;
}

function getLastLeftSamePixel(imageData: ImageData, x: number, y: number, maxDistance: number): number {
    const startPixel = getPixel(imageData, x, y);
    let xToCheck = x - 1;
    while (xToCheck != 0) {
        const currentPixel = getPixel(imageData, xToCheck, y);
        if (!pixelAreSimilar(currentPixel, startPixel, maxDistance)) {
            return xToCheck + 1;
        }
        xToCheck--;
    }
    return xToCheck;
}

function getLastRightSamePixel(imageData: ImageData, x: number, y: number, maxDistance: number): number {
    const startPixel = getPixel(imageData, x, y);
    let xToCheck = x + 1;
    while (xToCheck != 0) {
        const currentPixel = getPixel(imageData, xToCheck, y);
        if (!pixelAreSimilar(currentPixel, startPixel, maxDistance)) {
            return xToCheck - 1;
        }
        xToCheck++;
    }
    return xToCheck;
}
