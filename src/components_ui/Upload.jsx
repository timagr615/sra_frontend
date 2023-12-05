import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Card, InputGroup, FormGroup, Divider, Callout, Button, Elevation, Intent, HTMLSelect, TextArea, FileInput } from "@blueprintjs/core";
import useResizeObserver from "use-resize-observer";
import { uploadFileApi } from "../services/api";

const FullHeightContent = styled.div`
width: 100%;
height: 100%;
position: fixed;
top: 0;
left: 0;
display: flex;
align-items: center;
align-content: center;
justify-content: center;
overflow: auto;
`;

const SUPPORTED_BOATS = ["470", "ILCA"];
const allowedExtentions = ["csv"];

export const Upload = () => {
    const { ref, width = 300, height = 30} = useResizeObserver({
        round: n => Math.floor(n),
    })
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [boat, setBoat] = useState("470");
    const [helperBoat, setHelperBoat] = useState(null);
    const [wind, setWind] = useState("0-4 kt");
    const [helperWind, setHelperWind] = useState(null);
    const [desciption, setDescription] = useState("");
    const [helperDescription, setHelperDescription] = useState(null);
    const [notes, setNotes] = useState("");
    const [helperNotes, setHelperNotes] = useState(null);
    const [fileName, setFileName] = useState("Choose file...");
    const [helperFile, setHelperFile] = useState(null);

    const [file, setFile] = useState(null);

    useEffect(() => {
        if(!isAuthenticated){
            navigate("/sign-in");
        }
    }, [isAuthenticated])

    const onBoatChange = (e) => {
        console.log(e.currentTarget.value)
    }
    
    const onFileChange = (e) => {
        console.log(e.target.files)
        if (e.target.files.length){
            const inputFile = e.target.files[0];
            const fileExtension = inputFile.type.split("/")[1];
            if(!allowedExtentions.includes(fileExtension)){
                setFileName("Wrong extention");
                return;
            }
            setFileName(e.target.files[0].name)
            setFile(e.target.files[0])
        }
    }

    const onUploadClick = async () => {
        const formFileData = new FormData();
        formFileData.append('sail_boat', boat);
        formFileData.append('wind_speed', wind);
        formFileData.append('description', desciption);
        formFileData.append('notes', notes);
        const formFile = new FormData();
        formFile.append('file', file);
        try {
            const res = await uploadFileApi(formFile, {
                sail_boat: formFileData.get("sail_boat"),
                wind_speed: formFileData.get("wind_speed"),
                description: formFileData.get('description'),
                notes: formFileData.get("notes")
            })
            console.log(res)

            if (res.data.detail){
                if (typeof(res.data.detail)!=String){
                    setError(res.data.detail[0].msg);
                    return;
                } else {
                    setError(res.data.detail);
                }
            }
            

            if (res.data.sail_boat == boat){
                navigate("/");
            }
        } catch (e) {
            if (e.response.data.detail){
                if (typeof(e.response.data.detail) == String){
                    setError(e.response.data.detail)
                } else {
                    setError(e.response.data.detail[0].msg)
                }
                
            } else {
                setError(`Error status ${e.response.status}`)
            }
        }
        
    }

    return (
        <FullHeightContent ref={ref}>
            <Card 
                interactive={false} 
                elevation={Elevation.FOUR}
                style={{width: width < 350 ? 200: 300}}>
                    <h2
                    style={{
                        marginLeft: 20,
                        color: "#888888"
                    }}>
                        Upload datafile
                    </h2>
                    {error && <Callout 
                    intent={Intent.DANGER}
                    title={error}/>}
                    <Divider/>
                <FormGroup 
                    helperText={helperBoat}
                    label="Boat class"
                    labelFor="text-input"
                    labelInfo="  *required"
                >
                    <HTMLSelect 
                    placeholder="Choose boat class"
                    options={SUPPORTED_BOATS}
                    onChange={onBoatChange}/>

                </FormGroup>
                
                <FormGroup 
                    helperText={helperWind}
                    label="Wind speed"
                    labelFor="text-input"
                    labelInfo="  *required"
                    
                >
                    <InputGroup 
                    id="text-input" 
                    placeholder="10-12 kt"
                    onValueChange={(e) => setWind(e)} 
                   />
                </FormGroup>
                <FormGroup
                    helperText={helperDescription}
                    label="Description"
                    labelFor="text-input"
                    labelInfo="*required">
                        <TextArea
                        id="text-input"
                        autoResize={true}
                        placeholder="Description"
                        onChange={e => setDescription(e.currentTarget.value)} />
                </FormGroup>

                <FormGroup
                    helperText={helperNotes}
                    label="Notes"
                    labelFor="text-input"
                    labelInfo="*required">
                        <TextArea
                        id="text-input"
                        autoResize={true}
                        placeholder="Notes"
                        onChange={e => setNotes(e.currentTarget.value)} />
                </FormGroup>
                <FormGroup
                    helperText={helperFile}
                    label="File"
                    labelFor="text-input"
                    labelInfo="*required">
                        <FileInput
                        fill={true}
                        text={fileName}
                        onInputChange={onFileChange} />
                </FormGroup>
                <Divider />
                <Button 
                style={{marginTop: 10}}
                icon="upload" 
                text="Upload" 
                intent={Intent.SUCCESS}
                onClick={onUploadClick}
                />
            </Card>
        </FullHeightContent>
        
    )
}