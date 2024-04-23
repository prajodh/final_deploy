import React from 'react';

const PaymentFailure = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff', // Set a background color
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ color: 'red', fontSize: '100px', marginBottom: '20px' }}>&#10060;</div>
            <h1 style={{ color: 'red' }}>Payment Failed</h1>
            <p>Oops! Something went wrong with your payment.</p>
            <p>Please try again later or contact customer support.</p>
        </div>
    );
};

export default PaymentFailure;
