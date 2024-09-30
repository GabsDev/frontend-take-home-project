'use client'
import React, { useRef, useEffect, useState } from "react";
import styles from './page.module.css'

export default function CanvasComponent() {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('black');
    const [lineWidth, setLineWidth] = useState(3);
    const [drawingActions, setDrawingActions] = useState([]);
    const [currentPath, setCurrenPath] = useState([]);
    const [currentStyle, setCurrentStyle] = useState({color: 'black', lineWidth:3});

    useEffect(()=> {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            canvas.width=900;
            canvas.height=500;
            const ctx = canvas.getContext('2d');
            setContext(ctx)
            reDrawPreviousData(ctx);
        }
    },[]);

    const startDrawing = (e) => {
        if(context) {
            context.beginPath();
            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setDrawing(true);
        }
    }

    const draw = (e) => {
        if(!drawing) return
        if(context){
            context.strokeStyle = currentStyle.color;
            context.lineWidth = currentStyle.lineWidth;
            context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            context.stroke();
            setCurrenPath([...currentPath,{x:e.nativeEvent.offsetX,y:e.nativeEvent.offsetY}]);
        }
    };

    const endDrawing = (e) => {
        setDrawing(false);
        context && context.closePath();
        if( currentPath.length>0) {
            setDrawingActions([...drawingActions, {path:currentPath, style: currentStyle}]);
        }
        setCurrenPath([]);
    }

    const changeColor = (color) => {
        setCurrentColor(color);
        setCurrentStyle({...currentStyle, color});
    };

    const changeWidth = (width) => {
        setLineWidth(width);
        setCurrentStyle({...currentStyle, lineWidth:width});
    };

    const undoDrawing = () => {
        if(drawingActions.length>0){
            drawingActions.pop();
            const newContext = canvasRef.current.getContext('2d');
            newContext.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);

            drawingActions.forEach(({path, style}) => {
                newContext.beginPath();
                newContext.strokeStyle = style.color;
                newContext.lineWidth = style.lineWidth;
                newContext.moveTo(path[0].x, path[0].y);
                path.forEach((point)=> {
                    newContext.lineTo(point.x, point.y);
                });
                newContext.stroke();

            });
        }
    };

    const clearDrawing = () => {
        setDrawingActions([]);
        setCurrenPath([]);
        const newContext = canvasRef.current.getContext('2d');
        newContext.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
    }

    const reDrawPreviousData = (ctx) => {
        drawingActions.forEach(({path, style}) => {
            ctx.beginPath();
            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.lineWidth;
            ctx.moveTo(path[0].x, path[0].y);
            path.forEach((point)=> {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                onClick={startDrawing}
                style={{backgroundColor: "white"}}>
            </canvas>

            <div className={styles.center} >
                <div className={styles.center} style={{padding:"10"}}>
                    {["black", "red", "blue", "green", "pink"].map((color) => (
                        <div
                            key={color}
                            style={currentColor === color ? {} : {backgroundColor: color, padding:10, width:50, margin:5}}
                            onClick={() => changeColor(color)}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.center}>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={lineWidth}
                    onChange={(e)=>changeWidth(e.target.value)}
                />

                <div className={styles.center}>
                    <button className={styles.center} style={{ margin: 20}}
                            onClick={undoDrawing}>
                        Undo
                    </button>

                    <button className={styles.center}
                            onClick={clearDrawing}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}