const fs = require("fs");
console.log("Creating File...");
fs.writeFile("test.txt", "Hello Node.js", (err) => {
    if (err) {
        console.log("Error:", err);
        return;
    }
    console.log("File Created");

    console.log("Reading File...");
    fs.readFile("test.txt", "utf8", (err, data) => {
        if (err) {
            console.log("Error:", err);
            return;
        }
        console.log(data);

        console.log("Updating File...");
        fs.appendFile("test.txt", "\nLearning FS Module", (err) => {
            if (err) {
                console.log("Error:", err);
                return;
            }
            console.log("File Updated");

            fs.readFile("test.txt", "utf8", (err, data) => {
                if (err) {
                    console.log("Error:", err);
                    return;
                }
                console.log(data);
                
                console.log("Deleting File...");
                fs.unlink("test.txt", (err) => {
                    if (err) {
                        console.log("Error:", err);
                        return;
                    }
                    console.log("File Deleted");
                });
            });
        });
    });
}); 
