const operation = process.argv[2];
const num1 = Number(process.argv[3]);
const num2 = Number(process.argv[4]);

let result;

if (operation === "add") {
    result = num1 + num2;
}
else if (operation === "sub") {
    result = num1 - num2;
}
else if (operation === "mul") {
    result = num1 * num2;
}
else if (operation === "div") {
    result = num1 / num2;
}
else {
    console.log("Invalid operation");
    process.exit();
}

console.log("Result:", result); 