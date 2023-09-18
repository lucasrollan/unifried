import { Button, Classes, Menu, MenuItem, Popover } from "@blueprintjs/core";
import { useSession, signOut } from 'next-auth/react';
import styles from './userMenu.module.css'

export default function UserMenu() {
    // popover content gets no padding by default; add the "bp5-popover-content-sizing"
    // class to the popover to set nice padding between its border and content.
    const { data, status } = useSession();

    return (
        <Popover
            minimal
            usePortal={false}
            interactionKind="click"
            // popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            placement="bottom"
            content={
                <DropdownMenu />
            }
            renderTarget={({ isOpen, ...targetProps }) => (
                <Button {...targetProps} minimal>
                    <img className={styles.userProfilePicture} src={data?.user?.image || undefined} />
                </Button>
            )}
        />
    );
}

function DropdownMenu() {
    const { data, status } = useSession();

    return (<div>
        <h3>{data!.user!.name}</h3>
        <Menu>
            <MenuItem className={Classes.POPOVER_DISMISS} icon="log-out" onClick={() => signOut()} text="Log out" />
        </Menu>
    </div>)
}