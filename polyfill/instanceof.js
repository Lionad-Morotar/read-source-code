function _instanceof(left, right) {
    const prototypeStored = right.prototype
    while ((left = Object.getPrototypeOf(left))) {
        if (left === prototypeStored) {
            return true
        }
    }
    return false
}

function God() {}
function Person() {}
function Programmer() {}
function Duck() {}

Programmer.prototype = new Person()
Duck.prototype = new Programmer()

const lionad = new Duck()

console.log(_instanceof(lionad, Person))
console.log(_instanceof(lionad, Programmer))
console.log(_instanceof(lionad, Duck))
console.log(_instanceof(lionad, God))