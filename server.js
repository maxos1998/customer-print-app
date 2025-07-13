const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");
const bodyParser = require("body-parser");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    phone TEXT,
    product TEXT,
    printed INTEGER DEFAULT 0
)`);

app.get("/", (req, res) => {
    db.all("SELECT * FROM customers ORDER BY id DESC", [], (err, rows) => {
        res.render("index", { customers: rows });
    });
});

app.post("/add", (req, res) => {
    const { name, address, phone, product } = req.body;
    db.run("INSERT INTO customers (name, address, phone, product) VALUES (?, ?, ?, ?)",
        [name, address, phone, product], () => {
            res.redirect("/");
        });
});

app.post("/print/:id", (req, res) => {
    db.run("UPDATE customers SET printed = 1 WHERE id = ?", [req.params.id], () => {
        res.redirect("/");
    });
});

app.post("/print-all", (req, res) => {
    db.run("UPDATE customers SET printed = 1 WHERE printed = 0", () => {
        res.redirect("/");
    });
});


app.get("/edit/:id", (req, res) => {
    db.get("SELECT * FROM customers WHERE id = ?", [req.params.id], (err, row) => {
        if (!row) return res.send("ไม่พบข้อมูล");
        res.render("edit", { customer: row });
    });
});

app.post("/edit/:id", (req, res) => {
    const { fulltext } = req.body;
    db.run("UPDATE customers SET fulltext = ? WHERE id = ?", [fulltext, req.params.id], () => {
        res.redirect("/");
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
