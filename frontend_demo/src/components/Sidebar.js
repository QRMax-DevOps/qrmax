import React from 'react';
import Button from 'react-bootstrap/Button';
import './Sidebar.css';
import {SidebarData} from './SidebarData';
import {Link} from 'react-router-dom';

//import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
	
	let sidebarInfo = SidebarData;
	
	for(var i = 0; i < sidebarInfo.length; i++) {
		var obj = sidebarInfo[i];
		if(sessionStorage.getItem('isCompanyAccount') != null && (sessionStorage.getItem('isCompanyAccount') === true || sessionStorage.getItem('isCompanyAccount') === "true")) {
			if(sidebarInfo[i].link === "/accounts" || sidebarInfo[i].link === "/login") {
				sidebarInfo[i].disabled = false;
			}
			else {
				sidebarInfo[i].disabled = true;
			}
		}
		else {
			sidebarInfo[i].disabled = false;
		}
	}
	
    return(
        <div className="sidebar" style={{height:"100%"}}>
            <br/>
            <div className="ListContainer">
                <ul className="SidebarList">
                    {sidebarInfo.map((val, key) => {
						if(val.disabled === true) {

						}
						else {
							return (
                                <li id="row" key={key} enabled>
                                    <Link to={val.link}>
                                        <p className="navIcon">{val.icon}</p>
                                        <p className="navTitle">{val.title}</p>
                                    </Link>
                                </li>
                            );
						}
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;