import React, { useState } from 'react';
import MyComponent from './MyComponent';

const useMyComponent = () => {
    const [text, setText] = useState('Initial Text');
    const [color, setColor] = useState('black'); // Default color

    const setColorFunction = (newColor) => {
        setColor(newColor);
    };

    const RenderComponent = () => <MyComponent text={text} color={color} />;

    return { RenderComponent, setColorFunction };
};

export { useMyComponent };
