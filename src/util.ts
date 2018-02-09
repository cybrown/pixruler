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
        bottom: getLastBottomSamePixel(imageData, x, y, imageData.height, maxDistance),
        height: getHeightAtPosition(imageData, x, y, imageData.height, maxDistance),
        left: getLastLeftSamePixel(imageData, x, y, maxDistance),
        right: getLastRightSamePixel(imageData, x, y, imageData.width, maxDistance),
        top: getLastTopSamePixel(imageData, x, y, maxDistance),
        width: getWidthAtPosition(imageData, x, y, imageData.width, maxDistance),
    };
}

export interface Rectangle {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}

export function detectContainingRectangle(imageData: ImageData, x1: number, y1: number, x2: number, y2: number): Rectangle {
    const top = detectTopBoundary(imageData, x1, y1, x2, y2);
    const left = detectLeftBoundary(imageData, x1, y1, x2, y2);
    const bottom = detectBottomBoundary(imageData, x1, y1, x2, y2);
    const right = detectRightBoundary(imageData, x1, y1, x2, y2);
    return {
        top,
        left,
        bottom,
        right,
        width: right - left + 1,
        height: bottom - top + 1,
    };
}

function detectTopBoundary(imageData: ImageData, x1: number, y1: number, x2: number, y2: number): number {
    const baseColor = getPixel(imageData, x1, y1);
    for (let currentY = y1; currentY < y2; currentY++) {
        if (!allLineIsSamePixel(imageData, baseColor, x1, x2, currentY)) {
            return currentY;
        }
    }
    return y2;
}

function detectBottomBoundary(imageData: ImageData, x1: number, y1: number, x2: number, y2: number): number {
    const baseColor = getPixel(imageData, x1, y1);
    for (let currentY = y2; currentY > y1; currentY--) {
        if (!allLineIsSamePixel(imageData, baseColor, x1, x2, currentY)) {
            return currentY;
        }
    }
    return y1;
}

function detectLeftBoundary(imageData: ImageData, x1: number, y1: number, x2: number, y2: number): number {
    const baseColor = getPixel(imageData, x1, y1);
    for (let currentX = x1; currentX < x2; currentX++) {
        if (!allColumnIsSamePixel(imageData, baseColor, y1, y2, currentX)) {
            return currentX;
        }
    }
    return x2;
}

function detectRightBoundary(imageData: ImageData, x1: number, y1: number, x2: number, y2: number): number {
    const baseColor = getPixel(imageData, x1, y1);
    for (let currentX = x2; currentX > x1; currentX--) {
        if (!allColumnIsSamePixel(imageData, baseColor, y1, y2, currentX)) {
            return currentX;
        }
    }
    return x1;
}

function allLineIsSamePixel(imageData: ImageData, baseColor: Pixel, x1: number, x2: number, y: number): boolean {
    for (let currentX = x1; currentX < x2; currentX++) {
        if (!pixelAreSimilar(baseColor, getPixel(imageData, currentX, y), 0)) {
            return false;
        }
    }
    return true;
}

function allColumnIsSamePixel(imageData: ImageData, baseColor: Pixel, y1: number, y2: number, x: number): boolean {
    for (let currentY = y1; currentY < y2; currentY++) {
        if (!pixelAreSimilar(baseColor, getPixel(imageData, x, currentY), 0)) {
            return false;
        }
    }
    return true;
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

function getLastBottomSamePixel(imageData: ImageData, x: number, y: number, height: number, maxDistance: number) {
    const startPixel = getPixel(imageData, x, y);
    let yToCheck = y + 1;
    while (yToCheck < height) {
        const currentPixel = getPixel(imageData, x, yToCheck);
        if (!pixelAreSimilar(currentPixel, startPixel, maxDistance)) {
            return yToCheck - 1;
        }
        yToCheck++;
    }
    return yToCheck;
}

function getHeightAtPosition(imageData: ImageData, x: number, y: number, height: number, maxDistance: number): number {
    const top = getLastTopSamePixel(imageData, x, y, maxDistance);
    const bottom = getLastBottomSamePixel(imageData, x, y, height, maxDistance);
    return bottom - top + 1;
}

function getWidthAtPosition(imageData: ImageData, x: number, y: number, width: number, maxDistance: number): number {
    const left = getLastLeftSamePixel(imageData, x, y, maxDistance);
    const right = getLastRightSamePixel(imageData, x, y, width, maxDistance);
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

function getLastRightSamePixel(imageData: ImageData, x: number, y: number, width: number, maxDistance: number): number {
    const startPixel = getPixel(imageData, x, y);
    let xToCheck = x + 1;
    while (xToCheck < width) {
        const currentPixel = getPixel(imageData, xToCheck, y);
        if (!pixelAreSimilar(currentPixel, startPixel, maxDistance)) {
            return xToCheck - 1;
        }
        xToCheck++;
    }
    return xToCheck;
}
