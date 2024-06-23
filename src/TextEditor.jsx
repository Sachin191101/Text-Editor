import React, { useState, useEffect } from 'react';
import googleFonts from './fonts';
import fontWeightNames from './fontWeightNames';
import './textedit.css'
const TextEditor = () => {
    const [fontFamily, setFontFamily] = useState('Roboto');
    const [fontWeight, setFontWeight] = useState('100');
    const [isItalic, setIsItalic] = useState(false);
    const [text, setText] = useState('');

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('editorState'));
        if (savedState) {
            setText(savedState.text);
            setFontFamily(savedState.fontFamily);
            setFontWeight(savedState.fontWeight);
            setIsItalic(savedState.isItalic);
        }
    }, []);

    useEffect(() => {
        const state = { text, fontFamily, fontWeight, isItalic };
        localStorage.setItem('editorState', JSON.stringify(state));
    }, [text, fontFamily, fontWeight, isItalic]);

    const handleFontFamilyChange = (e) => {
        const newFontFamily = e.target.value;
        setFontFamily(newFontFamily);
        const firstVariant = googleFonts[newFontFamily].variants.find(variant => variant.style === 'normal');
        setFontWeight(firstVariant.weight);
        setIsItalic(false);
    };

    const handleFontWeightChange = (e) => {
        setFontWeight(e.target.value);
        setIsItalic(false);
    };

    const handleItalicToggle = (e) => {
        setIsItalic(!isItalic);
    };
    const handleReset = (e) => {
        setText('')
        setFontFamily('Roboto')
        setFontWeight('100')
        setIsItalic(false)
    };
    const handleSave = (e) => {
        setIsItalic(!isItalic);
    };

    const getFontUrl = () => {
        const selectedVariant = googleFonts[fontFamily].variants.find(variant => {
            return variant.weight === fontWeight && variant.style === (isItalic ? 'italic' : 'normal');
        });

        return selectedVariant ? selectedVariant.url : googleFonts[fontFamily].variants.find(variant => variant.weight === fontWeight).url;
    };

    const applyFont = () => {
        const fontUrl = getFontUrl();
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return {
            fontFamily,
            fontWeight,
            fontStyle: isItalic ? 'italic' : 'normal',
        };
    };

    const fontStyles = applyFont();

    return (
        <div className='mainContainer'>
            <div className="optionContainer">
            <select value={fontFamily} onChange={handleFontFamilyChange}>
                {Object.keys(googleFonts).map(font => (
                    <option key={font} value={font}>{font}</option>
                ))}
            </select>
            <select value={fontWeight} onChange={handleFontWeightChange}>
                {googleFonts[fontFamily].variants
                    .filter(variant => variant.style === 'normal')
                    .map(variant => (
                        <option key={variant.weight} value={variant.weight}>
                            {fontWeightNames[variant.weight]}
                        </option>
                    ))}
            </select>
            <div className="toggle"><div className="togglein" onClick={handleItalicToggle} style={{float:isItalic?'right':'left'}}></div><span>Italic</span></div>
            
            </div>
            <textarea
                id="editor"
                style={{ fontFamily: fontStyles.fontFamily, fontWeight: fontStyles.fontWeight, fontStyle: fontStyles.fontStyle }}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="bottomcontainer">
                <label className='btn reset' onClick={handleReset}>Reset</label> <label className='btn save' onClick={handleSave}>Save</label>
            </div>
        </div>
    );
};

export default TextEditor;
