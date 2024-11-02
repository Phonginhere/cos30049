// src/components/Slider.js
import React, { useState } from 'react';
import './SliderStyles.css';

const Slider = ({ min = 1990, max = 2021, initialValue = 2020, onChange }) => {
    const [value, setValue] = useState(initialValue);

    const handleSliderChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="slider">
            <span id="slider_min">Min</span>
            <input
                id="yearSlider"
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleSliderChange}
                className="test"
            />
            <span id="slider_max">Max</span>
            <br />
            <span id="slider_value">Value: {value}</span>
        </div>
    );
};

export default Slider;
