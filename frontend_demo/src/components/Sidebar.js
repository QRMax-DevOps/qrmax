import React from 'react';
import Button from 'react-bootstrap/Button';
import './Sidebar.css';
import {SidebarData} from './SidebarData';
import {Link} from 'react-router-dom';

//import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
    return(
        <div className="sidebar">
            <div>
                <h6 className="SidebarTitle">Dashboard</h6>
            </div>
            <br/>
            <div className="ListContainer">
                <ul className="SidebarList">
                    {SidebarData.map((val, key) => {
                        return (
                                <li id="row" key={key}>
                                    <Link to={val.link}>
                                        <p className="navIcon">{val.icon}</p>
                                        <p className="navTitle">{val.title}</p>
                                    </Link>
                                </li>
                            );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;