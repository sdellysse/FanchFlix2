var colors = require('colors'); //couleurs console
var fs = require('fs'); // module natif de nodejs qui gere les fichiers.
var path = require('path'); //module natif de nodejs qui gère les chemins de fichiers/dossiers.
var _ = require('lodash'); //librairie de fonctions (helpers) qui aide a la manip de tableaux, d'objets et de strings.


function getFiles(req, res, dir) {
  var currentDir =  dir; //a la base le dossier cwd.
  var query = req.query.path || '';
  var up = req.query.up;

  if (query) { //clic sur un fichier, nouveau chemin dans le query.path.
    console.log('DOWN');
    currentDir = path.join(dir, query);
  }

  if (up) {
    console.log('UP'); //clique sur la fleche UP, remonte dans l'arborescence via la fonction globale query.up.
    currentDir = query;
  }

  console.log('Dossier consulté: '.green, currentDir.cyan); //affiche dans la console le dossier consulté par l'utilsateur.
  
  fs.readdir(currentDir, function (err, files) {
    if (err) {
      throw err;
    }

    var data = [];

    files.filter(function (file) {
      return true;
    })
    .forEach(function (file) {
      try {
        data.push({ 
          name: file,
          isDirectory: fs.statSync(path.join(currentDir, file)).isDirectory(), 
          path: path.join(query, file),
          ext: path.extname(file)
        });
      }
      catch(e) {
        console.log('Error: ' + e);
      }

    });
    data = _.sortBy(data, function(f) { return f.Name; }); //helper lodash qui trie les fichiers affichés en ordre alphabetique.
    data.push(currentDir); //ajoute a la fin du fichier le chemin actuel qui sera récupéré dans currentPath.
    res.json(data); //creer le fichier json en response.
  });
}

module.exports.getFiles = getFiles;
