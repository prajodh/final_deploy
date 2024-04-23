import React from 'react';

const PaymentSuccess = () => {
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
            <div style={{ color: 'green', fontSize: '100px', marginBottom: '20px' }}>&#10004;</div>
            <h1 style={{ color: 'green' }}>Payment Successful</h1>
            <p>Thank you for your purchase!</p>
        </div>
    );
};

export default PaymentSuccess;