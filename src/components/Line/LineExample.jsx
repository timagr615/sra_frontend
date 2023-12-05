import React, {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { MARGINS } from "./LineChart";
import { scaleLinear } from "@visx/scale";
import { Axis } from "@visx/axis";
import { AreaClosed, Line, LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve"
import { GlyphCircle, GlyphDot } from "@visx/glyph";

const FullHeightContent = styled.div`
height: 100%;
width: 100%;
position: relative;
display: flex;
flex-direction: column;
`;

const AnalyticsContent = styled.div`
    flex: 1;
    position: relative;
    border-top: solid 1px #C5CBD3;
`;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function numTicksForWidth(width){
    if (width <= 300) return 2;
    if (300 < width && width <= 700) {
        return 5;
    }
    return 10;
}

function getStokes(x,t,w,k,a){
    const theta = k*x+w*t;
    const stokesWave = a*((1-1/16*k*k*a*a)*Math.cos(theta)+1/2*k*a*Math.cos(2*theta)+3/8*k*k*a*a*Math.cos(3*theta))
    return stokesWave;
}

function getStokesDepth(x, t, w, k, a, h){
    const theta = k*x+w*t;
    const sigma = Math.tanh(k*h);
    const cos = Math.cos(theta);
    const cos2 = Math.cos(2*theta);
    return a*(cos+k*a*(3-sigma*sigma)/(4*sigma*sigma*sigma)*cos2);
}

function smoothStep(t){
    return -1.5*Math.tanh(t/20-2) - 3
}

function getY(x){
    const k = 0.2;
    const w = 0.034;
    
    let s = new Date().getTime()%100000/100;
    
    s = Math.floor(s)%500
    const a = 0.0004*s;
    console.log(s)
    const t = Math.floor(Date.now()/100);
    //const h = Math.cos(Date.now()/2000)+Math.cos(x/15-5)+3.4;
    const h = smoothStep(x);
    const stokesWave = getStokesDepth(x, t, w, k, a, h) + getStokesDepth(x, t, 0.04, 0.15, 0.1, h)+ getStokesDepth(x, t, 0.3, 0.7, 0.05, h)
    return [stokesWave, smoothStep(x), getStokesDepth(x, t, w, k, a, 4)]
}
const MAX_X  = 101;

export const LineExample = () => {

    const { ref, width = 1, height = 1 } = useResizeObserver({
        round: (n) => Math.floor(n),
    });
    const [data, setData] = useState(() => {
        const d = []
        for (let i = 0; i < MAX_X; i++){
            d.push({
                x: i,
                y: 0
            })
        }
        return d;
    });
    const [data2, setData2] = useState(() => {
        const d = []
        for (let i = 0; i < MAX_X; i++){
            d.push({
                x: i,
                y: 0
            })
        }
        return d;
    });
    const [data3, setData3] = useState(() => {
        const d = []
        for (let i = 0; i < MAX_X; i++){
            d.push({
                x: i,
                y: 0
            })
        }
        return d;
    });

    useEffect(() => {
        const time = setInterval(() => {
            const d = [];
            const d2 = [];
            const d3 = [];
            //console.log(d)
            for (let i = 0; i < MAX_X; i++){
                d.push({
                    x: i,
                    y: getY(i)[0] 
                })
                d2.push({
                    x: i,
                    y: getY(i)[1]
                })
                d3.push({
                    x: i,
                    y: getY(i)[2]
                })
                
            }
            //console.log(Date.now())
            
            //console.log(d)
            setData(d);
            setData2(d2);
            setData3(d3);
        }, 100)
        return () => clearInterval(time);
    }, [data])
    
    const xScale = useMemo(() => (
        scaleLinear({
            domain: [0, MAX_X-1],
            range: [0+MARGINS.left, width - MARGINS.right]
        })
    ), [width, data])
    
    const minY = Math.min(...data.map((d) => d.y))
    const maxY = Math.max(...data.map((d) => d.y))
    const yScale = useMemo(() => (
        scaleLinear({
            domain: [-6, 6],
            range: [height-MARGINS.bottom-50, MARGINS.top]
        })
    ))
    
    //console.log(width, height)
    const [currentX, setCurrentX] = useState(MARGINS.left+10);
        console.log(data)
    const svgRef = useRef(null);
    return (
        <FullHeightContent ref={ref}>

            <AnalyticsContent >
                <div>
                    <svg width={width} height={height-30}>
                        <rect
                            x={0}
                            y={0}
                            width={width}
                            height={height}
                            fill={"#FFFFFF"}
                            ref={svgRef}
                            onMouseMove={e => {
                                if (svgRef.current == null) {
                                    return;
                                }
                                const svgX = e.clientX - svgRef.current.getBoundingClientRect().left;
                                const cursorXPos = svgX - MARGINS.left;
                                if (cursorXPos < 0){
                                    return;
                                }
                                if (cursorXPos > width-MARGINS.right){
                                    return;
                                }
                                //setPoint(timeToIndex[xScaleTime.invert(svgX)]);
                                
                                setCurrentX(svgX);
                                //console.log(timeToIndex[xScaleTime.invert(svgX)])
                                //console.log(cursorXPos, svgX, currentX)
                            }}/>
                            <Axis
                            scale={xScale}
                            top={height-MARGINS.bottom-35}
                            orientation="bottom"
                            stroke="#888888"
                            strokeWidth={1}
                            tickStroke="#777777"
                            numTicks={numTicksForWidth(width)}
                            tickLabelProps={()=>({
                                fill: "#888888",
                                textAnchor: "middle",
                                verticalAnchor: "middle",
                                fontSize: 12,
                            })}
                            />
                            <Axis
                            orientation="left"
                            left={MARGINS.left-1}
                            //top={MARGINS.bottom}
                            scale={yScale}
                            numTicks={10}
                            tickLabelProps={() => ({ fill: "#888888", fontSize: 12, textAnchor: "end", dy: 3, dx: -2 })}
                            stroke="#888888"
                            strokeWidth={1}
                            tickStroke="#888888"
                            />
                            
                            <AreaClosed
                            data={data}
                            y={d => yScale(d.y)}
                            x={(d) => xScale(d.x)}
                            yScale={yScale}
                            strokeWidth={2}
                            stroke={"#aee"}
                            fill="#aeeeee"
                            curve={curveMonotoneX}/>
                            
                            <AreaClosed
                            data={data2}
                            y={d => yScale(d.y)}
                            x={(d) => xScale(d.x)}
                            yScale={yScale}
                            strokeWidth={2}
                            stroke={"#888"}
                            fill="#888"
                            curve={curveMonotoneX}/>
                            <Line
                            stroke="#000"
                            strokeWidth={1}
                            strokeDasharray="5.5"
                            from={{
                                x: MARGINS.left,
                                y: yScale(getY(10)[0])
                            }}
                            to={{
                                x: xScale(10),
                                y: yScale(getY(10)[0])
                            }}/>
                            <GlyphDot
                            left={xScale(10)}
                            top={yScale(getY(10)[0])}
                            r={2}
                            stroke={"#f72585"}
                            strokeWidth={2}/>

                            <Line
                            stroke="#000"
                            strokeWidth={1}
                            strokeDasharray="5.5"
                            from={{
                                x: MARGINS.left,
                                y: yScale(getY(80)[0])
                            }}
                            to={{
                                x: xScale(80),
                                y: yScale(getY(80)[0])
                            }}/>
                            <GlyphDot
                            left={xScale(80)}
                            top={yScale(getY(80)[0])}
                            r={2}
                            stroke={"#f72585"}
                            strokeWidth={2}/>

                            <Line
                            stroke="#777777"
                            strokeWidth={1}
                            strokeDasharray="5.5"
                            from={{
                                x: MARGINS.left,
                                y: yScale(0)
                            }}
                            to={{
                                x: width-MARGINS.right,
                                y: yScale(0)
                            }}/>
                            {/*<LinePath
                            data={data3}
                            y={d => yScale(d.y)}
                            x={(d) => xScale(d.x)}
                            strokeWidth={2}
                            stroke={"#ae3"}
                        curve={curveMonotoneX}/>
                        <Line
                            stroke="#000"
                            strokeWidth={1}
                            strokeDasharray="5.5"
                            from={{
                                x: MARGINS.left,
                                y: yScale(-1.5)
                            }}
                            to={{
                                x: width-MARGINS.right-70,
                                y: yScale(-6)
                            }}/>*/}
                    </svg>
                </div>
            </AnalyticsContent>
        </FullHeightContent>
    )
}