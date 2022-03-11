import React, { useState } from 'react';
import styles from './Custom_Button_Style.css';

const Button = ({ children, onClick, btnColor = 'rgba(200, 200, 200, 1)', labelColor, disabled, type, style, ...props }) => {
    const [
        hover,
        setHover
    ] = useState(false);
    const toggleHover = () => {
        setHover(!hover);
    };
	
    const commonStyles = {
        backgroundColor : btnColor,
        color           : labelColor || 'black'
    };
    const outlineStyles = {
        color           : btnColor,
        backgroundColor : 'white'
    };
    const outlineHoverStyle = {
        color           : labelColor || 'black',
        backgroundColor : btnColor
    };

    const roundedStyle = {
        backgroundColor : btnColor,
        color           : labelColor || 'black',
        borderRadius    : '25px'
    };
    const disabledStyle = {
        cursor          : 'default',
        backgroundColor : btnColor,
        color           : labelColor || 'black',
        opacity         : 0.4
    };
    const blockStyles = {
        width  : '95%',
        margin : '0 auto'
    };
	
    let btnStyle;
    switch (type) {
        case 'rounded':
            btnStyle = roundedStyle;
            break;
		case 'disabled':
            btnStyle = disabledStyle;
            break;
        case 'block':
            btnStyle = blockStyles;
            break;
        case 'outline':
            if (hover) {
                btnStyle = outlineHoverStyle;
            }
            else {
                btnStyle = outlineStyles;
            }
            break;
        default:
            btnStyle = {
                backgroundColor : btnColor,
                color           : labelColor || 'rgba(75, 75, 75, 1)',
				fontSize		: '32px',
				borderRadius	: '24px',
				border			: 'none',
				opacity			: 0.7
            };
            break;
    }
    return (
        <button
            style={

                    disabled ? { ...commonStyles, ...btnStyle, ...disabledStyle, ...style } :
                    { ...commonStyles, ...btnStyle, ...style }
            }
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            {...props}
            type="button"
            onClick={

                    !disabled ? onClick :
                    () => {}
            }
            className={styles.btn}
        >
            {children || 'button'}
        </button>
    );
};

/*Test*/

export default Button;