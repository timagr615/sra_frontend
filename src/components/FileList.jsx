import { MenuDivider, Menu, MenuItem, Button, Intent } from "@blueprintjs/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components"
import { AuthContext, Logout } from "../contexts/AuthContext";
import { getFileApi, myDatafilesApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import {Select} from "@blueprintjs/select"
import Papa from "papaparse"


const ItemContainer = styled.div`
    margin-top: 10;
    margin-left: 10;
    margin-right: 10;
    padding: 10;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const filterFile = (query, file, _index, exactMatch) => {
    const normalizedTitle = file.created_at.toLowerCase()+file.sail_boat?.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${file.sail_boat? file.sail_boat : "~"}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
}

const renderFile = (file, {handleClick, handleFocus, modifiers, query}) => {
    if (!modifiers.matchesPredicate){
        console.log("no mod")
        return null;
    }
    return (
        <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={file.created_at}
        label={`${(file.file_size/1024).toFixed(1)} kB`}
        onClick={handleClick}
        onFocus={handleFocus}
        intent={Intent.PRIMARY}
        roleStructure="listoption"
        text={`${file.rank}. ${file.sail_boat ? file.sail_boat : "~"} ${file.date}`}
        />
    )
}

export const FileList = ({file, setFile}) => {
    const navigate = useNavigate();
    const {isAuthenticated } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    
    useEffect(() => {
        if (!selectedFile){
            return
        }
        const getFile = async () => {
            try{
                const f = await getFileApi(selectedFile.id)
                if (f.status == 200){
                    Papa.parse(
                        f.data, {
                            header: true,
                            download: false,
                            complete: (result) => {
                           
                                for (let i=0; i < result.data.length-1; i++){
                                    result.data[i]["datestr"] = result.data[i]["date"];
                                    result.data[i]["date"] = new Date(result.data[i]["date"]);
                                    result.data[i]["lat"] = parseFloat(result.data[i]["lat"]);
                                    result.data[i]["lon"] = parseFloat(result.data[i]["lon"]);
                                    result.data[i]["latf"] = parseFloat(result.data[i]["latf"]);
                                    result.data[i]["lonf"] = parseFloat(result.data[i]["lonf"]);
                                    result.data[i]["dx"] = parseFloat(result.data[i]["dx"]);
                                    result.data[i]["dy"] = parseFloat(result.data[i]["dy"]);
                                    result.data[i]["dxf"] = parseFloat(result.data[i]["dxf"]);
                                    result.data[i]["dyf"] = parseFloat(result.data[i]["dyf"]);
                                    result.data[i]["v"] = parseFloat(result.data[i]["v"]);
                                    result.data[i]["vf"] = parseFloat(result.data[i]["vf"]);
                                    result.data[i]["vn"] = parseFloat(result.data[i]["vn"]);
                                    result.data[i]["ve"] = parseFloat(result.data[i]["ve"]);
                                    result.data[i]["vnf"] = parseFloat(result.data[i]["vnf"]);
                                    result.data[i]["vef"] = parseFloat(result.data[i]["vef"]);
                                    result.data[i]["ax"] = parseFloat(result.data[i]["ax"]);
                                    result.data[i]["ay"] = parseFloat(result.data[i]["ay"]);
                                    result.data[i]["az"] = parseFloat(result.data[i]["az"]);
                                    result.data[i]["an"] = parseFloat(result.data[i]["an"]);
                                    result.data[i]["ae"] = parseFloat(result.data[i]["ae"]);
                                    result.data[i]["ad"] = parseFloat(result.data[i]["ad"]);
                                    result.data[i]["roll"] = parseFloat(result.data[i]["roll"]);
                                    result.data[i]["pitch"] = parseFloat(result.data[i]["pitch"]);
                                    result.data[i]["yaw"] = parseFloat(result.data[i]["yaw"]);
                                    result.data[i]["course"] = parseFloat(result.data[i]["course"]);
                                    result.data[i]["hacc"] = parseFloat(result.data[i]["hacc"]);
                                    result.data[i]["sacc"] = parseFloat(result.data[i]["sacc"]);
                                    result.data[i]["sat"] = parseFloat(result.data[i]["sat"]);
                                    result.data[i]["gyro"] = parseFloat(result.data[i]["gyro"]);
                                    result.data[i]["dist"] = parseFloat(result.data[i]["dist"]);
                                }
                                let filtered = result.data.filter(value => (value.latf != 0 && value.lonf != 0))
                                setFile(filtered)
                            }
                        }
                    )
                }
            } catch (e) {
                return;
            }
            
        }
        getFile();

        /*Papa.parse(
            `http://localhost:8002/datafile/filestream/${selectedFile.id}`, {
                header: true,
                download: true,
                complete: (result) => {
                    console.log(result)
                }
            }
            
        ) */
    }, [selectedFile])
    useEffect(() => {
        if (!isAuthenticated){
            navigate("/sign-in");
        }
        const fetchFiles = async () => {
            try{
                const fs = await myDatafilesApi();
                const f = fs.data;
                for (let i = 0; i < f.length; i++){
                    f[i]["date"] = (new Date(f[i].created_at)).toDateString()
                    f[i]["rank"] = i+1
                }
                
                setFiles(f);
            } catch (e) {
                
                setFiles([])
                if (e.response.status == 401){
                    Logout();
                    navigate("/sign-in")
                }
            }
        }
        fetchFiles();
    }, [])

    const getButtonText = () => {
        if (selectedFile){
            return `${selectedFile?.rank}. ${selectedFile?.sail_boat ?  selectedFile.sail_boat : "~"} ${selectedFile?.date}`
        } else {
            return "Select File"
        }
    }
    const onFileSelect = (e) => {
        if (e==selectedFile){
            return;
        } else {
            setFile([]);
            setSelectedFile(e);
        }
    }

    return (
        <Select
        style={{marginTop: 9}}
        items={files}
        itemPredicate={filterFile}
        itemRenderer={renderFile}
        noResults={<MenuItem disabled={true} text="No files" roleStructure="listoption"/>}
        onItemSelect={onFileSelect}>
            <Button
            fill={true}
            icon="database"
            intent={Intent.PRIMARY}
            style={{marginTop: 9}}
            text={getButtonText()}
            rightIcon="caret-down" placeholder="Select a file"/>
        </Select>
    )
}