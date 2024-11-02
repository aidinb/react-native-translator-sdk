import React,{useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import translations from './en'
const MyComponent = ({color}) => {
    const [textColor, setTextColor] = useState(color);

    useEffect(() => {
        setTextColor(color);
    }, [color]);
    return (
        <View>
        <Text style={{color:textColor}}>{translations['This is a component from the SDK']}</Text>
        <Text>{translations['Hello, how are you?']}</Text>
    </View>
    );
}
export default MyComponent;
