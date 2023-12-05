import React, { useState} from "react";
import useResizeObserver from "use-resize-observer";
import styled from "styled-components"
import validator from "validator"
import { Tooltip, Button, Intent, Card, Elevation, Divider, FormGroup, InputGroup, Callout } from "@blueprintjs/core";
import { registrationApi } from "../services/api";
import { useNavigate } from "react-router-dom";

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

export const Registration = () => {
    const { ref, width=300, height=300 } = useResizeObserver({
        round: n => Math.floor(n),
    })
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);

    const [helperEmail, setHelperEmail] = useState(null);
    const [helperUsername, setHelperUsername] = useState(null);
    const [helperPassword, setHelperPassword] = useState(null);
    const [helperPassword2, setHelperPassword2] = useState(null);

    const [error, setError] = useState(null);
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

    const onRegistrationClick = async (event) => {
        if (event){
            event.preventDefault();
        }
        if (username == ""){
            setHelperUsername("Enter username");
        }

        if (email == ""){
            setHelperEmail("Enter email")
        }
        if (email != null){
            if (!validator.isEmail(email)){
                setHelperEmail("Enter Valid Email");
            }
            
        }

        if (password == "") {
            setHelperPassword("Enter password")
        }
        if (password2 == ""){
            setHelperPassword2("Enter password confirmation");
        }
        if ( password2 != password){
            setHelperPassword2("Passwords don't match");
        }

        if (helperEmail != null || helperPassword || helperPassword2 || helperUsername){
            return;
        }

        const regData = new FormData();
        regData.append("email", email);
        regData.append("username", username);
        regData.append("password", password);
        try {
            let res = await registrationApi({
                email: regData.get("email"),
                username: regData.get("username"),
                password: regData.get("password"),
            })
            console.log(res)
            if (res.data.detail){
                setError(res.data.detail);
                console.log(res.data)
            }

            if (res.data.email == email){
                console.log(res.data)
                navigate("/sign-in");
            }
        } catch (e) {
            if (e.response.data.detail){
                setError(e.response.data.detail)
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
                        Registration
                    </h2>
                    {error && <Callout 
                    intent={Intent.DANGER}
                    title={error}/>}
                    <Divider/>
                <FormGroup 
                    helperText={helperEmail}
                    label="Email"
                    labelFor="text-input"
                    labelInfo="  *required"
                    
                >
                    <InputGroup 
                    id="text-input" 
                    placeholder="email"
                    onValueChange={(e) => setEmail(e)} 
                   />
                </FormGroup>

                <FormGroup 
                    helperText={helperUsername}
                    label="Username"
                    labelFor="text-input" 
                    labelInfo="  *required"
                >
                    <InputGroup 
                    id="text-input" 
                    placeholder="username" 
                    onValueChange={(e) => setUsername(e)}
                   />
                </FormGroup>
                

                <FormGroup 
                    helperText={helperPassword}
                    label="Password"
                    labelFor="text-input"
                    labelInfo="*required"
                    
                >
                    <InputGroup 
                    id="text-input" 
                    placeholder="password" 
                    rightElement={lockButton}
                    type={showPassword ? "text": "password"}
                    onValueChange={(e) => setPassword(e)}
                    />
                </FormGroup>

                <FormGroup 
                    helperText={helperPassword2}
                    label="Repeat password"
                    labelFor="text-input" 
                    
                >
                    <InputGroup 
                    id="text-input" 
                    placeholder="password" 
                    rightElement={lockButton}
                    type={showPassword ? "text": "password"}
                    onValueChange={(e) => {setPassword2(e)}}
                   />
                </FormGroup>

                

                
                <Button
                style={{marginBottom: 10}}
                icon="log-in" 
                text="Register" 
                intent="primary"
                onClick={onRegistrationClick}
                />
            </Card>
        </FullHeightContent>
    )
}