import React from 'react';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

export const SidebarData = [
    {
        title: "Display Preview",
        icon: <DesktopWindowsIcon/>,
        link: "/Homepage"
    },
    {
        title: "Display Management",
        icon: <DisplaySettingsIcon/>,
        link: "/Homepage"
    },
    {
        title: "QR Settings",
        icon: <QrCodeIcon/>,
        link: "/gen_qr"
    },
    {
        title: "Interactions",
        icon: <QueryStatsIcon/>,
        link: "/Homepage"
    },
    {
        title: "Exit",
        icon: <LogoutIcon/>,
        link: "/login"
    }
] 