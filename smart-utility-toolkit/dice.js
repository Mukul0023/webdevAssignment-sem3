const crypto = require("crypto");
const randomNumber = crypto.randomInt(1, 7);
console.log("Dice Rolled:", randomNumber);

for (let i = 1; i <= 5; i++) {
    const dice = crypto.randomInt(1, 7);
    console.log("Roll", i + ":", dice);
}  



