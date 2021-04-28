var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "users.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE users (
            userId INTEGER PRIMARY KEY,
            userName TEXT,
            highScore TEXT
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO users (userName, highScore) VALUES (?,?)'
            db.run(insert, ["Marcus","0"])
        }
    })  
    }
})

module.exports = db;
