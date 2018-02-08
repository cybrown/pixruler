import 'babel-polyfill';
import assert from 'assert';
import { getPixelOffset, pixelAreSimilar, getLastTopSamePixel, getLastBottomSamePixel, getHeightAtPosition, getLastLeftSamePixel, getLastRightSamePixel, getWidthAtPosition, colorDistance } from "../src/util";
import { loadSampleImageData } from "./test-util";

describe ('getPixelOffset', () => {

    it ('should compute pixel coordinate in image data - 0', () => {
        assert.equal(getPixelOffset(0, 0, 32), 0);
    });

    it ('should compute pixel coordinate in image data - 1', () => {
        assert.equal(getPixelOffset(1, 0, 32), 4);
    });

    it ('should compute pixel coordinate in image data - 2', () => {
        assert.equal(getPixelOffset(1, 1, 3), 16);
    });
});

describe ('pixelAreSimilar', () => {

    it ('should be similar pixels', () => {
        assert.ok(pixelAreSimilar([5, 5, 5, 5], [5, 5, 5, 5]));
    });

    it ('should not be similar pixels', () => {
        assert.equal(pixelAreSimilar([5, 5, 5, 5], [5, 4, 5, 5]), false);
    });
});

describe ('getLastTopSamePixel', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should tell the y coordinate of the first different top pixel - 0', () => {
        assert.equal(getLastTopSamePixel(imageData, 10, 9), 6);
    });

    it ('should tell the y coordinate of the first different top pixel - 1', () => {
        assert.equal(getLastTopSamePixel(imageData, 20, 9), 0);
    });

    it ('should tell the y coordinate of the first different top pixel - 2', () => {
        assert.equal(getLastTopSamePixel(imageData, 14, 15), 15);
    });
});

describe ('getLastBottomSamePixel', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should tell the y coordinate of the first different bottom pixel - 0', () => {
        assert.equal(getLastBottomSamePixel(imageData, 10, 9), 11);
    });

    it ('should tell the y coordinate of the first different bottom pixel - 1', () => {
        assert.equal(getLastBottomSamePixel(imageData, 24, 26), 31);
    });

    it ('should tell the y coordinate of the first different bottom pixel - 2', () => {
        assert.equal(getLastBottomSamePixel(imageData, 4, 19), 19);
    });
});

describe ('getLastLeftSamePixel', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should tell the y coordinate of the first different left pixel - 0', () => {
        assert.equal(getLastLeftSamePixel(imageData, 17, 4), 13);
    });

    it ('should tell the y coordinate of the first different left pixel - 1', () => {
        assert.equal(getLastLeftSamePixel(imageData, 20, 9), 0);
    });

    it ('should tell the y coordinate of the first different left pixel - 2', () => {
        assert.equal(getLastLeftSamePixel(imageData, 6, 21), 6);
    });
});

describe ('getLastRightSamePixel', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should tell the y coordinate of the first different right pixel - 0', () => {
        assert.equal(getLastRightSamePixel(imageData, 2, 13), 8);
    });

    it ('should tell the y coordinate of the first different right pixel - 1', () => {
        assert.equal(getLastRightSamePixel(imageData, 14, 8), 31);
    });

    it ('should tell the y coordinate of the first different right pixel - 2', () => {
        assert.equal(getLastRightSamePixel(imageData, 28, 24), 28);
    });
});

describe ('getHeightAtPosition', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should compute height at position - 0', () => {
        assert.equal(getHeightAtPosition(imageData, 11, 9), 6);
    });

    it ('should compute height at position - 1', () => {
        assert.equal(getHeightAtPosition(imageData, 18, 18), 5);
    });

    it ('should compute height at position - 2', () => {
        assert.equal(getHeightAtPosition(imageData, 7, 1), 3);
    });

    it ('should compute height at position - 3', () => {
        assert.equal(getHeightAtPosition(imageData, 30, 30), 3);
    });

    it ('should compute height at position - 4', () => {
        assert.equal(getHeightAtPosition(imageData, 25, 19), 32);
    });
});

describe ('getWidthAtPosition', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should compute width at position - 0', () => {
        assert.equal(getWidthAtPosition(imageData, 10, 1), 32);
    });

    it ('should compute width at position - 1', () => {
        assert.equal(getWidthAtPosition(imageData, 1, 4), 3);
    });

    it ('should compute width at position - 2', () => {
        assert.equal(getWidthAtPosition(imageData, 26, 20), 4);
    });

    it ('should compute width at position - 3', () => {
        assert.equal(getWidthAtPosition(imageData, 31, 26), 1);
    });

    it ('should compute width at position - 4', () => {
        assert.equal(getWidthAtPosition(imageData, 13, 30), 32);
    });
});

describe ('colorDistance', () => {

    it ('should be the same color', () => {
        assert.equal(colorDistance([12, 12, 12, 255], [12, 12, 12, 255]), 0);
    });

    it ('should return 1', () => {
        assert.equal(colorDistance([12, 12, 12, 255], [11, 12, 12, 255]), 1);
    });

    it ('should return sqrt(2)', () => {
        assert.equal(colorDistance([12, 12, 12, 255], [11, 11, 12, 255]), Math.sqrt(2));
    });
});
