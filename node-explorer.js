#!/usr/bin/env node

//Nous sommes coté server, donc tous les console.log seront dans le terminal raspberry.
//La variable app n'a aucun lien avec le nom du script app.js !!

var http = require('http');
var express = require('express'); //permets de creer les routes rapidement.
var program = require('commander'); //permets d'ajouter des options dans la console. ()
var colors = require('colors'); //permets les couleurs sur la console
var srttovtt = require('srt-to-vtt/srttovtt');
srttovtt.srttovtt(dir);

program
    .option('-p, --port <port>', 'Port number, default value is 8080') //permets de pouvoir se connecter sur le port que l'on souhaite -p 3000 .
    .parse(process.argv);

var app = express();
var dir = '/var/www/html/storage/files/'; //définit la variable dir comme le dossier dans lequel on execute node-explorer.js (cwd, cd).
var controller = require('./controller');

app.use(express.static(dir)); //le dossier ou le doc html peut envoyer des requetes (css, autres js, ...)
app.use(express.static(__dirname));

var server = http.createServer(app);

app.get('/files', function(req, res) { //reception du fichier XHR avec la liste des fichiers.
	controller.getFiles(req, res, dir); //execute la fonction getFiles du controleur avec ses parametres définis auparavants. (dir)
    srttovtt.srttovtt(dir);
});

app.get('/', function(req, res) {
    res.redirect('lib/index.html'); // Définition de la page d'accueil.
    console.log("Le client sur la page d'accueil");

});

program.port = program.port || 8088; //config port
server.listen(program.port); //activation de l'ecoute du port.

console.log('Node-explorer est activé sur le port http://localhost:'.magenta + program.port);

console.log('__dirname :' + __dirname);
console.log('__filename :' + __filename);
