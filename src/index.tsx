import React from 'react';
import ReactDOM from 'react-dom';
import pasteImage from 'paste-image';
import { measureFromPosition, detectContainingRectangle, Rectangle } from './util';

import './style.css';

interface AppState {
    top: number | null;
    left: number | null;
    width: number | null;
    height: number | null;
    cursorX: number | null;
    cursorY: number | null;
    tolerance: number;
    sizeRectangle: Rectangle | null;
    tmpRectangle: {
        top: number;
        left: number;
        width: number;
        height: number;
    } | null;
    isMouseDown: boolean;
}

const preventDefaultAndStopPropagation = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
};

class App extends React.Component<{}, AppState> {

    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;
    state: AppState = {
        top: null,
        left: null,
        width: null,
        height: null,
        cursorX: null,
        cursorY: null,
        tolerance: 0,
        sizeRectangle: null,
        tmpRectangle: null,
        isMouseDown: false,
    };
    imageData: ImageData | null = null;

    componentDidMount() {
        pasteImage.on('paste-image', image => {
            if (this.canvas && this.ctx) {
                this.canvas.width = image.width;
                this.canvas.height = image.height;
                this.ctx.drawImage(image, 0, 0);
                this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            }
        });
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave'].map(a => {
            document.addEventListener(a, preventDefaultAndStopPropagation);
        });
        document.addEventListener('drop', event => {
            event.preventDefault();
            event.stopPropagation();

            const droppedFiles = event.dataTransfer.files;
            var img = document.createElement('img');
            img.onload = () => {
                window.URL.revokeObjectURL(img.src);
                if (this.canvas && this.ctx) {
                    this.canvas.width = 0;
                    this.canvas.height = 0;
                    this.canvas.width = img.width;
                    this.canvas.height = img.height;
                    this.ctx.drawImage(img, 0, 0);
                    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                } else {
                    alert('canvas or context is null');
                }
            };
            img.src = window.URL.createObjectURL(droppedFiles[0]);
        });
    }

    onGrabCanvas = (e: HTMLCanvasElement) => {
        this.canvas = e;
        this.ctx = e.getContext('2d');
    };

    onMeasureWithPosition: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const cursorX = e.nativeEvent.offsetX;
        const cursorY = e.nativeEvent.offsetY;
        if (this.imageData) {
            const {top, left, width, height} = measureFromPosition(this.imageData, cursorX, cursorY, this.state.tolerance);
            this.setState({
                top,
                left,
                width,
                height,
                cursorX,
                cursorY,
            });
        }
    };

    onToleranceChangeHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.setState({
            tolerance: Number(e.target.value),
        });
    }

    decrementTolerance = () => {
        this.setState(state => ({
            tolerance: Math.max(state.tolerance - 1, 0),
        }));
    };

    incrementTolerance = () => {
        this.setState(state => ({
            tolerance: Math.min(state.tolerance + 1, 510),
        }));
    };

    onStartDrawRectangle: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const originX = e.nativeEvent.offsetX;
        const originY = e.nativeEvent.offsetY;
        this.setState({
            tmpRectangle: {
                top: originX,
                left: originY,
                height: 0,
                width: 0,
            },
            isMouseDown: true,
        });
        const onMouseMoveHandler = (e: MouseEvent) => {
            const [startX, endX] = originX > e.offsetX ? [e.offsetX, originX] : [originX, e.offsetX];
            const [startY, endY] = originY > e.offsetY ? [e.offsetY, originY] : [originY, e.offsetY];
            this.setState({
                tmpRectangle: {
                    top: startY,
                    left: startX,
                    width: endX - startX,
                    height: endY - startY,
                },
            });
        };
        const onMouseUpHandler = (e: MouseEvent) => {
            document.removeEventListener('mouseup', onMouseUpHandler);
            document.removeEventListener('mousemove', onMouseMoveHandler);
            const [startX, endX] = originX > e.offsetX ? [e.offsetX, originX] : [originX, e.offsetX];
            const [startY, endY] = originY > e.offsetY ? [e.offsetY, originY] : [originY, e.offsetY];
            if (this.imageData) {
                this.setState({
                    sizeRectangle: detectContainingRectangle(this.imageData, this.state.tolerance, startX, startY, endX, endY),
                    tmpRectangle: null,
                    isMouseDown: false,
                });
            } else {
                alert('no image data');
            }
        };
        document.addEventListener('mouseup', onMouseUpHandler);
        document.addEventListener('mousemove', onMouseMoveHandler);
    }

    render() {
        return (
            <div>
                <div>
                    Tolerance:
                    <input
                        type="range"
                        min="0"
                        max="510"
                        step="1"
                        value={this.state.tolerance}
                        onChange={this.onToleranceChangeHandler}
                    />
                    <button onClick={this.decrementTolerance}>-</button>
                    <button onClick={this.incrementTolerance}>+</button>
                    ({this.state.tolerance})
                </div>
                { this.imageData == null ? (
                    <div>Use ctrl (or cmd) + V to paste your image</div>
                ) : null }
                <div style={{position: 'relative'}}>
                    <canvas
                        ref={this.onGrabCanvas}
                        onMouseMove={this.onMeasureWithPosition}
                        onMouseDown={this.onStartDrawRectangle}
                    />
                    { this.state.cursorX != null && this.state.cursorY != null && this.state.isMouseDown === false ? (
                        <div style={{
                            position: 'absolute',
                            backgroundColor: 'black',
                            color: 'white',
                            top: this.state.cursorY + 16,
                            left: this.state.cursorX + 16,
                            padding: '2px 4px',
                            pointerEvents: 'none',
                        }}>
                            {this.state.width} * {this.state.height}
                        </div>
                    ) : null }
                    { this.state.top != null && this.state.height != null && this.state.cursorX != null && this.state.isMouseDown === false ? (
                        <div style={{
                            position: 'absolute',
                            border: 'red thin solid',
                            width: 1,
                            height: this.state.height,
                            top: this.state.top,
                            left: this.state.cursorX,
                            pointerEvents: 'none',
                        }} />
                    ) : null }
                    { this.state.left != null && this.state.width != null && this.state.cursorY != null && this.state.isMouseDown === false ? (
                        <div style={{
                            position: 'absolute',
                            border: 'red thin solid',
                            width: this.state.width,
                            height: 1,
                            top: this.state.cursorY,
                            left: this.state.left,
                            pointerEvents: 'none',
                        }} />
                    ) : null }
                    { this.state.sizeRectangle != null ? (
                        <div style={{
                            position: 'absolute',
                            border: 'thin green solid',
                            top: this.state.sizeRectangle.top,
                            left: this.state.sizeRectangle.left,
                            width: this.state.sizeRectangle.width,
                            height: this.state.sizeRectangle.height,
                            pointerEvents: 'none',
                        }} />
                    ) : null }
                    { this.state.tmpRectangle != null ? (
                        <div style={{
                            position: 'absolute',
                            border: 'thin blue solid',
                            top: this.state.tmpRectangle.top,
                            left: this.state.tmpRectangle.left,
                            width: this.state.tmpRectangle.width,
                            height: this.state.tmpRectangle.height,
                            pointerEvents: 'none',
                        }} />
                    ) : null }
                    { this.state.sizeRectangle != null ? (
                        <div style={{
                            position: 'absolute',
                            backgroundColor: 'black',
                            color: 'lightgreen',
                            top: this.state.sizeRectangle.top + 16,
                            left: this.state.sizeRectangle.left + 16,
                            padding: '2px 4px',
                            pointerEvents: 'none',
                        }}>
                            {this.state.sizeRectangle.width} * {this.state.sizeRectangle.height}
                        </div>
                    ) : null }
                </div>
            </div>
        );
    }
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<App />, root);
