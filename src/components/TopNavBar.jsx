import React from "react";

import {Navbar, Popover, Icon, Alignment, Colors, Button} from "@blueprintjs/core"
import { TopChoiceMenu } from "./TopChoiceMenu";

export function TopNavBar () {

    return (
        <Navbar style={{maxWidth: "300px", borderBottom: 0, boxShadow: '0 0 0 0 rgb(17 20 24 / 10%), 0 0 0 0 rgb(17 20 24 / 20%)'}}>
            <Navbar.Group align={Alignment.LEFT}>
                <Icon style={{marginLeft: 10}} icon={"hurricane"} size={35} color={Colors.GRAY2} />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Popover content={<TopChoiceMenu/>} fill={true} placement="bottom">
                    <Button
                            alignText="left"
                            fill={true}
                            icon="user"
                            rightIcon="caret-down"
                            text="Account"
                        />
                </Popover>
            </Navbar.Group>
        </Navbar>
);
}