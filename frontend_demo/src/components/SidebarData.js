import React from 'react';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

export const SidebarData = [
    {
        id: 1,
        title: "Display Preview",
        icon: <DesktopWindowsIcon/>,
        link: "/homepage"
    },
    {
        id: 2,
        title: "Display Management",
        icon: <DisplaySettingsIcon/>,
        link: "/homepage"
    },
    {
        id: 3,
        title: "QR Settings",
        icon: <QrCodeIcon/>,
        link: "/gen_qr"
    },
    {
        id: 4,
        title: "Interactions",
        icon: <QueryStatsIcon/>,
        link: "/interactions"
    },
    {
        id: 5,
        title: "Exit",
        icon: <LogoutIcon/>,
        link: "/login"
    }
] 