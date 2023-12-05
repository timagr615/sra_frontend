import React, { useContext } from "react";
import {Menu, MenuItem, MenuDivider, Intent} from "@blueprintjs/core"
import { AuthContext, Logout } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { myDatafilesApi } from "../services/api";

export function TopChoiceMenu() {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogoutClick = () => {
        Logout();
        navigate("/sign-in");
    }

    const onUploadClick = () => {
        navigate("/upload")
    }

    const onFilesClick = async () => {
        const res = await myDatafilesApi();
        console.log(res.data)
    }
    return (
    <Menu>
        
        
        {isAuthenticated ? 
        <>
        <MenuItem icon="upload" text="Upload file" intent={Intent.SUCCESS} onClick={onUploadClick}/>
        <MenuItem icon="folder-open" text="Files"  onClick={onFilesClick}/>
        <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
        <MenuItem icon="zoom-to-fit" text="Browser" disabled={true} />
        <MenuDivider />
        <MenuItem icon="log-out" text="Log out" onClick={onLogoutClick}/>
        </>
        : 
        <MenuItem icon="log-in" text="Sign In" />}
            
        
    </Menu>
    );
};