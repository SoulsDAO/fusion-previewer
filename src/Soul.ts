import { fabric } from 'fabric';
import { Attribute } from './Types';

export class Soul {
    private canvas?: fabric.Canvas | fabric.StaticCanvas;

    constructor(
        public background: Attribute,
        public body: Attribute,
        public eyes: Attribute,
        public mouth: Attribute,
        public cheeks: Attribute,
        public glasses: Attribute,
        public hair: Attribute,
        public hands: Attribute,
    ) {
    }

    private async loadImage(base64: string) {
        return new Promise<void>((res) => {
            fabric.Image.fromURL(base64, (img) => {
                img.selectable = false;
                this?.canvas?.add(img);
                res();
            });
        });
    }

    public async setCanvas(canvas: fabric.Canvas | fabric.StaticCanvas) {
        this.canvas = canvas;
    }

    public async draw() {
        if (!this.canvas) {
            return;
        }

        await this.canvas.clear();

        if ((this.canvas as any).selection) {
            (this.canvas as any).selection = false;
        }

        for (const item of [
            this.background,
            this.body,
            this.eyes,
            this.mouth,
            this.cheeks,
            this.glasses,
            this.hands,
            this.hair,
        ]) {
            if (item.image.default === '') {
                continue;
            }

            await this.loadImage(item.image.default);
        }
    }
}
