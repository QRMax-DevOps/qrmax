import React from 'react';
import Button from 'react-bootstrap/Button';
import './Sidebar.css';
import {SidebarData} from './SidebarData';
import {Link} from 'react-router-dom';

//import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
    return(
        <div class="sidebar">
            <div>
                <h6 class="SidebarTitle">Dashboard</h6>
            </div>
            <br/>
            <div class="ListContainer">
                <ul class="SidebarList">
                    {SidebarData.map((val, key) => {
                        return (
                            <div>
                                <li id="row" key={key}>
                                    <Link to={val.link}>
                                        <p class="navIcon">{val.icon}</p>
                                        <p class="navTitle">{val.title}</p>
                                    </Link>
                                </li>
                            </div>
                            );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;