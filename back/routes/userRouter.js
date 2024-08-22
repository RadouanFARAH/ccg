
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const con = require("../config/db.js");



router.post("/login", (req, res, next) => {
  con.query(
    `SELECT * FROM users WHERE idstatut=1 and email = ${con.escape(
      req.body.identifiant
    )};`,
    (err, result) => {
      if (err) {
        return res.status(401).send({
          msg: "Erreur de Serveur",
          err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "identifiant ou password incorrect ou encours de validation!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(401).send({
              msg: "Erreur de Serveur",
            });
          }
          con.query(
            `update users set nbconnectrestant=nbconnectrestant-1,nbtentative=nbtentative-1 where name = ${con.escape(
              req.body.identifiant
            )}; `,
            (err, updated) => {
              if (err) {
                return res.status(401).send({
                  msg: "Erreur de Serveur",
                });
              }
            }
          );
          if (bResult) {
            if (result[0]["nbconnectrestant"] <= 0) {
              return res.status(401).send({
                msg: "Vous devez changer le mot de passe!",
              });
            }
            con.query(
              `update users set nbconnectrestant=nbconnectrestant-1,nbtentative=3 where name = ${con.escape(
                req.body.identifiant
              )} ;`,
              (err, updated) => {
                if (err) {
                  return res.status(401).send({
                    msg: "Erreur de Serveur",
                  });
                }
              }
            );
            let payload = {
              id: result[0].id,
              role: result[0]["role"],
            };
            console.log("creating token ...", `jwt.sign(payload, "RadouanFARAH", {expiresIn:'4h'})`);

            let token = jwt.sign(payload, "RadouanFARAH", { expiresIn: '4h' });
            console.log("token created");
            return res.status(200).send({
              token,
              role: result[0]["role"],
            });
          }
          return res.status(401).send({
            msg: "identifiant ou mot de passe incorrect ou encours de validation!",
          });
        }
      );
    }
  );
});

module.exports = router;
