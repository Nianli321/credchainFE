
import React from 'react';
import logo from '../image/logo.png'

const ImageHeader = () => {
    const imageStyle = {
        width: "100%",
    };
    
  return (
    <header>
        <img  src={logo} alt="logo" style={imageStyle}/>
    </header>
  );
}

export default ImageHeader;