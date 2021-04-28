var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./database.js")

app.use(cors())
app.use(express.static('public'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var HTTP_PORT = 3000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/users/:id", (req, res, next) => {
    var sql = "select * from users where userId = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "user":row
        })
      });
});

app.put("/api/users/:id", (req, res, next) => {
    var data = {
        userName: req.body.userName,
        highScore: req.body.highScore
    }
    var sql ='UPDATE users SET userName = ?, highScore = ? WHERE userId = ?'
    var params =[data.userName, data.highScore, req.params.id]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "user": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/users/:id", (req, res, next) => {
    db.run(
        'DELETE FROM users WHERE Id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})

/* TEST USER DB (ADD/POST and GET */
app.get("/api/users/", (req, res, next) => {
    var sql = "select * from users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "user":rows
        })
    });
});

app.post("/api/users/", (req, res, next) => {
    var errors=[]
    if (!req.body.userName){
        errors.push("No info about user");
    }
    var data = {
        userName: req.body.userName,
        highScore:req.body.highScore
    }
    var sql ='INSERT INTO users (userName, highScore) VALUES (?, ?)'
    var params =[data.userName, data.highScore]

    // TODO: sätta db.run i en if-sats, ifall userName redan finns?
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "user": data,
            "id" : this.lastUserID
        })
    });
})

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

