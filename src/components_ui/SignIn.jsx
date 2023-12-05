import React, { useContext, useState } from "react";
import styled from "styled-components"

import useResizeObserver from "use-resize-observer"
import validator from 'validator';

import {Button, Callout, Card, Divider, Elevation, FormGroup, InputGroup, Intent, Tooltip } from "@blueprintjs/core"
import { loginApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


/*const FullHeightContent = styled.div`
height: 100%;
width: 100%;
position: relative;
display: flex;
flex-direction: column;
`;*/

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




export const SignIn = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const { ref, width = 300, height = 300 } = useResizeObserver({
        round: (n) => Math.floor(n),
    });

    const [username, setUsername] = useState(null);
    const [usernameHelper, setUsernameHelper] = useState("");
    const [password, setPassword] = useState(null);
    const [passwordHelper, setPasswordHelper] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorLogin, setErrorLogin] = useState(null);
    const navigate = useNavigate();
    const onLockClick = () => {
        setShowPassword(!showPassword);
    }

    const lockButton = (
        <Tooltip content={`${showPassword ? "Hide": "Show"} Password`} >
            <Button
                icon={showPassword ? "unlock": "lock"}
                intent={Intent.WARNING}
                minimal={true}
                onClick={onLockClick}
            />
        </Tooltip>
    )

    

    const onUsernameChange = (e) => {
        setUsername(e);
    }

    const onPasswordChange = (e) => {
        setPassword(e);
    }

    const onLoginClick = async (event) => {
        if (event){
            event.preventDefault();
        }
        if (username == "") {
            setUsernameHelper("Enter the Email");
            return;
        }
        if(!validator.isEmail(username)){
            setUsernameHelper("Enter Valid Email");
            return;
        }
        setErrorLogin(null)
        if (password == ""){
            setPasswordHelper("Enter the password")
            return;
        }
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);
        
        try {
            let res = await loginApi({
                username: data.get("username"),
                password: data.get("password")
              });
            if (res.data.detail) {
                setErrorLogin(res.detail)
            }
            if (res.data.access_token){
                localStorage.setItem('token', res.data.access_token);
                setIsAuthenticated(true);
                //console.log(isAuthenticated);
                navigate("/")
            }
        } catch (e){
            setErrorLogin(e.code)
        } 
    }

    const onRegistrationClick = () => {
        navigate("/registration");
    }
    
    return (
        <FullHeightContent ref={ref}>
            
            
           
            <Card interactive={false} elevation={Elevation.FOUR}
                style={{width: width < 350 ? 200: 300}}>
                    <h2
                    
                    style={{
                        marginLeft: 20,
                        color: "#888888"
                    }}>Sign In</h2>
                    {errorLogin && <Callout 
                    intent={Intent.DANGER}
                    title={errorLogin}/>}
                    <Divider/>
                <FormGroup 
                    helperText={usernameHelper}
                    label="Email"
                    labelFor="text-input"
                    labelInfo="(required)"
                    
                >
                    <InputGroup id="text-input" placeholder="email" onValueChange={onUsernameChange}/>
                </FormGroup>

                <FormGroup 
                    helperText={passwordHelper}
                    label="Password"
                    labelFor="text-input"
                    labelInfo="(required)"
                    
                >
                    <InputGroup 
                    id="text-input" 
                    placeholder="password" 
                    rightElement={lockButton}
                    type={showPassword ? "text": "password"}
                    onValueChange={onPasswordChange}/>
                </FormGroup>
                <Button
                style={{marginBottom: 10}}
                icon="log-in" 
                text="Sign In" 
                intent="primary"
                onClick={onLoginClick}/>
                <Divider />
                <p>Do not have account? 
                    
                </p>
                <Button text="Registration"
                onClick={onRegistrationClick}/>
            </Card>
            
            
            
        </FullHeightContent>
    )
}