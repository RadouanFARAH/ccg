const express = require("express");
const router = express.Router();
const con = require("../config/db.js");
const fs = require("fs");

function convert(object_result, initialContent) {
  var content = initialContent;
  for (let i = 0; i < object_result.length; i++) {
    let contrat = object_result[i];
    for (const property in contrat) {
      if (property === "identifiant_credit") {
        content += contrat[property];
      } else {
        content += "#" + contrat[property];
      }
    }
    content += "\n";
  }
  return content;
}
router.post("/genererAnnexe", function (req, res) {
  var now = new Date();
  var datepart = now.toISOString().split("T")[0].split("-");
  var timepart = now.toISOString().split("T")[1].split(":");
  var dateformatedd = datepart[2] + datepart[1] + datepart[0].slice(2);
  con.query(
    `select * from annexe1 where dateformated like '${dateformatedd}%'`,
    (err, result) => {
      if (err) {
        res.send({ message: err, error: true });
      } else if (result.length > 0) {
        res.send({ message: "already generated", error: false });
      } else {
        var now = new Date();
        var datepart = now.toISOString().split("T")[0].split("-");
        var timepart = now.toISOString().split("T")[1].split(":");
        var dateformatedd =
          datepart[2] +
          datepart[1] +
          datepart[0].slice(2) +
          timepart[0] +
          timepart[1] +
          timepart[2].split(".")[0];
        let soap = require("soap");
        soap.createClient(
          "http://192.168.110.5:8080/CCGAAAProj/SMA?wsdl",
          (err, client) => {
            if (err) {
              console.log("******Creation soap client ERROR*****", err);
            } else {
              console.log("connected to soap");
              const args = {
                dateDEB: "20230109",
                dateFIN: "20230113",
              };
              async function insertLigne(ligne) {
                return new Promise((resolve, reject) => {
                  con.query(
                    `insert into annexe4 (identifiant_credit, nom_denomination, prenom, cin_passport_rc_cartesejour, date_de_naissance_creation, genre, experience, engagement_projet, liaison_familiale, part,dateformated) values 
          ("${ligne.ID_CREDIT.trim()}","${ligne.NOM.trim()}","${ligne.PRENOM.trim()}","${ligne.CIN.trim()}","${ligne.DATE_NAIS.trim()}","${ligne.GENRE.trim()}","${ligne.EXPER.trim()}","${ligne.ENGAG_PJT.trim()}","${ligne.LIAI_F.trim()}","${ligne.PART.trim()}", "${dateformatedd}")`,
                    (err, result) => {
                      if (err) {
                        resolve(false);
                        throw err;
                      } else {
                        resolve(true);
                      }
                    }
                  );
                });
              }
              async function insertLigne2(ligne) {
                return new Promise((resolve, reject) => {
                  con.query(
                    `insert into annexe1 (identifiant_credit, code_intervention, denom_affaire, forme_juridique, ice, justif_formalisme_type, justif_formalisme_n, code_ville, code_secteur, besoin_a_financer, motant_credit, part_amc, part_ligne, tx_int, duree_remb, duree_differe, periodicite_rembour, suretes, cotation_score, type_local, appreciation_de_lactivite, nombre_demploi_existant, nombre_demploi_a_creer, chiffre_daff, dateformated) values 
          ("${ligne.ID_CREDIT.trim()}","${ligne.CODE_INTER.trim()}","${ligne.DENOM_AFF.trim()}","${ligne.FORME_JURI.trim()}","${ligne.ICE.trim()}","${ligne.TYPE_JUST.trim()}","${ligne.N_JUST.trim()}","${ligne.CODE_VILLE.trim()}","${ligne.CODE_SECT.trim()}","${ligne.BESOIN_FIN.trim()}",${parseFloat(ligne.MT_CRE.trim())},${parseFloat(ligne.PART_A.trim())},"${ligne.PART_L.trim()}",${parseFloat(ligne.TX_INT.trim())},"${ligne.DUREE_REMB.trim()}","${ligne.DUREE_DIFF.trim()}","${ligne.PERIODIC.trim()}","${ligne.SURETE.trim()}","${ligne.COT_SCORE.trim()}","${ligne.TYPE_LOCAL.trim()}","${ligne.APPR_ACT.trim()}","${ligne.NBR_EMP.trim()}","${ligne.NBR_EMP_AC.trim()}",${parseFloat(ligne.CA.trim())}, "${dateformatedd}")`,
                    (err, result) => {
                      if (err) {
                        resolve(false);
                        throw err;
                      } else {
                        console.log("inserted");
                        resolve(true);
                      }
                    }
                  );
                });
              }
              client.getContratCCG(
                args,
                async (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    let Annexe1 = JSON.parse(result.return).Annexe1;
                    let Annexe4 = JSON.parse(result.return).Annexe4;
                    if ((Annexe1 && !Annexe1.length==0)&&(Annexe4 && !Annexe4.length==0) ) {
                      var __initContent_1 = "505#MF#1\n";
                      var __initContent_4 = "505#MF#4\n";
                      content_annexe1 = convert(Annexe1, __initContent_1);
                      content_annexe4 = convert(Annexe4, __initContent_4);
                      for (let i = 0; i < Annexe1.length; i++) {
                        let contrat = Annexe1[i];
                        await insertLigne2(contrat);
                      }
                      for (let i = 0; i < Annexe4.length; i++) {
                        let contrat = Annexe4[i];
                        await insertLigne(contrat);
                      }
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
                              "Annexe1/505-MF-1-" + dateformatedd + ".txt",
                              content,
                              () => {
                                return res.send({ message: "" });
                              }
                            );
                          }
                        }
                      );
                      con.query(
                        "select identifiant_credit, nom_denomination, prenom, cin_passport_rc_cartesejour, date_de_naissance_creation, genre, experience, engagement_projet, liaison_familiale, part from annexe4",
                        (err, result) => {
                          if (err) {
                            throw err;
                          } else if (!result.length) {
                            throw new Error("Nothing Found");
                          } else {
                            let content = convert(result, "505#MF#4\n");
                            fs.writeFile(
                              "Annexe4/505-MF-4-" + dateformatedd + ".txt",
                              content,
                              () => {
                                console.log({ message: "" });
                              }
                            );
                          }
                        }
                      );
                    }
                    
                    else{
                      return res.send({ message: "empty return", error:true });
                    }
                  }
                },
                { timeout: 180000 }
              );
            }
          }
        );
      }
    }
  );
});



module.exports = router;
