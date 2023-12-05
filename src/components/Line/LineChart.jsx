import React, { useEffect, useMemo, useRef, useState } from "react"

import {Axis, AxisBottom, AxisLeft} from "@visx/axis";
import {scaleLinear, scaleTime} from "@visx/scale";
import { timeFormat } from '@visx/vendor/d3-time-format';
import { YLine, createYscale, MetricLines } from "./createYScales";
import {LinePath, Line} from "@visx/shape";
import { Text } from '@visx/text';
import styled from "styled-components"
import { Intent, MultiSlider } from "@blueprintjs/core";

export const MARGINS = { top: 10, left: 60, bottom: 25, right: 15 };

function numTicksForWidth(width){
    if (width <= 300) return 2;
    if (300 < width && width <= 500) {
        return 5;
    }
    return 10;
}
export const ZOOM_SLIDER_HEIGHT = 30;
const SliderContainer = styled.div`
    display: flex;
    width: 100%;
    height: ${ZOOM_SLIDER_HEIGHT}px;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 20px;
    padding-right: 20px;
`;

export const LineChart = ({
    width, 
    height, 
    datafile, 
    metricsCurrent,
    lineWidth, 
    lineOpacity,
    point,
    setPoint,
    interpolation,
    range,
    setRange,
    fileLen,
    sma,
    smaWindow}) => {
        
    const svgRef = useRef(null);
    
    const formatDate = timeFormat("%H:%M")
    //console.log(range, datafile.length)
    const xScaleTime = useMemo(() => (scaleTime({
        domain: datafile.length > 0 
                                    ? 
                                    [datafile[0].date, datafile[datafile.length-1].date] : 
                                    [new Date(2000, 0, 1, 0), new Date(2000, 0, 1, 2)],
        range:  [0  +  MARGINS.left,  width  -  MARGINS.right]
    })), [width, datafile, range])
    const [currentX, setCurrentX] = useState(MARGINS.left+10);
    const [timeToIndex, setTimeToIndex] = useState({})
    useEffect(()=>{
        if (datafile.length > 0){
            setCurrentX(xScaleTime(datafile[point].date))
        }
        
    }, [point])

    useEffect(()=> {
        const ind = {}
        for (let i = 0; i < datafile.length; i++){
            ind[datafile[i].date] = i;
        }
        setTimeToIndex(ind)
    }, [datafile])

    
    
    
    //console.log("help", timeToIndex)


    return (
        <div>
            <svg width={width < 0 ? 300 : width} height={height}>
                <rect   
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="#FFFFFF"
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
                        setPoint(timeToIndex[xScaleTime.invert(svgX)]==undefined 
                        ? 0 
                        : 
                        timeToIndex[xScaleTime.invert(svgX)]);
                        setCurrentX(svgX);
                        //console.log(timeToIndex[xScaleTime.invert(svgX)])
                        //console.log(cursorXPos, svgX, currentX, point)
                    }}
                />
                <Axis 
                    scale={xScaleTime}
                    top={height-MARGINS.bottom}
                    orientation="bottom"
                    stroke="#888888"
                    strokeWidth={1}
                    tickStroke="#888888"
                    tickFormat={formatDate}
                    numTicks={numTicksForWidth(width)}
                    tickLabelProps={() => ({
                        fill:  "#888888",
                        textAnchor:  "middle",
                        verticalAnchor:  "middle",
                        fontSize: 12,
                        })}
                />
                <MetricLines
                xscale={xScaleTime}
                currentX={currentX}
                datafile={datafile}
                metricsCurrent={metricsCurrent}
                height={height}
                lineWidth={lineWidth}
                lineOpacity={lineOpacity}
                width={width}
                interpolation={interpolation}
                point={point}
                sma={sma}
                smaWindow={smaWindow}/>
                <Line 
                    stroke="#FF00FF"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    from={{
                        x: currentX,
                        y: 0
                    }}
                    to={{x: currentX, y: height-MARGINS.bottom-15}}/>
                <Text 
                    fill='#888888'
                    x={currentX-28}
                    y={height-MARGINS.bottom-3}>
                        {`${xScaleTime.invert(currentX).getHours()}:${xScaleTime.invert(currentX).getMinutes()}:${xScaleTime.invert(currentX).getSeconds()}`}
                </Text>
                {/*<YLine 
                    xscale={xScaleTime}
                    metric={'roll'}
                    datafile={datafile.slice(0, -1)}
                    index={0} 
                    height={height}
                    count={3}/>
                <YLine 
                    xscale={xScaleTime}
                    metric={'pitch'}
                    datafile={datafile.slice(0, -1)}
                    index={1} 
                    height={height}
                    count={3}/>
                <YLine 
                    xscale={xScaleTime}
                    metric={'yaw'}
                    datafile={datafile.slice(0, -1)}
                    index={2} 
                    height={height}
                    count={3}/>*/}
                
            </svg>
            
        </div>
    )
}