const mysql = require ("mysql")

// create MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: "perpustakaan"
})

db.connect(error => {
    if (error) {
         console.log(error.message)
    } else {
         console.log("Eheeew")
    }
})

module.exports = db