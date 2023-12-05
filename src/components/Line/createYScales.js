import React, { useEffect, useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Axis } from "@visx/axis";
import { LinePath, Line } from "@visx/shape";
import { curveNatural, curveBasis, curveLinear,curveMonotoneX, curveCatmullRom } from "@visx/curve";
import { Text } from '@visx/text';
import {GlyphCircle, GlyphDot} from "@visx/glyph"
import { MARGINS } from "./LineChart";


export function createYscale(metric, datafile, index, height, count) {
    const minY = Math.min(...datafile.map((d)=>d[metric]))
    const maxY = Math.max(...datafile.map((d)=>d[metric]))
    const delta = (maxY-minY)/8;
    const interval = Math.floor((height-50) / count);
    const up = (maxY+delta).toFixed(2)
    const down = (minY-delta).toFixed(2)
    const scale = scaleLinear({round: true});
    const range = []
    if (index != count-1){
        range.push(interval*(index+1) - MARGINS.bottom, MARGINS.top+ interval*index)
    } else {
        range.push(interval*(index+1) - MARGINS.bottom, MARGINS.top+ interval*index)
        
    }
    //console.log(minY, maxY, [down, up], range, height)
    //scale.domain(extent(datafile, (d)=>(d[metric])))
    scale.domain([down, up]);
    scale.range(range)

    const minYScale = scale(minY)
    const maxYScale = scale(maxY)
    //console.log(minYScale, maxYScale)
    return [scale, minYScale, maxYScale, maxY, minY]
}

export function YLine({
    currentX,
    xscale, 
    metric, 
    datafile, 
    index, 
    height, 
    count, 
    lineWidth, 
    lineOpacity, 
    width,
    interpolation,
    point,
    sma,
    smaWindow
    }) {
        
    const [scale, minYScale, maxYScale, maxY, minY] = createYscale(metric, datafile, index, height, count);
    
    if(datafile.length == 0){
        return;
    }
    const currentY = scale(datafile[point==datafile.length? point-1 : point][metric])
    const smaData = []
    let smaCurrent = datafile[0][metric];
    
    if (sma){
        for (let i = 0; i < datafile.length-1; i++){
            const d = {}
            smaCurrent = (datafile[i][metric] - smaCurrent)*smaWindow + smaCurrent;
            d["date"] = datafile[i].date
            d[metric] = smaCurrent
            smaData.push(d)
        }

    }
    //console.log(sma, smaWindow, smaData)
        //console.log(tooltipData, tooltipTop, tooltipLeft)
    return (
        <>
        <Axis
        orientation="left"
        left={MARGINS.left}
        //top={MARGINS.bottom}
        scale={scale}
        numTicks={height/count/40}
        tickLabelProps={() => ({ fill: "#888888", fontSize: 12, textAnchor: "end", dy: 3, dx: -2 })}
        stroke="#888888"
        strokeWidth={1}
        tickStroke="#888888"
        />
        <LinePath
                data={datafile}
                y={d => scale(d[metric])}
                x={d => xscale(d['date'])}
                strokeWidth={lineWidth}
                strokeOpacity={lineOpacity}
                stroke={"#525252"}
                curve={interpolation ? curveMonotoneX : curveLinear}/>
        <LinePath
                data={smaData}
                y={d => scale(d[metric])}
                x={d => xscale(d['date'])}
                strokeWidth={1.8}
                //strokeOpacity={lineOpacity/10}
                stroke={"#f72585"}
                curve={curveBasis}/>
        <Line 
        stroke="#000000"
        strokeWidth={1}
        strokeDasharray="5,5"
        from={{
            x: MARGINS.left,
            y: minYScale
        }}
        to={{x: width - MARGINS.right, y: minYScale}}/>
        <Line 
        stroke="#000000"
        strokeWidth={1}
        strokeDasharray="5,5"
        from={{
            x: MARGINS.left,
            y: maxYScale
        }}
        to={{x: width - MARGINS.right, y: maxYScale}}/>
        <Line 
        stroke="#FF00FF"
        strokeWidth={2}
        strokeDasharray="5,5"
        from={{
            x: MARGINS.left,
            y: currentY
        }}
        to={{x: width - MARGINS.right-30, y: currentY}}/>
        <GlyphCircle
        left={currentX}
        top={currentY}
        size={2}
        stroke={"#ae3"}
        strokeWidth={8}/>
        <GlyphDot
        left={currentX}
        top={currentY}
        r={2}
        stroke={"#f72585"}
        strokeWidth={2}/>
        
        <Text 
            angle={270}
            x={25}
            y={(minYScale+maxYScale)/2}>
                {metric.toUpperCase()}
        </Text>
        <Text 
            fill="#525252"
            x={width/2}
            y={minYScale+15}>
                {`Min=${minY.toFixed(2)}`}
        </Text>
        <Text 
            fill="#525252"
            x={width/2}
            y={maxYScale-5}>
                {`Max=${maxY.toFixed(2)}`}
        </Text>
        <rect
            width="50"
            height="25"
            rx="2"
            x={width - MARGINS.right-42}
            y={currentY-15}
            style={{fill: "#ae3", strokeWidth: 1, stroke: "#000000"}} />
        <Text 
            
            x={width - MARGINS.right-40}
            y={currentY+2}>
                {datafile[point][metric].toFixed(2)}
        </Text>
        
        </>
    )
}

export function MetricLines({
    xscale, 
    currentX,
    datafile, 
    metricsCurrent, 
    height, 
    lineWidth,
    lineOpacity,
    width,
    interpolation,
    point,
    sma, 
    smaWindow}) {
    let count = 0;
    const metr = [];
    for (const [key, value] of Object.entries(metricsCurrent)) {
        if (value == 1){
            count += 1;
            metr.push(key);
        }
      }
      const linelist = []
      let i = 0;
      for (const [key, value] of Object.entries(metricsCurrent)) {
        //console.log(key, value)
        if(value==1){
            linelist.push(
                <YLine 
                    currentX={currentX}
                    xscale={xscale}
                    metric={key}
                    datafile={datafile}
                    index={i}
                    height={height}
                    count={count}
                    lineWidth={lineWidth}
                    lineOpacity={lineOpacity}
                    width={width}
                    interpolation={interpolation}
                    point={point}
                    sma={sma}
                    smaWindow={smaWindow}/>)
                    i +=1 
        }
        
      }
      //console.log(linelist)
    return (
        <>
        {linelist}
        </>
    )
}