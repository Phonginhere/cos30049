import React, { useState } from 'react';

function InputForm({ onSubmit }) {
    const [inputData, setInputData] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputData);
        setInputData('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter Data:
                <input
                    type="text"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default InputForm;
