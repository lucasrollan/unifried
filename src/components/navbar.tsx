import { Alignment, Button, Navbar } from "@blueprintjs/core";
import UserMenu from "./userMenu";

export default function NavBar() {
    return (<Navbar>
        <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>Parkers</Navbar.Heading>
            <Navbar.Divider />
            <Button className="bp5-minimal" icon="home" text="Home" />
            <Button className="bp5-minimal" icon="document" text="Files" />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
            <UserMenu />
        </Navbar.Group>
    </Navbar>)
}