const express = require ("express")
const router = express.Router()
const db = require ("./db")

const Cryptr = require("cryptr")
const crypt = new Cryptr("121212") 

validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)

            // sql cek id_user
            let sql = "select * from siswa where ?"

            // set parameter
            let param = { id_siswa: decryptToken}

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan id_user
                if (result.length > 0) {
                    // id_user tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}



//--------------------------------------------------------------------------------------------------------------------\\

// end-point akses data siswa
router.get("/datasiswa",validateToken(), (req,res) => {
    // create sql query
    let sql = "select * from datasiswa"

    // run query
    db.query(sql,(error, result) => {
         let response = null
         if (error) {
              response = {
                   message: error.message // pesan error
              }
         } else {
              response = {
                   count: result.length, // jumlah data
                   datasiswa: result // isi data
              }
         }
         res.json(response) // send response
    })

})

//mengakses data siswa
router.get("/datasiswa/:id",validateToken(), (req,res) => {
    let data = {
         id_siswa: req.params.id
    }
    let sql = "select * from datasiswa where ?"

    db.query(sql, data, (error, result) => {
         let response = null
         if (error){
              response = {
                   message: error.message
              }
         } else {
              response = {
                   count: result.length,
                   datasiswa: result
              }
         }
         res.json(response)
    })
})

//menyimpan data siswa
router.post("/datasiswa",validateToken(), (req,res) => {
   

    let data = {
         nama_siswa: req.body.nama_siswa,
         kelas: req.body.kelas,
         noabsen: req.body.noabsen
    }

    let sql = "insert into datasiswa set ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) 
    })
})

//mengubah data siswa
router.put("/datasiswa",validateToken(), (req,res) => {

    let data = [
        {
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            noabsen: req.body.noabsen
        },

        {
            id_siswa: req.body.id_siswa
        }
    ]

   let sql = "update datasiswa set ? where ?"

   db.query(sql, data, (error, result) => {
       let response = null
       if (error) {
           response = {
               message: error.message
           }
       } else {
           response = {
               message: result.affectedRows + " data updated"
           }
       }
       res.json(response) 
   })
})

//menghapus data siswa 
router.delete("/datasiswa/:id",validateToken(), (req,res) => {
    let data = {
        id_siswa: req.params.id
    }

    let sql = "delete from datasiswa where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) 
    })
})

module.exports = router