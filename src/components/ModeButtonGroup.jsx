import React from "react";
import styled from "styled-components"

import { ButtonGroup, Button, AnchorButton } from "@blueprintjs/core";

export const NavGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    gap: 5px;
`;

export const ModeButtonGroup = (props) => {

    const onMapClick = () => {
        props.onClick("map")
    }
    const onLineClick = () => {
        props.onClick("line")
    }
    return (
        <NavGroup>
            <ButtonGroup minimal={false} >
                <Button className="topGlobeBtn" icon="globe-network" onClick={onMapClick}></Button>
                <Button icon="timeline-line-chart" onClick={onLineClick}></Button>
                <AnchorButton rightIcon="caret-down"></AnchorButton>
            </ButtonGroup>
        </NavGroup>
    );
}