declare module 'paste-image' {

    export function on(eventName: string, callback: (image: HTMLImageElement) => any): void;
}
