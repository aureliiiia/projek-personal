const { response } = require("express");
const express = require("express");
const { route } = require("./buku");
const router = express.Router();
const db = require("./db");

const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("121212") 

//-------------------------------------------------------- Data Admin --------------------------------------------------------\\

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
            let sql = "select * from admin where ?"

            // set parameter
            let param = { id_admin: decryptToken}

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



router.get("/admin",  (req, res) => {
  let sql = "select * from admin";

  db.query(sql, (error, result) => {
    let response = null;
    if (error) {
      response = {
        message: error.message,
      };
    } else {
      response = {
        count: result.length,
        admin: result,
      };
    }
    res.json(response);
  });
});

router.get("/admin/:id_admin", (req, res) => {
  let data = {
    id_admin: req.params.id_admin,

  };
  let sql = "select * from admin where ?";

  db.query(sql, data, (error, result) => {
    let response = null;
    if (error) {
      response = {
        message: error.message,
      };
    } else {
      response = {
        count: result.length,
        admin: result,
      };
    }
    res.json(response);
  });
});

router.post("/admin", (req, res) => {
  let data = {
    nama_admin: req.body.nama_admin,
    username: req.body.username,
    password: md5(req.body.password)
  };
  let sql = "insert into admin set ?";

  db.query(sql, data, (error, result) => {
    let response = null;
    if (error) {
      response = {
        message: error.message,
      };
    } else {
      response = {
        message: result.affectedRows + "data inserted`",
      };
    }
    res.json(response);
  });
});

// endpoint login user (authentication)
router.post("/admin/auth", (req, res) => {
    // tampung username dan password
    let param = [
        req.body.username, //username
        md5(req.body.password) // password
    ]
    

    // create sql query
    let sql = "select * from admin where username = ? and password = ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_admin), // generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})


router.put("/admin", validateToken(), (req, res) => {
  let data = [
    {
      nama_admin: req.body.nama_admin,
      username: req.body.username,
      password: md5(req.body.password)
    },
    {
      id_admin: req.body.id_admin,
    },
  ];

  let sql = "update admin set ? where ?";

  db.query(sql, data, (error, result) => {
    let response = null;
    if (error) {
      response = {
        message: error.message,
      };
    } else {
      response = {
        message: result.affectedRows + "data updated",
      };
    }
    res.json(response);
  });
});

router.delete("/admin/:id_admin",validateToken(), (req, res) => {
  let data = {
    id_admin: req.params.id_admin,
  };

  let sql = "delete from admin where ?";

  db.query(sql, data, (error, result) => {
    let response = null;
    if (error) {
      response = {
        message: error.message,
      };
    } else {
      response = {
        message: result.affectedRows + "data deleted",
      };
    }
    res.json(response);
  });
});

module.exports = router;
