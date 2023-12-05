import React, { useState } from "react";

import Papa from "papaparse"
import styled from "styled-components"
import {Button, ButtonGroup, AnchorButton, FileInput, Popover, Intent} from "@blueprintjs/core"
import { TopNavBar } from "../components/TopNavBar";
import { ModeButtonGroup, NavGroup } from "../components/ModeButtonGroup";
import { FileList } from "../components/FileList";

const NavigationBar = styled.div`
    flex: 0;
    height: 50px;
    min-height: 50px;
    display: flex;
    
`;



const Gap = styled.div`
    flex: 1;
    min-width: 5px;
`;

const allowedExtentions = ["csv"];


export default function AnalyticsNavBar(props) {
    const [inputText, setInputText] = useState('Choose file...')
    

    const onInputChange = (e) => {
        if (e.target.files.length){
            const inputFile = e.target.files[0];
            const fileExtension = inputFile.type.split("/")[1];
            if(!allowedExtentions.includes(fileExtension)){
                setInputText("Wrong extention");
                return;
            }
            setInputText(e.target.files[0].name)
            
            Papa.parse(inputFile, {
                header: false,
                download: false,
                complete: (results) => {
                    const data = [];
                    //console.log(results)
                    for (let i=0; i < results.data.length-1; i++){
                        data.push({
                            date: new Date(results.data[i][0]),
                            datestr: results.data[i][0],
                            lat: parseFloat(results.data[i][1]),
                            lon: parseFloat(results.data[i][2]),
                            latf: parseFloat(results.data[i][3]),
                            lonf: parseFloat(results.data[i][4]),
                            dx: parseFloat(results.data[i][5]),
                            dy: parseFloat(results.data[i][6]),
                            dxf: parseFloat(results.data[i][7]),
                            dyf: parseFloat(results.data[i][8]),
                            v: parseFloat(results.data[i][9]),
                            vf: parseFloat(results.data[i][10]),
                            vn: parseFloat(results.data[i][11]),
                            ve: parseFloat(results.data[i][12]),
                            vnf: parseFloat(results.data[i][13]),
                            vef: parseFloat(results.data[i][14]),
                            ax: parseFloat(results.data[i][15]),
                            ay: parseFloat(results.data[i][16]),
                            az: parseFloat(results.data[i][17]),
                            an: parseFloat(results.data[i][18]),
                            ae: parseFloat(results.data[i][19]),
                            ad: parseFloat(results.data[i][20]),
                            roll: parseFloat(results.data[i][21]),
                            pitch: parseFloat(results.data[i][22]),
                            yaw: parseFloat(results.data[i][23]),
                            course: parseFloat(results.data[i][24]),
                            hacc: parseFloat(results.data[i][25]),
                            sacc: parseFloat(results.data[i][26]),
                            sat: parseInt(results.data[i][27]),
                            gyro: parseFloat(results.data[i][28])
                        })
                    }
                    console.log(data)
                    props.setDatafile(data);
                }
            })
        }
    }
    return(
        
            <NavigationBar className="navbar" >
                <TopNavBar/>
                <Gap/>
                <ModeButtonGroup onClick={props.setLeftBtn}/>
                <Gap/>
                <FileList file={props.datafile} setFile={props.setDatafile}/>
                <Gap />
                <NavGroup>
                    <FileInput text={inputText} onInputChange={onInputChange}/>
                </NavGroup>
                <Gap/>
                <ModeButtonGroup onClick={props.setRightBtn}/>
                <Gap/>
            </NavigationBar>
            
    );
}