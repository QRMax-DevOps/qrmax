import React, { useState, Component } from 'react';
import './mw_style.css';

class MarketingWebsite extends Component {
	constructor(props) {
		super(props);
	}

    render() {
		return (
			<div className="baseContainer">

				<div className="screenHeaderContainer">
					<div className="logoContainer">
						<div style={{lineHeight:"60px", color:"white"}}>
							Logo here
						</div>
						<div style={{lineHeight:"60px", color:"white"}}>
							Title here
						</div>
					</div>
				  
					<div className="buttonsContainer">
						<button>Home</button>
						<button>Features</button>
						<button>Downloads</button>
						<button>Contact</button>
					</div>
				
				</div>
				
				<div className="screenBodyContainer">
					<div id="overlaySplash">
						<div id="overlaySplashInternal">
							<h1 style={{textAlign:"left"}}>An innovative, organised approach<br/>to QR management</h1>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet leo at lacus fringilla, a congue felis consectetur. Morbi nec dolor congue, convallis diam at, cursus erat.</p>
						</div>
					</div>
					
					<div id="mainSplash">
						<div id="mainSplashInternal">
							<h1>QRMAX</h1>
							<h1>An improved alternative.</h1>
							<br/>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet leo at lacus fringilla, a congue felis consectetur. Morbi nec dolor congue, convallis diam at, cursus erat. Suspendisse eleifend odio vel faucibus ultricies. Quisque cursus, metus vitae eleifend faucibus, velit eros scelerisque est, et congue diam tortor et sem. Nunc molestie, ipsum eget vestibulum blandit, arcu purus placerat sapien, suscipit tincidunt neque purus vitae ante. Nullam euismod auctor neque ornare malesuada. Nullam sit amet dui interdum, viverra est sit amet, vulputate nisl. Morbi eget magna tellus. Quisque suscipit quam in nisi accumsan, sed semper turpis placerat. Suspendisse facilisis varius elementum. Aliquam maximus, nisl a volutpat dapibus, erat eros sodales metus, quis egestas leo ligula vitae libero. Duis dictum est tellus, a tincidunt eros iaculis nec. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer at eros ultrices, tincidunt velit in, viverra ante.

Sed eget nibh sem. Morbi in lobortis lacus. Ut luctus tincidunt nisi, sit amet sollicitudin mi luctus posuere. Nam auctor, est at facilisis scelerisque, felis ex ultrices turpis, vitae tincidunt justo ipsum eu enim. Sed sit amet leo faucibus, iaculis sem in, suscipit sem. Fusce nec ante nec odio aliquet feugiat in in sapien. Cras eget elit eu sem hendrerit sodales eget et lacus. Sed maximus ultricies mauris, a fermentum sapien. Maecenas tortor nulla, commodo cursus semper ut, hendrerit vel tellus. Proin ut augue id nisl accumsan tempor at eu mauris. Cras accumsan pulvinar dolor, hendrerit ullamcorper orci dapibus ut. Nunc quis nunc vitae erat elementum rutrum.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MarketingWebsite;

/*

*/
