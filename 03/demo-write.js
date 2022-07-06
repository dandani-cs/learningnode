var fs = require("fs");

var data = {
    name: "JSON"
};

fs.writeFile("./data-write.json", JSON.stringify(data), (err) => {
    console.log("write finished", err);
});