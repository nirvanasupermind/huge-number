"use strict";
//HugeNumberJS library by nirvanasupermind
//Licensed under terms of MIT license


//Util functions
/**
Linear approximation to tetration in vanilla JS
@param {number} a
@param {number} b
*/

function tetr(a, b) {
    if(a > 2 && b > 5) {
        return Infinity;
    }
    if(b < -2) {
        return NaN;
    }
    if (b < -1) {
        return Math.log(tetr(a, b + 1)) / Math.log(a);
    } else if (b < 0 && b >= -1) {
        return b + 1;
        //Prevent the stack from exploding
    } else if (b > 10) {
        return Infinity;
    } else if (b < -2) {
        return NaN;
    } else {
        //Use recursive definition
        return Math.pow(a, tetr(a, b - 1));
    }
}

/**
 * Get the inverse of a function
 * @param {function} f 
 * @param {number} x 
 */
function inv(f, x) {
    try {
        //Newton iteration
        function g(x2) {
            return f(x2) - x;
        }
        function gDash(x2) {
            var h = Math.sqrt(Number.EPSILON);
            return (g(x2 + h) - g(x2 - h)) / (2 * h);
        }

        var result = 2.0;
        for (var i = 0; i < 100; i++) {
            result = result - (g(result) / gDash(result));
        }
        return result;
    } catch (e) {
        if (e instanceof RangeError) {
            //A stack overflow occured from many recursive calls
            //Use bisection method for monotonic function
            var lowGuess = -1e10;
            var highGuess = 1e10;
            var midGuess = 0;
            var isDecreasing = f(2.0) < f(1.0);
            for (var i = 0; i < 100; i++) {
                midGuess = lowGuess / 2 + highGuess / 2;
                if (isDecreasing) {
                    if (f(midGuess) > x) {
                        lowGuess = midGuess;
                    } else {
                        highGuess = midGuess;
                    }
                } else {
                    if (f(midGuess) < x) {
                        lowGuess = midGuess;
                    } else {
                        highGuess = midGuess;
                    }
                }
            }

            return midGuess;

        } else {
            throw e;
        }
    }
}

/**
 * Superlog approximation for vanilla JS
 * @param {number} b 
 * @param {number} x 
 */
function slog(b, x) {
    return inv((a) => tetr(b, a), x);
}

/**
 * Superroot approximation for vanilla JS
 * @param {number} x 
 * @param {number} n 
 */
function sroot(x, n) {
    return inv((a) => tetr(a, n), x);
}

/**
 * Pentation approximation for vanilla JS
 * @param {number} a 
 * @param {number} b 
 */
function pentate(a, b) {
    if (b < -1) {
        return slog(a, pentate(a, b + 1));
    } else if (b > -1 && b <= 0) {
        return b + 1;
    } else {
        return tetr(a, pentate(a, b - 1));
    }
}


/**
 * Hyperoperator for vanilla JS
 * @param {number} a 
 * @param {number} b
 * @param {number} c
 */
function hy(a, b, c) {
    if (c === 0) {
        return a + b;
    } else if (c === 1) {
        return a * b;
    } else if (c === 2) {
        return Math.pow(a, b);
    } else if (c === 3) {
        return tetr(a, b);
    } else if (c === 4) {
        return pentate(a, b);
    } else if (b <= 0) {
        //Use linear approx. for fractions

        return b + 1;
    } else {
        return hy(a, hy(a, b - 1, c), c - 1);
    }
}
/**
 * Rudimentary itneger-division based inverse hyperoperator in vanilla JS
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 */
function invHy1(a, b, c) {
    if (c === 0) {
        return a - b;
    } else if (c === 1) {
        return a / b;
    } else if (c === 2) {

    } else {

        var fIdx = n;
        var ans = x;
        fIdx--;

        var remainder = x;
        var count = 0;

        while (remainder >= y) {
            remainder = hyperoperatorInverse2a(remainder, y, n - 1);
            count++;
        }
        return count;
    }
}

/**
 * Inverse hyperoperator in vanilla JS
 * @param {number} a 
 * @param {number} b
 * @param {number} c
 */
function invHy(a, b, c) {
    return inv(function (n) { return hy(b, n, c) }, a);

}

function invHy10(a, c) {
    if (c >= 5) {
        return 1;
    } else {
        return invHy(a, 10, c);
    }
}

/**
 * Compare (spaceship operator) of two numbers in vanilla JS
 * @param {number} a 
 * @param {number} b 
 */
function cmp(a, b) {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
}

/**
 * Get the type of an object
 * @param {*} x 
 */
function type(x) {
    return x.constructor.name
}

//FINALLY we can deal with the real content
/**
 * Constructor function, output equals s*hy(10,b,a).
 * @param {number} a 
 * @param {number} b 
 * @param {number} s 
 */
function HugeNumber(a, b, s) {
    if (b === undefined && s === undefined) {
        if (type(a) === "Number") {
            Object.assign(this, HugeNumber.fromNumber(a));
        } else if (type(a) === "HugeNumber") {
            Object.assign(this, a);
        } else if (type(a) === "String") {
            if (a.includes("e")) {
                Object.assign(this, HugeNumber.fromExponential(a));
            } else if(a.match(/\((\d*?),(\d*?)\)/g)) {
                 var temp = JSON.parse(a.replace(/\((\d*?),(\d*?)\)/g,"[$1,$2]"));
                Object.assign(this, new HugeNumber(temp[0],temp[1]));
                
            } else {
                Object.assign(this, HugeNumber.fromNumber(parseFloat(a)));
            }
        } else {
            Object.assign(this, new HugeNumber(NaN, NaN, 1));
        }
    } else {

        if (a === 1 && b > 2) {
            b = 2;
        }
        
        if(b > 2) {
        while(a < 2) {
            a = Math.pow(10,a);
            b--;
        }
        }

        if (b < 2) {
            if (b === 0) {
                a += 10;
            } else {
                a *= 10;
            }

            a = Math.log10(a);

            b = 2;
        }

        while (a > 10) {
            a = invHy10(a, b + 1) + 1;
            b++;
        }
        if (isNaN(s)) {
            //Default positive sign
            s = 1;
        }

  

        if (![-1, 0, 1].includes(s)) {
            throw new Error("HugeNumber: Sign must be -1, 0, or 1")
        }


        


        this.a = a;
        this.b = b;
        this.s = s;


        
    }

}


/**
 * Convert the inst to a number
 */
HugeNumber.prototype.toNumber = function () {
    var result = 0;
    if (this.b >= 5 && this.a > 1 || this.b >= 4 && this.a >= 1.15 || this.b >= 3 && this.a >= 3) {
        result = Infinity;
    } else {
        result = hy(10, this.a, this.b);
    }
    //Deal with sign
    result *= this.s;

    return result;


}

//Static method
HugeNumber.toNumber = function (n) {
    return n.toNumber();
}

/**
 * Convert to a HugeNumber
 * @param {number} x
 */
HugeNumber.fromNumber = function (x) {
    if (x === Infinity) {
        return new HugeNumber(Infinity, Infinity);
    }
    var y = Math.abs(x);
    return new HugeNumber(Math.log10(y), 2, Math.sign(x), true);
}


/**
 * Compare two HugeNumbers
 * @param {*} that
*/
HugeNumber.prototype.cmp = HugeNumber.prototype.compare = function (that) {
    that = new HugeNumber(that);
    if (isFinite(this.toNumber()) && isFinite(that.toNumber())) {
        return cmp(this.toNumber(), that.toNumber());
    }
    if (this.b < that.b) {
        //Obviously that is bigger
        return -1;
    } else if (this.a === that.a) {
        //Compare a
        return cmp(this.b, that.b);
    } else {
        //This is bigger
        return 1;
    }

}

/**
 * Absolute value of a HugeNumber
 */
HugeNumber.prototype.abs = function () {
    return new HugeNumber(this.a, this.b, 1);
}

/**
 * Negation of a HugeNumber
 */
HugeNumber.prototype.neg = function () {
    return new HugeNumber(this.a, this.b, -this.s);
}


/**
 * Convert a HugeNumber to exponential notation
 * @param {bool} [useArr]
 */
HugeNumber.prototype.toExponential = function (useArr) {
    if(this.b > 5) {
        if(useArr) {
        return [1,HugeNumber.POSITIVE_INFINITY];
        } else {
            return 19;
        }
    }
    var result = [];
    if (this.b === 2) {
        //Exponent

        result = [Math.pow(10, this.a % 1), Math.floor(this.a)];
    } else if (this.b === 3) {
        //Tetration
        var lognum = tetr(10, this.a - 1);
        result = [Math.pow(10, lognum % 1), Math.floor(lognum)];

    } else {
        //Pentation and higher, too big to express
        result = [Infinity, Infinity];
    }

    //Normalization
    if (isFinite(result[0])) {
        while (result[0] >= 10) {
            result[0] /= 10;
            result[1]++;
        }

        while (result[0] < 1) {
            result[0] *= 10;
            result[1]--;
        }
    }

    if (!useArr) {
        //Make as string
        result = result.join("e");
    }

    return result;
}

/**
 * Convert a HugeNumber to stack/level-index notation
 * @param {bool} useArr
 */

HugeNumber.prototype.toStack = function (useArr) {
    var result = []
    if (this.b === 2) {
        //Exponent
        result = [Math.floor(slog(10, this.a)) + 1, Math.log10(Math.log10(this.a))];
    } else if (this.b === 3) {
        result = [Math.floor(this.a) - 1, Math.pow(10, Math.pow(10, this.a % 1))];
    } else if (this.b === 4 && this.a <= 2.15) {
        var temp = hy(10, this.a - 1, 5);
        result = [Math.floor(temp), Math.pow(10, temp % 1)]
    } else {
        result = [Infinity, Infinity];
    }
    while(result[1] < 1) {
        result[1] = Math.pow(10,result[1]);
        result[0]++;
        
    }
    
    return result;


}

HugeNumber.prototype.toString = function () {
    var result = "";
    if (this.a < -323 && this.b === 2) {
        //Small number
        result = this.toExponential()
    } else if (isFinite(this.toNumber())) {
        //Number
        result = this.toNumber().toString();
    } else if (isFinite(this.toExponential()[0])) {
        //Exponent
        result = this.toExponential().toString();
    } else if (this.a >= 3.395 && this.a <= 4.395 && this.b === 3) {
        //Double exponent
        result = new HugeNumber(this.a - 1, this.b).toExponential();
        result = "10^(" + result + ")";
    } else if (isFinite(this.toStack()[0])) {
        //Stack
        result = "E" + this.toStack().join("#")
    } else {
        //Arrow notation
        result = "10{" + String(this.b - 1) + "}" + String(this.a);
    }

    if (this.s === -1 && !result.includes("-")) {
        result = "-" + result;
    }

    return result;
}

/**
 * Convert to HTML text
 */

HugeNumber.prototype.toHTML = function () {
    var result = "";
    if (this.a < -323 && this.b === 2) {
        //Small number
        result = this.toExponential(true)[0].toString() + " x 10" + this.toExponential(true)[1].toString().sup();
    } else if (isFinite(this.toNumber())) {
        //Number
        result = this.toNumber().toString();
    } else if (isFinite(this.toExponential()[0])) {
        //Exponent
        result = this.toExponential(true)[0].toString() + " x 10" + this.toExponential(true)[1].toString().sup();
    } else if (this.a >= 3.395 && this.a <= 4.395 && this.b === 3) {
        //Double exponent
        var m = new HugeNumber(this.a - 1, this.b);
        result = m.toExponential(true)[0].toString() + " x 10" + m.toExponential(true)[1].toString().sup();
        result = "10" + ("(" + result + ")").sup();
    } else if (isFinite(this.toStack()[0])) {
        //Stack
        result = "E" + this.toStack().join("#")
    } else {
        //Arrow notation
        result = "10{" + String(this.b - 1) + "}" + String(this.a);
    }

    if (this.s === -1 && !result.includes("-")) {
        result = "-" + result;
    }

    return result;
}
/**
 * Convert from exponential notation
 * @param {string|number[]} exp
 */
HugeNumber.fromExponential = function (exp) {
    if (type(exp) === "String") {
        exp = exp.split("e").map(parseFloat);
    }

    var exp2 = [Math.abs(exp[0]), exp[1]];
    return new HugeNumber(exp2[1] + Math.log10(exp2[0]), 2, Math.sign(exp[0]));



}

/**
 * Add two HugeNumbers
 * @param {*} that
 */

HugeNumber.prototype.add = HugeNumber.prototype.plus = function (that) {
    that = new HugeNumber(that);
    //Maximum
    var x = this;
    var y = that;
    if (x.cmp(y) === -1) {
        x = that;
        y = this;
    }

    var result = new HugeNumber(0, 0, 0);

    if (isFinite(x.toExponential(true)[0]) && isFinite(y.toExponential(true)[0])) {
        var x2 = x.toExponential(true);
        var y2 = y.toExponential(true);
        var z2 = [x2[0] + (Math.pow(10, y2[1] - x2[1])) * y2[0], x2[1]];

        result = HugeNumber.fromExponential(z2);



    } else {
        //x dominates
        result = x
    }

    return result;



}


/**
 * Subtract two HugeNumbers
 * @param {*} that
 */
HugeNumber.prototype.sub = HugeNumber.prototype.subtract = HugeNumber.prototype.minus = function (that) {
    that = new HugeNumber(that);
    //Maximum
    var x = this;
    var y = that;
    if (x.cmp(y) === -1) {
        x = that;
        y = this;
    }

    var result = new HugeNumber(0, 0, 0);

    if (isFinite(x.toExponential(true)[0]) && isFinite(y.toExponential(true)[0])) {
        var x2 = x.toExponential(true);
        var y2 = y.toExponential(true);
        var z2 = [x2[0] - (Math.pow(10, y2[1] - x2[1])) * y2[0], x2[1]];

        result = HugeNumber.fromExponential(z2);



    } else {
        //x dominates
        if (x.cmp(y) === 0) {
            //...unless x and y are the same
            result = new HugeNumber(0);
        } else {
            result = x
        }
    }



    return result;

}


/**
 * Multiply two HugeNumbers
 * @param {*} that
 */

HugeNumber.prototype.mul = HugeNumber.prototype.times = HugeNumber.prototype.multiply = function (that) {
    that = new HugeNumber(that);
    //Maximum
    var x = this;
    var y = that;
    if (x.cmp(y) === -1) {
        x = that;
        y = this;
    }

    var result = new HugeNumber(0, 0, 0);

    if (isFinite(x.toExponential(true)[0]) && isFinite(y.toExponential(true)[0])) {
        var x2 = x.toExponential(true);
        var y2 = y.toExponential(true);
        var z2 = [x2[0] * y2[0], x2[1] + y2[1]];

        result = HugeNumber.fromExponential(z2);



    } else {
        //x dominates
        result = x
    }

    return result;



}


/**
 * Divide two HugeNumbers
 * @param {*} that
 */

HugeNumber.prototype.div = HugeNumber.prototype.divide = function (that) {
    that = new HugeNumber(that);
    //Maximum
    var x = this;
    var y = that;
    if (x.cmp(y) === -1) {
        x = that;
        y = this;
    }

    var result = new HugeNumber(0, 0, 0);

    if (isFinite(x.toExponential(true)[0]) && isFinite(y.toExponential(true)[0])) {
        var x2 = x.toExponential(true);
        var y2 = y.toExponential(true);
        var z2 = [x2[0] / y2[0], x2[1] - y2[1]];

        result = HugeNumber.fromExponential(z2);



    } else {
        //x dominates
        result = x
    }

    return result;



}

/**
 * Common logarithm of a HugeNumber
 */
HugeNumber.prototype.log10 = function () {
    if (this.b === 2) {
        //Extract the exponent
        return new HugeNumber(this.a);
    } else if (this.b === 3) {
        //Remove a stack
        return new HugeNumber(this.a - 1, this.b);
    } else {
        //Pentation and higher, basically no difference
        return this;
    }
}

/**
 * Power of 10 of a HugeNumber
 */
HugeNumber.prototype.pow10 = function () {
    if (this.b === 2) {
        //Highten the exponent
        var stack = this.toStack();
        //Normalization (for computing LI index)
        while (stack[1] > 1) {
            stack[1] = Math.log10(stack[1]);
            stack[0]++;
        }
        return new HugeNumber(stack[0] + stack[1] + 1, 3);
    } else if (this.b === 3) {
        //Add a stack
        return new HugeNumber(this.a + 1, this.b);
    } else {
        //Pentation and higher, basically no difference
        return this;
    }
}


HugeNumber.POSITIVE_INFINITY = new HugeNumber(Infinity);
HugeNumber.NEGATIVE_INFINITY = new HugeNumber(-Infinity);
HugeNumber.MIN_VALUE = new HugeNumber(-Number.MAX_VALUE,2);
HugeNumber.MAX_VALUE = new HugeNumber(Number.MAX_VALUE,Number.MAX_VALUE);
HugeNumber.ZERO = new HugeNumber(0);
HugeNumber.ONE = new HugeNumber(1);
HugeNumber.SQRT1_2 = new HugeNumber(Math.SQRT1_2);
HugeNumber.SQRT2 = new HugeNumber(Math.SQRT2);
HugeNumber.E = new HugeNumber(Math.E);
HugeNumber.PI = new HugeNumber(Math.PI);;




