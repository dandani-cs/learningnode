var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise

var dbUrl = ""

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
    
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);

    // NESTED CALLBACK EXAMPLE
    // message.save((err) => {
    //     if (err)
    //         sendStatus(500);

    //     Message.findOne({message: "badword"}, (err, censored) => {
    //         if (censored) {
    //             console.log("censored words found", censored);
    //             Message.remove({_id: censored.id}, (err) => {
    //                 console.log("removed censored message");
    //             })
    //         }
    //     })

    message.save()
    .then(() => {
        console.log("saved")
        return Message.findOne({message: "badword"})
    })
    .then( censored => {
        if (censored) {
            console.log("censored words found", censored);
            return Message.deleteOne({_id: censored.id});
        }

        io.emit('message', req.body)
        res.sendStatus(200);
    })
    .catch((err) => {
        res.sendStatus(500);
        return console.log(err);
    });
});



io.on("connection", (socket) => {
    console.log("a user has connected");
})

mongoose.connect(dbUrl, (err) => {
    console.log("db connection", err);
})

var server = http.listen(3000, () => {
    console.log("Server is listening on Port", 
        server.address().port
    );
});