const express = require ("express")
const bodyParser = require ("body-parser")
const cors = require ("cors")



const siswaroute = require("./siswa")
const bukuroute = require("./buku")
const adminroute = require ("./admin")
const transaksiroute = require ("./transaksi")
// const transaksiroute = require ("")


const app = express()
app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// implementation
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(siswaroute)
app.use(bukuroute)
app.use(adminroute)
app.use(transaksiroute)
// app.use(transaksiroute)

//---------------------------------------------------------                ---------------------------------------------------------\\

 app.listen(8000, () =>{
     console.log("Alhamdulillah ;)")
 })

 