# huge-number
Numerical Javascript library capable of calculating with numbers up to `10[1.8e308]1.8e308`. 


## API

### `HugeNumber()`

Constructs a new HugeNumber. The call of the HugeNumber is `(a,b,?s)` which represents the value `s*10{a-1}b`, where `10{a-1}b` refers to `10^^^...^^^b` (a-1 arrows) in [https://googology.wikia.org/wiki/Arrow_notation](arrow notation).  

For example, `(9,4,-1)` is equal to the negation of 10 pentated to 9. Fractions can also be paassed for the argument `a`. Note that `s` (the sign of the number) is optional, and is set to `1` by default. It must equal `-1`, `0`, or `1`.

If only the argument `a` is passed, then it will be treated as a number, and automatically get converted to a HugeNumber, so `new HugeNumber(80)` will be converted to `new HugeNumber(Math.log10(80),2,1)`.


#### Example
`var x = new HugeNumber(3,2,1); //1000`
`var y = new HugeNumber(65); //65`
