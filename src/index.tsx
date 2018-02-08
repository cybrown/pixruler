import React from 'react';
import ReactDOM from 'react-dom';
import pasteImage from 'paste-image';
import { getHeightAtPosition, getWidthAtPosition, getLastLeftSamePixel, getLastTopSamePixel } from './util';

import './style.css';

class App extends React.Component<{}, {
    top: number | null;
    left: number | null;
    width: number | null;
    height: number | null;
    cursorX: number | null;
    cursorY: number | null;
}> {

    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;
    state = {
        top: null,
        left: null,
        width: null,
        height: null,
        cursorX: null,
        cursorY: null,
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

    onGetHeight: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const cursorX = e.nativeEvent.offsetX;
        const cursorY = e.nativeEvent.offsetY;
        if (this.imageData) {
            const top = getLastTopSamePixel(this.imageData, cursorX, cursorY);
            const left = getLastLeftSamePixel(this.imageData, cursorX, cursorY);
            const height = getHeightAtPosition(this.imageData, cursorX, cursorY);
            const width = getWidthAtPosition(this.imageData, cursorX, cursorY);
            this.setState({top, left, width, height, cursorX, cursorY});
        }
    };

    render() {
        return (
            <div>
                <div>Use ctrl (or cmd) + V to paste your image</div>
                <div>Width: {this.state.width}</div>
                <div>Height: {this.state.height}</div>
                <div style={{position: 'relative'}}>
                    <canvas ref={this.onGrabCanvas} onClick={this.onGetHeight} />
                    { this.state.top && this.state.height && this.state.cursorX ? (
                        <div style={{
                            position: 'absolute',
                            border: 'red thin solid',
                            width: 1,
                            height: this.state.height,
                            top: this.state.top,
                            left: this.state.cursorX,
                        }} />
                    ) : null }
                    { this.state.left && this.state.width && this.state.cursorY ? (
                        <div style={{
                            position: 'absolute',
                            border: 'red thin solid',
                            width: this.state.width,
                            height: 1,
                            top: this.state.cursorY,
                            left: this.state.left,
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
