import React from 'react';

const Popup = props => {
    return (
        <div className='popup-box'>
            <div className='box'>
                <h3>Choose a name for the new display.</h3>
                <input type="text" hint="New Display Name"/>
                <button type="button" onClick={props.handleCreateDisplay}>Confirm</button>
                <button type="button" onClick={props.handleClose}>Cancel</button>
            </div>
        </div>
    );
};

export default Popup