var fs = require("fs");

fs.readdir("C:/", (err, data) => {
    console.log(data);
})