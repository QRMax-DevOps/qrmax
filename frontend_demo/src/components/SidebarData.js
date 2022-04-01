import React from 'react';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountsIcon from '@mui/icons-material/AddBusiness';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

export let SidebarData = [
    {
        id: 1,
        title: "Display Preview",
        icon: <DesktopWindowsIcon/>,
        link: "/homepage" //+ localStorage.getItem("params")
    },
    {
        id: 2,
        title: "Display Management",
        icon: <DisplaySettingsIcon/>,
        link: "/display_mngr" //+ localStorage.getItem("params")
    },
    {
        id: 3,
        title: "QR Settings",
        icon: <QrCodeIcon/>,
        link: "/media_mngr" //+ localStorage.getItem("params")
    },
	{
        id: 4,
        title: "Accounts Management",
        icon: <AccountsIcon/>,
        link: "/accounts"
    },
    {
        id: 5,
        title: "Interactions",
        icon: <QueryStatsIcon/>,
        link: "/interactions" //+ localStorage.getItem("params")
    },
    {
        id: 6,
        title: "Exit",
        icon: <LogoutIcon/>,
        link: "/login"
    }
] 