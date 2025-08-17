import { evaluate } from 'mathjs';

export const calculateResult = (input) => {
    try {
        let finalInput = input.replace(/×/g, '*').replace(/−/g, '-').replace(/÷/g, '/');
        return evaluate(finalInput).toString();
    }
    catch {return 'An error occured!';}
};

export const toggleSign = (input, result) => {
    const lastMatch = input.match(/(-?\d+\.?\d*)$/);
    let num = lastMatch ? parseFloat(lastMatch[0]) : parseFloat(result || 0);
    if (isNaN(num)) return input;
    const toggled = (num * -1).toString();
    return input.replace(/(-?\d+\.?\d*)$/, toggled);
};

export const percentize = (input, result) => {
    const lastMatch = input.match(/(-?\d+\.?\d*)$/);
    let num = lastMatch ? parseFloat(lastMatch[0]) : parseFloat(result || 0);
    if (isNaN(num)) return input;
    const percented = (num / 100).toString();
    return input.replace(/(-?\d+\.?\d*)$/, percented);
};


// To handle digits
export const formatDigits = (val, maxDigits = 7) => {
    if (val === 'Error') {return val;}
    if (!val) {return '0';}

    const lastNumMatch = val.match(/(-?\d+\.?\d*)$/);

    if (!lastNumMatch) {return val;}

    const lastNumString = lastNumMatch[0];
    const num = parseFloat(lastNumString);

    if (isNaN(num)) {return val;}

    // Get the part of the string before last number
    const prefix = val.slice(0, lastNumMatch.index);

    const formatted = num.toPrecision(maxDigits);

    // Check if the original string ended with a decimal
    const trailingDot = lastNumString.endsWith('.') ? '.' : '';

    // toPrecision might add trailing zeros or switch to scientific notation
    // Cleaning it up a bit for a better look
    let numbersToDiplay = formatted.includes('.') ? formatted.replace(/\.?0+$/, '') : formatted;
    return prefix + numbersToDiplay + trailingDot;
};

export const canAddDecimal = (input) => {
    const lastNumber = input.split(/[÷×−+]/).pop(); // Get last number segment
    return !lastNumber.includes('.');               // Return true if no dot exists
};
