
const express = require("express");
const router = express.Router();
const con = require("../config/db.js");

async function update(data,annexe) {
  var updatePart = "set id=id"
  for (const property in data) {
    updatePart += `,${property}= "${data[property]}"`
  }
  return new Promise((resolve, reject) => {
    con.query(`update ${annexe} ${updatePart} where  identifiant_credit="${data['identifiant_credit']}"`,
      (err, result) => {
        if (err) {
          console.log(err);
          throw err
          resolve(null)
        } else {
          resolve(result)
        }
      })
  })
}
router.post("/update", async (req, res) => {
  await update(req.body, req.body.annexe)
  res.send({ message: "OK" })
})
module.exports = router;
