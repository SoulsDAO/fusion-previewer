import React from 'react';
import { fabric } from 'fabric';

import { Soul } from './Soul';

export interface ISoulCanvasProps {
    soul: Soul;
    id: string;
}

export function SoulCanvas(props: ISoulCanvasProps) {
    const [canvas, setCanvas] = React.useState<fabric.StaticCanvas>();

    const { id, soul } = props;

    React.useEffect(() => {
        const canvasObj = new fabric.StaticCanvas(id, {
            width: 256,
            height: 256,
        });

        setCanvas(canvasObj);
    }, [id]);

    React.useEffect(() => {
        if (canvas) {
            soul.setCanvas(canvas);
            soul.draw();
        }
    }, [canvas, soul]);

    return (
        <canvas
            id={props.id}
            style={{
                height: '256px',
                width: '256px',
            }}
        >
        </canvas>
    );
}
