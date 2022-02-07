let derivative,
    antiderivative,
    area,
    upperbound,
    lowerbound,
    vertex,
    denominator;

const functionInput = document.getElementById("functionInput");
const derivativeText = document.getElementById("derivative");
const antiderivativeText = document.getElementById("antiderivative");
const areaText = document.getElementById("area");
const vertexText = document.getElementById("vertex");

function calculateFunction() {
    let text = functionInput.value;
    derivative = "";
    antiderivative = "";
    area = 0;
    upperbound = "";
    lowerbound = "";
    vertex = 0;
    denominator = 0;
    if (text.includes(",")) calculateIntegral(text);
    else calculateDerivatives(text);
    updateText();
}

function updateText() {
    derivativeText.innerHTML = `Derivative: ${readableExponent(derivative)}`;
    antiderivativeText.innerHTML = `Antiderivative: ${readableFraction(
        antiderivative
    )} + constant`;
    areaText.innerHTML = `Area with lower bound ${lowerbound} and upper bound ${upperbound}: ${area}`;
    vertexText.innerHTML = `Stationary Point: (${vertex}, ${f(vertex)})`;
}

// https://www.geeksforgeeks.org/reduce-a-fraction-to-its-simplest-form-by-using-javascript/
function simplify(str) {
    var result = "",
        data = str.split("/"),
        numOne = Number(data[0]),
        numTwo = Number(data[1]);
    for (var i = Math.max(numOne, numTwo); i > 1; i--) {
        if (numOne % i == 0 && numTwo % i == 0) {
            numOne /= i;
            numTwo /= i;
        }
    }
    if (numTwo === 1) {
        result = numOne.toString();
    } else {
        result = numOne.toString() + "/" + numTwo.toString();
    }
    return result;
}

function f(x) {
    let text = functionInput.value;
    let coefficient = "";
    let xIndex = 0;
    let power = "";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == "x") {
            xIndex = i;
            break;
        }
        coefficient += text.charAt(i);
    }
    for (let i = xIndex + 2; i < text.length; i++) {
        if (isNaN(text.charAt(i))) break;
        power += text.charAt(i);
    }
    if (coefficient == "") return Math.pow(x, parseInt(power));
    return parseInt(coefficient) * Math.pow(x, parseInt(power));
}

function calcExpression(antiderivative, x) {
    let power = "";
    let denominatorIndex = 0;
    for (let i = 2; i < antiderivative.length; i++) {
        // Start at 2 to ignore the x^
        if (isNaN(antiderivative.charAt(i))) {
            denominatorIndex = i + 1;
            break;
        }
        power += antiderivative.charAt(i);
    }
    // Math.pow(x, parseInt(power))
    let deno = "";
    for (let i = denominatorIndex; i < antiderivative.length; i++) {
        if (!isNaN(antiderivative.charAt(i))) {
            deno += antiderivative.charAt(i);
        }
    }
    denominator = parseInt(deno);
    return Math.pow(x, parseInt(power));
}

function readableFraction(fraction) {
    if (!fraction.includes("/")) return fraction;
    let slashIndex = fraction.indexOf("/");
    let top = fraction.slice(0, slashIndex);
    let bottom = fraction.slice(slashIndex + 1);
    return `<sup>${top}</sup>&frasl;<sub>${bottom}</sub>`; // &frasl; is the / between numerator and denominator
}

function readableExponent(exponent) {
    if (!exponent.includes("^")) return exponent;
    let exponentIndex = exponent.indexOf("^");
    let top = exponent.slice(0, exponentIndex);
    let bottom = exponent.slice(exponentIndex + 1);
    return `${top}<sup>${bottom}</sup>`;
}

function calculateIntegral(text) {
    calculateDerivatives(text);
    // Calculate integral given upper and lower
    let commaIndex = text.search(",");
    let lowerFound = false;
    lower = "";
    upper = "";
    for (let i = commaIndex + 1; i < text.length; i++) {
        if (!lowerFound) {
            if (text.charAt(i) != " ") {
                lower += text.charAt(i);
            } else {
                if (lower == "") {
                    continue;
                } else {
                    lowerFound = true;
                }
            }
        } else {
            if (text.charAt(i) != " ") {
                upper += text.charAt(i);
            }
        }
    }
    //area = calcExpression(antiderivative, parseInt(upper)) - calcExpression(antiderivative, parseInt(lower));
    let first = calcExpression(antiderivative, parseInt(upper));
    let second = calcExpression(antiderivative, parseInt(lower));
    let numerator = first - second;
    let fraction = `${numerator}/${denominator}`;
    let simplified = simplify(fraction);
    let solved = Math.round((numerator / denominator) * 100) / 100;
    if (parseInt(simplified) == solved) {
        area = `${simplified}`;
    } else {
        area = `${readableFraction(simplified)} ≈ ${solved}`;
    }
    lowerbound = lower;
    upperbound = upper;
}

// No "," just calculate derivative, and x when derivative is 0 (vertex), and antiderivative
function calculateDerivatives(text) {
    // Calculate derivative
    // (f(x+h) - f(x)) / 2
    // USING POWER RULE FOR NOW
    let caretIndex = text.search("^");
    // Temp fix:
    caretIndex = 1;
    let power = text.charAt(caretIndex + 1);
    if (power == "(") {
        power = "";
        for (let i = caretIndex + 2; i < text.length; i++) {
            if (text.charAt(i) == ")") {
                break;
            }
            power += text.charAt(i);
        }
    }
    let exponent = parseInt(power) - 1;
    let coefficient = parseInt(power);
    derivative = `${coefficient}x^${exponent}`;
    if (exponent == 1) derivative = `${power}x`;
    // Temporary
    vertex = Math.pow(0 / coefficient, 1 / exponent);
    // Finding antiderivative
    exponent = parseInt(power) + 1; // Exponent of antiderivative
    let fraction = `x^${exponent}/${exponent}`;
    antiderivative = `${fraction}`;
}