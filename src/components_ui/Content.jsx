import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components"
import SplitPane from "react-split-pane"

import useResizeObserver from "use-resize-observer";
import { LineChartMenu } from "../components/LineChartMenu";
import { MapView } from "../components/Map/MapView";
import { LineChart } from "../components/Line/LineChart";


import { Intent, MultiSlider } from "@blueprintjs/core";
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

/*const ContentRowLeft = styled.div`
flex: 1 1 0%;
position: relative;
outline: none;
resize: both;
overflow: auto;
min-width: 0;
`;

const ContentRowRight = styled.div`
flex: 1 1 0%;
position: relative;
outline: none;
scroll-behavior: smooth;
resize: both;
overflow: auto;
min-width: 0;
`;*/

export default function Content({datafile, leftMode, rightMode}) {
    const { ref, width = 1, height = 1 } = useResizeObserver({
        round: (n) => Math.floor(n),
    });
    const [metrics, setMetrics] = useState([]);
    const [metricsCurrent, setMetricsCurrent] = useState({});
    const [range, setRange] = useState([0,1])
    const [fileLen, setfileLen] = useState(1);

    useEffect(() => {
        setRange([0, datafile.length>0?datafile.length-1:0]);
        setfileLen(datafile.length-1);
    }, [datafile]);
    
    const [point, setPoint] = useState(0);
    const [lineWidth, setLineWidth] = useState(1.4);
    const [lineOpacity, setLineOpacity] = useState(1);
    const [sizeLeft, setSizeLeft] = useState(Math.floor(width/2)-2 < 0? 200: Math.floor(width/2)-2);
    const [interpolation, setInterpolation] = useState(false);
    const [sma, setSma] = useState(false);
    const [smaWindow, setSmaWindow] = useState(0.7);

    const [sliderMin, setSliderMin] = useState(0);
    const [sliderMax, setSliderMax] = useState(datafile.length ? datafile.length-1 : 100);
    const [sliderMinValue, setSliderMinValue] = useState(0);
    const [sliderMidValue, setSliderMidValue] = useState(datafile.length ? datafile.length/2 : 100);
    const [sliderMaxValue, setSliderMaxValue] = useState(datafile.length ? datafile.length-1 : 100);

    
            
        useEffect(()=>{
            if (fileLen > 2){
            setSliderMax(fileLen);
            setSliderMidValue(fileLen/2);
            setSliderMaxValue(fileLen);}
            else{
                setSliderMax(0);
                setSliderMidValue(sliderMax/2);
                setSliderMaxValue(sliderMax); 
            }
        }, [fileLen])


    const onSplitChange = (size) => {
        const s = Math.floor(size) + 2;
        setSizeLeft(s < 100 ? 100 : s);
        //console.log(sizeLeft)
    }

    useEffect(() => {
        const s = width/2 > 200? width/2-2 : 200
        setSizeLeft(s)
    }, [width])
    

    useEffect(() => {
        if( datafile.length > 0){
            const metr = {}
            //console.log(Object.keys(datafile[0]))
            Object.keys(datafile[0]).forEach((key) => {
                if (key != "date"){
                    if (key != "datestr"){
                        metr[key] = 0;
                    }
                    
                }
                
            })
            setMetricsCurrent(metr);
            setMetrics(Object.keys(datafile[0]).slice(2))
            setPoint(0)
        }
    }, [datafile])

    /*useEffect(()=>{
        setPoint(Math.floor((sliderMaxValue-sliderMinValue)/2));
    }, [sliderMidValue, sliderMinValue, sliderMaxValue])*/
    //console.log(datafile.length, range, fileLen)
    const sliderCenterValue = (e) => {
        let minmax = Math.floor((sliderMaxValue - sliderMinValue)/2);
        let min = (e - minmax) > 0 ? e - minmax : 0;
        let max = (e + minmax) < sliderMax ? e + minmax: sliderMax;
        if (max - min < 5){
            max = min+5;
        }
        if (max == 0){
            max = 1;
        }
        if(min < 0){
            min = 0;
        }
        
        setSliderMidValue(e);
        setSliderMaxValue(max);
        setSliderMinValue(min);
        setRange([sliderMinValue, sliderMaxValue]);
        setPoint(0);
    }
    const sliderValue = (e) => {
        //console.log(fileLen, sliderMin, sliderMax, sliderMinValue, sliderMidValue, sliderMaxValue, point)
        setSliderMaxValue(e[2]);
        setSliderMinValue(e[0]);
        setSliderMidValue(Math.floor((e[0]+e[2])/2));
        setRange([sliderMinValue, sliderMaxValue]);
        setPoint(0)
    }
    //console.log(metricsCurrent)

    return (
        <FullHeightContent>
        <AnalyticsContent ref={ref}>
            <SplitPane defaultSize={'50%'} onChange={onSplitChange}>
                <div style={{width: sizeLeft}}>
                    {leftMode == "map" ? 
                        <MapView 
                            mapwidth={sizeLeft} 
                            mapheight={height} 
                            datafile={datafile.slice(range[0], range[1])} 
                            range={range}
                            point={point}
                            setPoint={setPoint}/>
                    :
                        <div>
                            <LineChart 
                                width={sizeLeft} 
                                height={height-80}
                                datafile={datafile.slice(range[0], range[1])}
                                metricsCurrent={metricsCurrent}
                                lineWidth={lineWidth}
                                lineOpacity={lineOpacity}
                                point={point}
                                setPoint={setPoint}
                                interpolation={interpolation}
                                range={range}
                                setRange={setRange}
                                fileLen={fileLen}
                                sma={sma}
                                smaWindow={smaWindow}
                            />
                        <SliderContainer>
                            <MultiSlider labelRenderer={false} min={sliderMin} max={sliderMax} stepSize={1} onChange={sliderValue}>
                                <MultiSlider.Handle intentAfter={Intent.PRIMARY} value={sliderMinValue} type="start"/>
                                <MultiSlider.Handle value={sliderMidValue} type="full" onChange={sliderCenterValue} />
                                <MultiSlider.Handle intentBefore={Intent.PRIMARY} value={sliderMaxValue} type="end" />
                            </MultiSlider>
                        </SliderContainer>
                        <LineChartMenu 
                            width={200} 
                            metrics={metrics}
                            metricsCurrent={metricsCurrent}
                            setMetricsCurrent={setMetricsCurrent}
                            lineWidth={lineWidth}
                            setLineWidth={setLineWidth}
                            lineOpacity={lineOpacity}
                            setLineOpacity={setLineOpacity}
                            interpolation={interpolation}
                            setInterpolation={setInterpolation}
                            sma={sma}
                            setSma={setSma}
                            smaWindow={smaWindow}
                            setSmaWindow={setSmaWindow}
                            />
                        </div>
                    }
                </div>
            
                <div style={{width: width - sizeLeft}}>
                    {rightMode == "map" ? 
                        <MapView 
                            mapwidth={width - sizeLeft} 
                            mapheight={height} 
                            datafile={datafile.slice(range[0], range[1])} 
                            range={range}
                            point={point}
                            setPoint={setPoint}/>
                    :
                        <div>
                            <LineChart 
                                width={width - sizeLeft-2} 
                                height={height-80}
                                datafile={datafile.slice(range[0], range[1])}
                                metricsCurrent={metricsCurrent}
                                lineWidth={lineWidth}
                                lineOpacity={lineOpacity}
                                point={point}
                                setPoint={setPoint}
                                interpolation={interpolation}
                                range={range}
                                setRange={setRange}
                                fileLen={fileLen}
                                sma={sma}
                                smaWindow={smaWindow}
                            />
                        <SliderContainer style={{width: width-sizeLeft}}>
                            <MultiSlider labelRenderer={false} min={sliderMin} max={sliderMax} stepSize={1} onChange={sliderValue}>
                                <MultiSlider.Handle intentAfter={Intent.PRIMARY} value={sliderMinValue} type="start"/>
                                <MultiSlider.Handle value={sliderMidValue} type="full" onChange={sliderCenterValue} />
                                <MultiSlider.Handle intentBefore={Intent.PRIMARY} value={sliderMaxValue} type="end" />
                            </MultiSlider>
                        </SliderContainer>
                        <LineChartMenu 
                            width={200} 
                            metrics={metrics}
                            metricsCurrent={metricsCurrent}
                            setMetricsCurrent={setMetricsCurrent}
                            lineWidth={lineWidth}
                            setLineWidth={setLineWidth}
                            lineOpacity={lineOpacity}
                            setLineOpacity={setLineOpacity}
                            interpolation={interpolation}
                            setInterpolation={setInterpolation}
                            sma={sma}
                            setSma={setSma}
                            smaWindow={smaWindow}
                            setSmaWindow={setSmaWindow}
                            />
                        </div>
                    }
                </div>
           
            </SplitPane>
            
        </AnalyticsContent>
        </FullHeightContent>
    );
}