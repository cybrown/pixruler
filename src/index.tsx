import React from 'react';
import ReactDOM from 'react-dom';
import pasteImage from 'paste-image';
import { getHeightAtPosition, getWidthAtPosition } from './util';

class App extends React.Component<{}, {
    heightToDisplay: number | null;
    widthToDisplay: number | null;
}> {

    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;
    state = {
        heightToDisplay: null,
        widthToDisplay: null,
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
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        if (this.imageData) {
            const height = getHeightAtPosition(this.imageData, x, y);
            const width = getWidthAtPosition(this.imageData, x, y);
            this.setState({
                heightToDisplay: height,
                widthToDisplay: width,
            });
        }
    };

    render() {
        return (
            <div>
                <div>Use ctrl (or cmd) + V to paste your image</div>
                <div>Width: {this.state.widthToDisplay}</div>
                <div>Height: {this.state.heightToDisplay}</div>
                <canvas ref={this.onGrabCanvas} onClick={this.onGetHeight} />
            </div>
        );
    }
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<App />, root);
