import 'babel-polyfill';
import assert from 'assert';
import { getPixelOffset, pixelAreSimilar, colorDistance, measureFromPosition } from "../src/util";
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

describe ('measureFromPosition', () => {

    let imageData: ImageData;

    beforeEach(async () => {
        imageData = await loadSampleImageData();
    });

    it ('should tell the y coordinate of the first different top pixel - 0', () => {
        assert.equal(measureFromPosition(imageData, 10, 9).top, 6);
    });

    it ('should tell the y coordinate of the first different top pixel - 1', () => {
        assert.equal(measureFromPosition(imageData, 20, 9).top, 0);
    });

    it ('should tell the y coordinate of the first different top pixel - 2', () => {
        assert.equal(measureFromPosition(imageData, 14, 15).top, 15);
    });

    it ('should tell the y coordinate of the first different bottom pixel - 0', () => {
        assert.equal(measureFromPosition(imageData, 10, 9).bottom, 11);
    });

    it ('should tell the y coordinate of the first different bottom pixel - 1', () => {
        assert.equal(measureFromPosition(imageData, 24, 26).bottom, 31);
    });

    it ('should tell the y coordinate of the first different bottom pixel - 2', () => {
        assert.equal(measureFromPosition(imageData, 4, 19).bottom, 19);
    });

    it ('should tell the y coordinate of the first different left pixel - 0', () => {
        assert.equal(measureFromPosition(imageData, 17, 4).left, 13);
    });

    it ('should tell the y coordinate of the first different left pixel - 1', () => {
        assert.equal(measureFromPosition(imageData, 20, 9).left, 0);
    });

    it ('should tell the y coordinate of the first different left pixel - 2', () => {
        assert.equal(measureFromPosition(imageData, 6, 21).left, 6);
    });

    it ('should tell the y coordinate of the first different right pixel - 0', () => {
        assert.equal(measureFromPosition(imageData, 2, 13).right, 8);
    });

    it ('should tell the y coordinate of the first different right pixel - 1', () => {
        assert.equal(measureFromPosition(imageData, 14, 8).right, 31);
    });

    it ('should tell the y coordinate of the first different right pixel - 2', () => {
        assert.equal(measureFromPosition(imageData, 28, 24).right, 28);
    });

    it ('should compute height at position - 0', () => {
        assert.equal(measureFromPosition(imageData, 11, 9).height, 6);
    });

    it ('should compute height at position - 1', () => {
        assert.equal(measureFromPosition(imageData, 18, 18).height, 5);
    });

    it ('should compute height at position - 2', () => {
        assert.equal(measureFromPosition(imageData, 7, 1).height, 3);
    });

    it ('should compute height at position - 3', () => {
        assert.equal(measureFromPosition(imageData, 30, 30).height, 3);
    });

    it ('should compute height at position - 4', () => {
        assert.equal(measureFromPosition(imageData, 25, 19).height, 32);
    });

    it ('should compute width at position - 0', () => {
        assert.equal(measureFromPosition(imageData, 10, 1).width, 32);
    });

    it ('should compute width at position - 1', () => {
        assert.equal(measureFromPosition(imageData, 1, 4).width, 3);
    });

    it ('should compute width at position - 2', () => {
        assert.equal(measureFromPosition(imageData, 26, 20).width, 4);
    });

    it ('should compute width at position - 3', () => {
        assert.equal(measureFromPosition(imageData, 31, 26).width, 1);
    });

    it ('should compute width at position - 4', () => {
        assert.equal(measureFromPosition(imageData, 13, 30).width, 32);
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
