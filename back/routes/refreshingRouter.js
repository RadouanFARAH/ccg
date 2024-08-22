const express = require("express");
const router = express.Router();
const con = require("../config/db.js");
const fs = require("fs");
const path = require("path");

async function getContrats(annexe) {
  return new Promise((resolve, reject) => {
    var now = new Date();
    var datepart = now.toISOString().split("T")[0].split("-");
    var timepart = now.toISOString().split("T")[1].split(":");
    var dateformatedd = datepart[2] + datepart[1] + datepart[0].slice(2);
    con.query(
      `select * from ${annexe} where dateformated like '${dateformatedd}%'`,
      (err, result) => {
        if (err) {
          console.log(err);
          resolve([]);
        } else {
          resolve(result);
        }
      }
    );
  });
}
async function getDateFormated(annexe) {
  return new Promise((resolve, reject) => {
    con.query(
      `select dateformated from ${annexe} where status !=1 order by id limit 1`,
      (err, result) => {
        if (err) {
          throw err;
        } else if (result.length > 0) {
          console.log("found :", result);
          let dateformated = result[0].dateformated;
          resolve(dateformated);
        } else {
          con.query(
            `select dateformated from ${annexe} order by id limit 1`,
            (err, result) => {
              if (err) {
                throw err;
              } else if (result.length > 0) {
                let dateformated = result[0].dateformated;
                resolve(dateformated);
              } else {
                resolve(null);
              }
            }
          );
        }
      }
    );
  });
}
async function InsertContrat(data, annexe) {
  return new Promise((resolve, reject) => {
    let content = data.split("\n");
    var number = 0;
    var done = 0;
    for (let i = 1; i < content.length; i++) {
      let contrat = content[i].split("#")[0];
      if (contrat) {
        number++;
        let status = content[i].slice(content[i].lastIndexOf("#") + 1);
        con.query(
          `update  ${annexe} set status ="${status}" where identifiant_credit="${contrat}"`,
          async (err, result) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              done++;
            }
          }
        );
      }
    }
    if (done === number) {
      resolve(done);
    } else {
      resolve(null);
    }
  });
}

router.post("/actualiser", async function (req, res) {
  var dateformated_1 = await getDateFormated("annexe1");
  var dateformated_4 = await getDateFormated("annexe4");
  var dir_1 = path.join(
    process.cwd(),
    "/Annexe1/505-MF-R1-" + (dateformated_1 || "22001997491") + ".txt"
  );
  var dir_4 = path.join(
    process.cwd(),
    "/Annexe4/505-MF-R4-" + (dateformated_4 || "22001997491") + ".txt"
  );
  var contrats_1 = await getContrats("annexe1");
  var contrats_4 = await getContrats("annexe4");

  var contrats = { contrats_1, contrats_4 };
  var readFiles = async () => {
    return new Promise((resolve, reject)=>{
      fs.readFile(dir_1, (err, data_1) => {
        if (!err) {
          fs.readFile(dir_4, (err4, data_4) => {
            if (!err4) {
              resolve({ data_1, data_4 });
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    }) 
  };
  var data = await readFiles();
  if (data) {
    
    var data_1 = data.data_1
    var data_4 = data.data_4
    await InsertContrat(data_1, "annexe1");
    contrats_1 = await getContrats("annexe1");
    await InsertContrat(data_4, "annexe4");
    contrats_4 = await getContrats("annexe4");
  }
  return res.send(contrats);
});

module.exports = router;
