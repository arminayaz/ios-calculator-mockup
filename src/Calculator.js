import { useState, useEffect, useCallback } from 'react';
import { calculateResult, toggleSign, percentize, formatDigits, canAddDecimal } from './helpers/calculationHelpers';
import './Calculator.css';

function Calculator() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    
    const handleButtonClick = useCallback((clicked) => {
        const operators = ['÷', '×', '−', '+'];
        const handleDefaultInput = (clicked) => {
            const isOperator = operators.includes(clicked);
            // Prevent multiple decimals in current number
            // For both input and result
            if (clicked === '.' && !canAddDecimal(input)) return;
            
            if (result) {
                // If operator is pressed after result: start new expression with result + operator
                // Start new decimal number
                // If number or decimal is pressed after result: start a brand new calculation
                setInput(isOperator ? result + clicked : (clicked === '.' && !result.includes('.')) ? result + '.' : clicked);
                setResult('');
                return;
            }
            
            // Prevent multiple operators or multiple decimals right after each other
            const lastInputChar = input[input.length - 1];

            // Prevent duplicate operators
            if (isOperator && ['÷', '×', '−', '+'].includes(lastInputChar)) {
                // Replace the last operator with the new one if a new operator is pressed
                setInput(input.slice(0, -1) + clicked);
                return;
            }
            
            // Append value to the input
            setInput(prevInput => prevInput + clicked);
        };
        
        switch (clicked) {
            // Handle equals
            case '=': 
                // A check for expressions ending with a decimal point
                // If the input is empty, or ends in something that makes it incomplete, bail out
                const lastChar = input[input.length - 1];
                if (input === '' || operators.includes(lastChar) || lastChar === '.') {return;}

                const theOutput = calculateResult(input);
                
                setInput(theOutput);
                setResult(theOutput);
                
                break;
                
            // Handle all clear                
            case 'AC': 
                setInput('');
                setResult('');
                break;
                
            // Handle sign change                
            case '+/−':
                setInput(toggleSign(input, result));
                setResult('');
                break;
                
            // Handle percentage                
            case '%': 
                setInput(percentize(input, result));
                setResult('');
                break;
                
            default:
                handleDefaultInput(clicked);
                break;
        }
    }, [input, result]);
    
    // Keyboard Interaction
    useEffect(() => {
        const handleKeyPressed = (event) => {
            const key = event.key;
            const keyMap = {
                '0': '0',
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '6': '6',
                '7': '7',
                '8': '8',
                '9': '9',
                '.': '.',
                'Divide': '÷', // Firefox fix
                '/': '÷',
                '*': '×',
                '-': '−',
                '+': '+',
                'Enter': '=',
                '=': '=',
                'Backspace': 'AC',
                'Escape': 'AC'
            };
            
            // Prevent default browser behavior
            if (key in keyMap) {
                event.preventDefault();
                handleButtonClick(keyMap[key]);
            }
        };
        
        // Add event listener
        window.addEventListener('keyup', handleKeyPressed);
        
        // Needs to be investigated
        return () => {
            window.removeEventListener('keyup', handleKeyPressed);
        };
        
    }, [handleButtonClick]);
    
    const buttons = [
        ['AC', '+/−', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '−'],
        ['1', '2', '3', '+'],
        ['0', '.', '=']
    ];
    
    const buttonClasses = (clicked) =>
        (['÷', '×', '−', '+', '='].includes(clicked)) ? 'calculator__buttons__operator' :
        (['AC', '+/−', '%'].includes(clicked)) ? 'calculator__buttons__special' :
        (clicked === '0') ? 'calculator__buttons__zero' :
        'calculator__buttons__number';
    
    return(
        <section className='calculator__container'>
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[650px] w-[325px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[297px] h-[622px] bg-white dark:bg-gray-800">
                    <div className='calculator__wrapper'>
                        <div className='calculator__items'>
                            <div className='calculator__input'>{formatDigits(input)}</div>
                        </div>
                        <div className='calculator__items'>
                            {buttons.map((row, rowNumber) => (
                                <div className='calculator__buttons' key={rowNumber}>
                                    {row.map((buttonValues) => (
                                        <button key={buttonValues} onClick={() => handleButtonClick(buttonValues)} className={buttonClasses(buttonValues)}>
                                            {buttonValues}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Calculator;
