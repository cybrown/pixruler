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
}

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
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;
        const onMouseUpHandler = (e: MouseEvent) => {
            document.removeEventListener('mouseup', onMouseUpHandler);
            const endX = e.offsetX;
            const endY = e.offsetY;
            console.log(startX, startY, endX, endY);
            if (this.imageData) {
                this.setState({
                    sizeRectangle: detectContainingRectangle(this.imageData, startX, startY, endX, endY),
                });
            } else {
                alert('no image data');
            }
        };
        document.addEventListener('mouseup', onMouseUpHandler);
    }

    render() {
        return (
            <div>
                <div>Use ctrl (or cmd) + V to paste your image</div>
                <div>
                    Tolerance: ({this.state.tolerance})
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
                </div>
                <div>Width: {this.state.width}</div>
                <div>Height: {this.state.height}</div>
                { this.state.sizeRectangle != null ? (
                    <div>
                        <div>Width: {this.state.sizeRectangle.width}</div>
                        <div>Height: {this.state.sizeRectangle.height}</div>
                    </div>
                ) : null }
                <div style={{position: 'relative'}}>
                    <canvas
                        ref={this.onGrabCanvas}
                        onMouseMove={this.onMeasureWithPosition}
                        onMouseDown={this.onStartDrawRectangle}
                    />
                    { this.state.top != null && this.state.height != null && this.state.cursorX != null ? (
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
                    { this.state.left != null && this.state.width != null && this.state.cursorY != null ? (
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
                        }} />
                    ) : null }
                </div>
            </div>
        );
    }
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<App />, root);
