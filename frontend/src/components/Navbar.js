import React from 'react';
import { AppBar, Toolbar, Typography } from "@material-ui/core"

const Navbar = () => {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h5">Bootcamp</Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
