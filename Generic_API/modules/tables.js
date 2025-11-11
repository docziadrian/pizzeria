const express = require("express");
const router = express.Router();
const { query } = require("../utils/database");
const logger = require("../utils/logger");
const SHA1 = require("crypto-js/sha1");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// ============================================
// SPECIÁLIS ÚTVONALAK (ezeknek ELŐRE kell jönniük!)
// ============================================

//LOGIN method
router.post("/:table/login", (req, res) => {
  const { email, password } = req.body;
  const table = req.params.table;

  if (!email || !password) {
    res.status(400).send({ error: "HIBA! Nem adtál meg minden adatot!" });
    return;
  }

  query(
    `SELECT * FROM ${table} WHERE email = ? AND password = ? `,
    [email, SHA1(password).toString()],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length == 0)
        return res
          .status(400)
          .json({ error: "HIBA! Hibás belépési adatok fijú." });
      logger.verbose(
        `[POST /${table}/login] -> ${results.length} rekord küldve válaszként`
      );
      res.status(200).send(results);
    },
    req
  );
});

//REGISTER method
router.post("/:table/registration", (req, res) => {
  const table = req.params.table;
  const { name, email, password, confirm } = req.body;

  if (!name || !email || !password || !confirm)
    return res
      .status(400)
      .json({ error: "HIBA! Nem adtál meg minden adatot te fijú!" });

  if (password != confirm)
    return res
      .status(400)
      .json({ error: "HIBA! Nem egyezik az általad megadott két jelszó!" });

  if (!password.match(passwdRegExp))
    return res
      .status(400)
      .json({ error: "HIBA! Az általad megadott jelszó nem elég erős!" });

  query(
    `SELECT id FROM ${table} WHERE email=?`,
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length != 0)
        return res.status(400).json({
          error: "HIBA! Az általd választott e-mail cím már foglalt!",
        });

      query(
        `INSERT INTO ${table} (name, email, password, role) VALUES (?,?,?, 'user')`,
        [name, email, SHA1(password).toString()],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          logger.verbose(
            `[POST /${table}/registration] -> 1 új felhasználó regisztrálva.`
          );
          res
            .status(200)
            .send({ success: true, message: "Sikeres regisztráció!" });
        },
        req
      );
    },
    req
  );
});

// Jelszó változtatás
router.patch("/:table/:id/change-password", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "HIBA! Nem adtál meg minden adatot!" });
  }

  if (!newPassword.match(passwdRegExp)) {
    return res.status(400).json({ error: "HIBA! Az új jelszó nem elég erős!" });
  }

  query(
    `SELECT id FROM ${table} WHERE id = ? AND password = ?`,
    [id, SHA1(currentPassword).toString()],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "HIBA! Hibás jelenlegi jelszó!" });
      }

      query(
        `UPDATE ${table} SET password = ? WHERE id = ?`,
        [SHA1(newPassword).toString(), id],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          logger.verbose(
            `[PATCH /${table}/${id}/change-password] -> Jelszó frissítve.`
          );
          res
            .status(200)
            .json({ success: true, message: "Sikeres jelszó változtatás!" });
        },
        req
      );
    },
    req
  );
});

// Foglalás ellenőrzés - adott asztal adott napon és időpontban foglalt-e
router.get("/reservations/check/:tableId/:date/:time", (req, res) => {
  const tableId = req.params.tableId;
  const date = req.params.date;
  const time = req.params.time;

  query(
    `SELECT * FROM reservations WHERE tableId = ? AND date = ? AND time = ? AND status IN ('folyamatban', 'sikeres')`,
    [tableId, date, time],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /reservations/check/${tableId}/${date}/${time}] -> ${results.length} foglalás találva`
      );
      res.status(200).send({
        isAvailable: results.length === 0,
        reservations: results,
      });
    },
    req
  );
});

// Felhasználó foglalásai
router.get("/reservations/user/:userId", (req, res) => {
  const userId = req.params.userId;

  query(
    `SELECT * FROM reservations WHERE userId = ? ORDER BY date DESC, time DESC`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /reservations/user/${userId}] -> ${results.length} foglalás küldve`
      );
      res.status(200).send(results);
    },
    req
  );
});

// Foglalás státusz frissítése
router.patch("/reservations/:id/status", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const validStatuses = ["folyamatban", "sikeres", "megszakitott"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "HIBA! Érvénytelen státusz!" });
  }

  query(
    `UPDATE reservations SET status = ? WHERE id = ?`,
    [status, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[PATCH /reservations/${id}/status] -> Státusz frissítve: ${status}`
      );
      res.status(200).send({ success: true, message: "Státusz frissítve!" });
    },
    req
  );
});

// Felhasználó megrendelt pizzái (egyedi lista)
router.get("/orders/user/:userId/pizzas", (req, res) => {
  const userId = req.params.userId;

  query(
    `SELECT DISTINCT p.id, p.nev as name, p.kepURL as image 
     FROM orders o 
     JOIN pizza p ON o.pizzaID = p.id 
     WHERE o.userID = ?
     ORDER BY p.nev`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /orders/user/${userId}/pizzas] -> ${results.length} pizza küldve`
      );
      res.status(200).send(results);
    },
    req
  );
});

// Felhasználó értékelései
router.get("/reviews/user/:userId", (req, res) => {
  const userId = req.params.userId;

  query(
    `SELECT * FROM reviews WHERE userId = ? ORDER BY createdAt DESC`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /reviews/user/${userId}] -> ${results.length} értékelés küldve`
      );
      res.status(200).send(results);
    },
    req
  );
});

// Pizza értékelései
router.get("/reviews/pizza/:pizzaId", (req, res) => {
  const pizzaId = req.params.pizzaId;

  query(
    `SELECT * FROM reviews WHERE pizzaId = ? ORDER BY createdAt DESC`,
    [pizzaId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /reviews/pizza/${pizzaId}] -> ${results.length} értékelés küldve`
      );
      res.status(200).send(results);
    },
    req
  );
});

// Értékelés létrehozása és pizza átlagos értékelésének frissítése
router.post("/reviews", (req, res) => {
  const { userId, userName, pizzaId, pizzaName, rating, comment } = req.body;

  // Értékelés beszúrása
  query(
    `INSERT INTO reviews (userId, userName, pizzaId, pizzaName, rating, comment) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, userName, pizzaId, pizzaName, rating, comment],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Pizza átlagos értékelésének és számának frissítése
      query(
        `UPDATE pizza 
         SET averageRating = (
           SELECT ROUND(AVG(rating), 1) FROM reviews WHERE pizzaId = ?
         ),
         reviewCount = (
           SELECT COUNT(*) FROM reviews WHERE pizzaId = ?
         )
         WHERE id = ?`,
        [pizzaId, pizzaId, pizzaId],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Hiba a pizza értékelés frissítésekor:", updateErr);
          }

          logger.verbose(
            `[POST /reviews] -> Értékelés létrehozva és pizza frissítve`
          );
          res.status(201).send({
            success: true,
            message: "Értékelés sikeresen létrehozva!",
            id: results.insertId,
          });
        },
        req
      );
    },
    req
  );
});

// Értékelés törlése és pizza értékelésének frissítése
router.delete("/reviews/:id", (req, res) => {
  const id = req.params.id;

  // Először lekérjük a pizzaId-t
  query(
    `SELECT pizzaId FROM reviews WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Értékelés nem található!" });
      }

      const pizzaId = results[0].pizzaId;

      // Értékelés törlése
      query(
        `DELETE FROM reviews WHERE id = ?`,
        [id],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            return res.status(500).json({ error: deleteErr.message });
          }

          // Pizza értékelésének frissítése
          query(
            `UPDATE pizza 
             SET averageRating = COALESCE((
               SELECT ROUND(AVG(rating), 1) FROM reviews WHERE pizzaId = ?
             ), 0.0),
             reviewCount = (
               SELECT COUNT(*) FROM reviews WHERE pizzaId = ?
             )
             WHERE id = ?`,
            [pizzaId, pizzaId, pizzaId],
            (updateErr, updateResults) => {
              if (updateErr) {
                console.error(
                  "Hiba a pizza értékelés frissítésekor:",
                  updateErr
                );
              }

              logger.verbose(
                `[DELETE /reviews/${id}] -> Értékelés törölve és pizza frissítve`
              );
              res.status(200).send({
                success: true,
                message: "Értékelés sikeresen törölve!",
              });
            },
            req
          );
        },
        req
      );
    },
    req
  );
});

// ============================================
// GENERIKUS ÚTVONALAK (ezek az utolsók)
// ============================================

// Select ALL RECORD FROM TABLE
router.get("/:table", (req, res) => {
  const table = req.params.table;
  query(
    `SELECT * FROM ${table}`,
    [],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /${table}] -> ${results.length} rekord küldve válaszként`
      );
      res.status(200).send(results);
    },
    req
  );
});

//SELECT ONE RECORD BY ID FROM TALBE
router.get("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  query(
    `SELECT * FROM ${table} WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /${table}] -> ${results.length} rekord küldve válaszként`
      );
      res.status(200).send(results);
    },
    req
  );
});

//SELECT records FROM :table by :field
router.get("/:table/:field/:operator/:value", (req, res) => {
  const table = req.params.table;
  const field = req.params.field;
  const operator = getOp(req.params.operator);
  let value = req.params.value;

  if (req.params.operator == "lk") {
    value = `%${value}%`;
  }
  query(
    `SELECT * FROM ${table} WHERE ${field}${operator}?`,
    [value],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(
        `[GET /${table}] -> ${results.length} rekord küldve válaszként`
      );
      res.status(200).send(results);
    },
    req
  );
});

//ADD NEW record to :table
router.post("/:table", (req, res) => {
  const table = req.params.table;
  const fields = Object.keys(req.body).join(",");
  console.log(req.body);
  const values = '"' + Object.values(req.body).join('", "') + '"';
  query(
    `INSERT INTO ${table} (${fields}) VALUES (${values})`,
    [],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[POST /${table}] -> 1 rekord feltöltésre került.`);
      res.status(200).send(results);
    },
    req
  );
});

//UPDATE records in :table by :id
router.patch("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);
  let updates = [];
  for (let i = 0; i < fields.length; i++) {
    updates.push(`${fields[i]}='${values[i]}'`);
  }
  let str = updates.join(",");
  query(
    `UPDATE ${table} SET ${str} WHERE id=?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[PATCH /${table}/${id}] -> 1 rekord frissítve.`);
      res.status(200).send(results);
    },
    req
  );
});

//DELETE ONE RECORD BY ID FROM TALBE
router.delete("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  query(
    `DELETE FROM ${table} WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[DELETE /${table}/${id}] -> 1 rekord törölve.`);
      res.status(200).send(results);
    },
    req
  );
});

//DELETE ALL RECORDS
router.delete("/:table/", (req, res) => {
  const table = req.params.table;
  query(
    `DELETE FROM ${table}`,
    [],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[DELETE /${table}] -> Minden rekord törölve.`);
      res.status(200).send(results);
    },
    req
  );
});

module.exports = router;

function getOp(op) {
  switch (op) {
    case "eq": {
      return " = ";
    }
    case "lt": {
      return " < ";
    }
    case "lte": {
      return " <= ";
    }
    case "gt": {
      return " > ";
    }
    case "gte": {
      return " >= ";
    }
    case "not": {
      return " <> ";
    }
    case "lk": {
      return " LIKE ";
    }
    default: {
      return " = ";
    }
  }
}
