import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components"
import AnalyticsNavBar from "./Header";
import Content from "./Content"
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext, AuthProvider, Logout } from "../contexts/AuthContext";
import { getMeApi } from "../services/api";
import { LineExample } from "../components/Line/LineExample";

const FullHeightContent = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
`;




export default function Analytics() {
    const [datafile, setDatafile] = useState([]);
    const [leftModeBtn, setLeftModeBtn] = useState("map");
    const [rightModeBtn, setRightModeBtn] = useState("line");

    const {isAuthenticated}  = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        //console.log(isAuthenticated)
        if (!isAuthenticated){
            navigate("sign-in")
        } else {
            const me = async () => {
                try{
                    const me = await getMeApi();
                } catch (e) {
                    console.log(e)
                    if (e.message == "Network Error" || e.response.status == 401){
                        Logout();
                        navigate("/sign-in")
                    }
                }
                
            }
            me();
        }
        
    }, [isAuthenticated])
    
    return (
        <FullHeightContent>
            <AnalyticsNavBar 
                datafile={datafile} 
                setDatafile={setDatafile}
                leftBtn={leftModeBtn}
                setLeftBtn={setLeftModeBtn}
                rightBtn={rightModeBtn}
                setRightBtn={setRightModeBtn}
            />
            {datafile.length > 0 ? 
                <Content datafile={datafile} leftMode={leftModeBtn} rightMode={rightModeBtn}/>
                :
                <LineExample/>    
                }
            
        </FullHeightContent>
    );
}