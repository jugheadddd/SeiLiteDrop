import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import SEIYAN_LOGO from '../lib/img/seiyan_logo.png'; // Adjust the path as necessary

const MadeBy: React.FC = () => {
  return (
    <div style={containerStyle}>
      <p style={textStyle}>Originally by</p>
      <h1 className="text-5xl font-alarm uppercase text-markPink-900">
        <Link href="https://www.gaslite.org/">Gaslite Drop</Link>
      </h1>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  padding: '5px 10px',
  borderRadius: '5px',
  color: 'white',
  zIndex: 1000,
};

const textStyle: React.CSSProperties = {
    margin: '0 10px 0 0',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#EA33F6', 
};

export default MadeBy;