//1.使用common.js 的模块化规范
const {add, mul} = require('./mathUtils.js')

console.log(add(20, 15))
console.log(mul(5, 6))

//2.使用ES6的模块化规范
import {name, age, height} from './info.js'
console.log(name)
console.log(age)
console.log(height)
