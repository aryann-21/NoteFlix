const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    res.render("index", {files: files});
  });
});

app.get('/file/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, filedata) => {
    if (err) {
      return res.status(500).send('Unable to read file');
    }
    res.render('show', {filename: req.params.filename, filedata: filedata});
  });
});

app.get('/edit/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, filedata) => {
    if (err) {
      return res.status(500).send('Unable to read file');
    }
    res.render('edit', {filename: req.params.filename, filedata: filedata});
  });
});

app.post('/edit', (req, res) => {
  fs.writeFile(`./files/${req.body.filename}`, req.body.content, (err) => {
    if (err) {
      return res.status(500).send('Unable to update file');
    }
    res.redirect('/');
  });
});

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
    if (err) {
      return res.status(500).send('Unable to create file');
    }
    res.redirect("/");
  });
});

app.post('/delete', (req, res) => {
  fs.unlink(`./files/${req.body.filename}`, (err) => {
    if (err) {
      return res.status(500).send('Unable to delete file');
    }
    res.redirect('/');
  });
});

app.listen(3000);
