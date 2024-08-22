const express = require("express");
const router = express.Router();
const con = require("../config/db.js");
const fs = require("fs");
const send = require("../controllers/sendFileSFTP");
function convert(object_result, initialContent) {
  var content = initialContent;
  console.log("object_result: ", object_result);
  for (let i = 0; i < object_result.length; i++) {
    let contrat = object_result[i];
    for (const property in contrat) {
      console.log(`${property}: ${contrat[property]}`);
      if (property === "identifiant_credit") {
        content += contrat[property]; // expect first
      } else {
        content += "#" + contrat[property];
      }
    }
    content += "\n";
  }
  return content;
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

router.post("/deposerAnnexe", async function (req, res) {
  var dateformated_1 = await getDateFormated('annexe1');
  var dateformated_4 = await getDateFormated('annexe4');
  fs.readFile(
    "Annexe1/505-MF-1-" + dateformated + ".txt",
    async function (err, data) {
      if (err) {
        con.query(
          "select identifiant_credit, code_intervention, denom_affaire, forme_juridique, ice, justif_formalisme_type, justif_formalisme_n, code_ville, code_secteur, besoin_a_financer, motant_credit, part_amc, part_ligne, tx_int, duree_remb, duree_differe, periodicite_rembour, suretes, cotation_score, type_local, appreciation_de_lactivite, nombre_demploi_existant, nombre_demploi_a_creer, chiffre_daff from annexe1 where status!=1 and status is not null",
          (err, result) => {
            if (err) {
              throw err;
            } else if (!result.length) {
              res.send({ message: "already sent", error: false });
            } else {
              let content = convert(result, "505#MF#1\n");
              var now = new Date();
              var datepart = now.toISOString().split("T")[0].split("-");
              var timepart = now.toISOString().split("T")[1].split(":");
              var newdateformated =
                datepart[2] +
                datepart[1] +
                datepart[0].slice(2) +
                timepart[0] +
                timepart[1] +
                timepart[2].split(".")[0];
              fs.writeFile(
                "Annexe1/505-MF-1-" + newdateformated + ".txt",
                content,
                async () => {
                  let options = {
                    host: "10.255.255.100",
                    username: "cftuser",
                    password: "Alaman@CFT",
                    sourcePath: `Annexe1/505-MF-1-${newdateformated}.txt`,
                    destinationPath: `./depot_cft/CCG/505-MF-1-${newdateformated}.txt`,
                  };
                  await send(options);
                  return res.send({ message: "" });
                }
              );
            }
          }
        );
        con.query(
          "select identifiant_credit, nom_denomination, prenom, cin_passport_rc_cartesejour, date_de_naissance_creation, genre, experience, engagement_projet, liaison_familiale, part from annexe4 where status!=1 and status is not null",
          (err, result) => {
            if (err) {
              console.log(err)
            } else if (!result.length) {
              console.log({ message: "annexe4 already sent", error: false });
            } else {
              let content = convert(result, "505#MF#4\n");
              var now = new Date();
              var datepart = now.toISOString().split("T")[0].split("-");
              var timepart = now.toISOString().split("T")[1].split(":");
              var newdateformated =
                datepart[2] +
                datepart[1] +
                datepart[0].slice(2) +
                timepart[0] +
                timepart[1] +
                timepart[2].split(".")[0];
              fs.writeFile(
                "Annexe4/505-MF-4-" + newdateformated + ".txt",
                content,
                async () => {
                  let options = {
                    host: "10.255.255.100",
                    username: "cftuser",
                    password: "Alaman@CFT",
                    sourcePath: `Annexe4/505-MF-1-${newdateformated}.txt`,
                    destinationPath: `./depot_cft/CCG/505-MF-4-${newdateformated}.txt`,
                  };
                  let data_4 = fs.readFileSync("Annexe4/505-MF-4-" + dateformated + ".txt")
                  await send(options)
                  console.log("annexe4",{ message: "" });
                }
              );
            }
          }
        );
      } else {
        con.query(
          "select identifiant_credit, code_intervention, denom_affaire, forme_juridique, ice, justif_formalisme_type, justif_formalisme_n, code_ville, code_secteur, besoin_a_financer, motant_credit, part_amc, part_ligne, tx_int, duree_remb, duree_differe, periodicite_rembour, suretes, cotation_score, type_local, appreciation_de_lactivite, nombre_demploi_existant, nombre_demploi_a_creer, chiffre_daff from annexe1",
          (err, result) => {
            if (err) {
              throw err;
            } else if (!result.length) {
              throw new Error("Nothing Found");
            } else {
              let content = convert(result, "505#MF#1\n");
              fs.writeFile(
                "505-MF-1-" + dateformated + ".txt",
                content,
                () => {
                  fs.readFile(
                    "Annexe1/505-MF-1-" + dateformated + ".txt",
                    async function (err, data) {
                      let options = {
                        host: "10.255.255.100",
                        username: "cftuser",
                        password: "Alaman@CFT",
                        sourcePath: `Annexe1/505-MF-1-${dateformated}.txt`,
                        destinationPath: `./depot_cft/CCG/505-MF-1-${dateformated}.txt`,
                      };
                      await send(options);
                      return res.send({ message: "" });
                    }
                  );
                }
              );
            }
          }
        );
        con.query(
          "select identifiant_credit, nom_denomination, prenom, cin_passport_rc_cartesejour, date_de_naissance_creation, genre, experience, engagement_projet, liaison_familiale, part from annexe4 where status!=1 and status is not null",
          (err, result) => {
            if (err) {
              throw err;
            } else if (!result.length) {
              throw new Error("Nothing Found");
            } else {
              let content = convert(result, "505#MF#4\n");
              fs.writeFile(
                "505-MF-4-" + dateformated + ".txt",
                content,
                () => {
                  fs.readFile(
                    "Annexe4/505-MF-4-" + dateformated + ".txt",
                    async function (err, data) {
                      let options = {
                        host: "10.255.255.100",
                        username: "cftuser",
                        password: "Alaman@CFT",
                        sourcePath: `Annexe4/505-MF-4-${dateformated}.txt`,
                        destinationPath: `./depot_cft/CCG/505-MF-4-${dateformated}.txt`,
                      };
                      await send(options);
                      console.log({ message: "" });
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
});

module.exports = router;
