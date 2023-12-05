import React, { useEffect, useState } from "react";
import { Navbar, Button, Checkbox, Classes, Alignment, Popover, Menu, MenuItem, MenuDivider, NumericInput, Slider } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styled from "styled-components"
import { ChromePicker, SketchPicker } from "react-color"

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const ItemContainer = styled.div`
    margin-top: 10;
    margin-left: 10;
    margin-right: 10;
    padding: 10;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const values = ['wefwfe', 'weffwfe']

export function MetricsListMenu({metrics, metricsCurrent, setMetricsCurrent}) {
    const onSelectedMetricsChange = (item, value) => {
        const m = {};
        Object.assign(m, metricsCurrent);
        if (value == 0){
            m[item] = 0;
        } else {
            m[item] = 1;
        }
        //console.log(m);
        //console.log(metricsCurrent)
        setMetricsCurrent(m);
    }

    
    return (
        
        <Menu style={{ overflowY: "auto"}}>
            {"Line chart metrics"}
            <MenuDivider/>
            {metrics.length > 0 ? (
                metrics.map((item, i) => (
                    <ItemContainer key={item}>
                        <Checkbox
                            className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                            label={<span title={item}>{item}</span>}
                            style={{ marginBottom: 3, marginTop: 3 }}
                            checked={metricsCurrent[item]== 1? true : false}
                            onChange={e => {
                                if (e.currentTarget.checked){
                                    onSelectedMetricsChange(item, 1)
                                } else {
                                    onSelectedMetricsChange(item, 0)
                                }
                            }}
                            />
                    </ItemContainer>
                    
                ))
            ) : (
                <MenuItem text="No results found" />
            )}
            

        </Menu>
        
    )
}

export function LineSettingsMenu({ 
    lineWidth,
    setLineWidth,
    lineOpacity,
    setLineOpacity,
    interpolation,
    setInterpolation,
    sma, 
    setSma,
    smaWindow,
    setSmaWindow, 
}) {

    const onStrokeWidthChange = (e) => {
        setLineWidth(e);
    }
    const onStrokeOpacityChange = (e) => {
        setLineOpacity(e)
    }
    const onInterpolateChange = () => {
        setInterpolation(!interpolation);
    }
    const onSmaSliderChange = (e) => {
        setSmaWindow(e)
    }
    const onSmaChange = () => {
        setSma(!sma)
    }

    return (
        <Menu style={{overflowY: "auto", width: 250, padding: 20}}>
            {"Line Settings"}
            <MenuDivider/>
            <ItemContainer >
                <div style={{width: 50}}>
            <Slider  style={{margin: 10}} 
                min={0.5} 
                max={3} 
                stepSize={0.1} 
                onChange={onStrokeWidthChange}
                value={lineWidth}
                labelStepSize={0.5}>

                </Slider>
                </div>
                <div >Width</div>
            </ItemContainer>
            <ItemContainer style={{marginTop: 5}}>
            <div style={{width: 50}}>
            <Slider  style={{margin: 10}} 
                min={0.1} 
                max={1} 
                stepSize={0.05} 
                onChange={onStrokeOpacityChange}
                value={lineOpacity}
                labelStepSize={0.2}>

                </Slider>
                </div>
                
                <div >Opacity</div>
            </ItemContainer>
            <ItemContainer>
            <Checkbox
                    style={{marginLeft: 10, marginTop: 10}}
                    onChange={onInterpolateChange} 
                    checked={interpolation}
                    label="Interpolate"/>
            </ItemContainer>
            <ItemContainer>
            <Checkbox
                    style={{marginLeft: 10, marginTop: 10}}
                    onChange={onSmaChange} 
                    checked={sma}
                    label="SMA"/>
            </ItemContainer>
            <ItemContainer >
                <div hidden={!sma} style={{marginLeft: 10}}>
                <Slider  style={{margin: 10}} 
                min={0.01} 
                max={1} 
                stepSize={0.01} 
                onChange={onSmaSliderChange}
                value={smaWindow}
                labelStepSize={0.2}>

                </Slider>
                </div>
            </ItemContainer>
        </Menu>
    )
}

export function LineChartMenu({
    width=250, 
    metrics, 
    metricsCurrent, 
    setMetricsCurrent, 
    lineWidth, 
    setLineWidth,
    lineOpacity,
    setLineOpacity,
    interpolation,
    setInterpolation,
    sma,
    setSma,
    smaWindow,
    setSmaWindow,
}) {
    //console.log(metrics)
    
    return (
        <div className={Classes.NAVBAR}>
            <Navbar.Group align={Alignment.LEFT} style={{width: '100%'}}>
                <Popover content={
                                    <MetricsListMenu 
                                        metrics={metrics} 
                                        metricsCurrent={metricsCurrent}
                                        setMetricsCurrent={setMetricsCurrent}
                                    />
                                } 
                            placement="top">
                <Button style={{maxWidth: width - 50}} icon={IconNames.Plus}>
                    <div style={{maxWidth: width - 235}} className={Classes.TEXT_OVERFLOW_ELLIPSIS}>
                        Add metrics
                    </div>
                </Button>
                </Popover>
                <Popover style={{maxWidth: 100, padding: 20}} content={<LineSettingsMenu
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
                                    />} placement="top">
                <Button style={{marginLeft: 10, maxWidth: width - 50}} icon={IconNames.Settings}>
                    <div style={{maxWidth: width - 235}} className={Classes.TEXT_OVERFLOW_ELLIPSIS}>
                        Line settings
                    </div>
                </Button>
                </Popover>
                
            </Navbar.Group>
        </div>
    );
}