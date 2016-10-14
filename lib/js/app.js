function ViewModel() { //fonction qui modifie le prototype d'objet.

    var self = this;
    var rootDir = null;
    var extensionsMap = {
        ".zip": "fa-file-archive-o",
        ".gz": "fa-file-archive-o",
        ".bz2": "fa-file-archive-o",
        ".xz": "fa-file-archive-o",
        ".rar": "fa-file-archive-o",
        ".tar": "fa-file-archive-o",
        ".tgz": "fa-file-archive-o",
        ".tbz2": "fa-file-archive-o",
        ".z": "fa-file-archive-o",
        ".7z": "fa-file-archive-o",
        ".mp3": "fa-file-audio-o",
        ".cs": "fa-file-code-o",
        ".c++": "fa-file-code-o",
        ".cpp": "fa-file-code-o",
        ".js": "fa-file-code-o",
        ".xls": "fa-file-excel-o",
        ".xlsx": "fa-file-excel-o",
        ".png": "fa-file-image-o",
        ".jpg": "fa-file-image-o",
        ".jpeg": "fa-file-image-o",
        ".gif": "fa-file-image-o",
        ".mpeg": "fa-file-movie-o",
        ".pdf": "fa-file-pdf-o",
        ".ppt": "fa-file-powerpoint-o",
        ".pptx": "fa-file-powerpoint-o",
        ".txt": "fa-file-text-o",
        ".log": "fa-file-text-o",
        ".doc": "fa-file-word-o",
        ".docx": "fa-file-word-o",
    };
    var motclef = "E.T";

    //observables data-bind knockout 
    this.currentPath = ko.observable(); //envoie le changement vers le DOM (liée).
    this.filter = ko.observable('');
    this.files = ko.observableArray();
    this.pathArray = ko.observableArray();
    this.cheminAbsolu = ko.observable();
    this.cheminSRT = ko.observable();
    this.dataOverview = ko.observable();
    this.dataImg = ko.observable();





    //fonction de depart
    this.init = function() {
        this.getFiles('/files'); //au chargement de la page le fichier XHR "/files" est obtenu dans la fonction prédéfinie.
        this.getMovie("Peter Pan");

    };







    //fonction de recherche de fichier

    this.filteredFiles = ko.computed(function() {

        var search = self.filter().toLowerCase();

        return ko.utils.arrayFilter(self.files(), function(file) {
            return file.name.toLowerCase().indexOf(search) >= 0;
        });
    });






    //fonction pour remonter l'arborescence des fichiers
    this.goUp = function(path) {

        var cheminEntier = self.currentPath().split("/");
        var max = cheminEntier.length;
        var newPath = cheminEntier[max - 2];

        console.log("Nouveau chemin :" + newPath);

        if (rootDir === self.currentPath()) { //déjà dans le dossier racine
            console.log("Impossible de remonter plus !");

            return;


        } else if (newPath === 'files') { //dans un dossier du premier niveau

            this.getFiles('/files'); //retour à l'index de fichier de départ.
            console.log("Dossier racine");

            return;

        }


        // var idx = self.currentPath().lastIndexOf('/'); //indice du dernier caractère finissant par /
        //var path = self.currentPath().substr(0, idx); //retourne les lettres de l'indice 0 (gauche) jusqu'à idx (/).
        else { //dans un dossier de niveau 2 et plus.

            var ancien_dossier = '/files?path=' + newPath;

            this.getFiles(ancien_dossier); //indique au getFiles la direction du dossier parent.

            self.currentPath(path);

        }
    };






    //fonction de requete JSOn pour un film/Serie/...
    // La methode getFiles AJAX Jquery OBTIENT le fichier qui à le nom du chemin (/files) avec la liste des objets fichiers. 
    //Une fonction callback est ensuite executée, pour pouvoir verouiller les données (datas).

    this.getMovie = function(movie) {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.themoviedb.org/3/search/multi?query=" + movie + "&language=fr&api_key=0becf227c5a6e16f7aa44437fc2dfec2",
            "method": "GET",
            "headers": {},
            "processData": false,
            "data": "{}"
        };

        $.ajax(settings).done(function(response) {
            console.log(response);
            self.dataOverview(response.results['0'].overview);
            self.dataImg('https://image.tmdb.org/t/p/w500/' + response.results['0'].poster_path);
        });

    };








    //fonction qui creer l'explorateur a l'ouverture de la page.
    this.getFiles = function(path, done) {
        $.get(path).then(function(data) {

            //la methode pop supprime le dernier element du tableau et retourne sa valeur.
            //ici, c'est le chemin actuel entier : var/www/...

            var dir = data.pop();

            //envoie le chemin actuel(dir) vers la propriété observable currentPath définie auparavant.
            self.currentPath(dir);


            if (!rootDir) {
                rootDir = dir;
            }

            for (var d in data) { //affichage de la liste de fichier
                data[d].icon = data[d].isDirectory ? 'fa-folder' : getIcon(data[d].ext);
            }

            self.files(data); //permet surement de conserver à l'exterieur de cette fonction callback les données fichiers. (pr la recherche filter)
            self.filter(''); //par defaut la liste triée se réalise sur "". (rien)


            var b = dir.substring(dir.lastIndexOf('storage/') + 7);
            var breadcrumb = b.split("/");




            self.pathArray(

                breadcrumb



            );



            if (done) done();
        });
    };








    //fonction qui actualise le chemin lors des clics.

    this.getDirectoryFiles = function() {

        if (this.isDirectory) { //un dossier

            var lienFuturDossier = '/files?path=' + this.path;

            self.getFiles(lienFuturDossier); //renvoie un nouvel argument au getFiles qui actualise un nouveau repertoire. 
            //Va demander de recuperer le fichier JSON correspondant en l'envoyant en parametre.

            console.log("Lien JSON :" + lienFuturDossier);
            return false;
        } else { //si c'est un fichier.

            var pathRelative = this.path; //retourne le nom du fichier sans le chemin avant.

            var nomFichier = pathRelative.replace(/^.*[\\\/]/, ''); //nom du fichier avec extension
            var nomFichierExt = nomFichier.substr(0, nomFichier.lastIndexOf('.')); //nom du fichier sans Extension

            var pathAbsolute = "http://franckapik.no-ip.org:8088/" + pathRelative; //chemin complet avec extension
            var pathAbsoluteExt = pathAbsolute.substr(0, pathAbsolute.lastIndexOf('.')); //chemin complet sans extension


            console.log("Lecture de :" + nomFichierExt);

            self.getMovie(nomFichierExt);

            self.cheminAbsolu(pathAbsolute); //envoie le nom du fichier au lecteur video en data-binding.


            self.cheminSRT(pathAbsoluteExt + '.vtt');




            return false;
        }

    };



    //fonction qui recherche et affiche les icones selon l'extension.
    function getIcon(ext) {
        return (ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o'; //recherche et affiche l'icone en fonction de l'extension du fichier. fa-file-o est l'icone par defaut.

    }


}


var vm = new ViewModel(); //creation de l'objet selon le protoype precedent.
vm.init(); //lance la methode init de l'objet.



$(document).ready(function() {
    //binding sur la div d'identifiant container
    ko.applyBindings(vm); //applique les liaisons


});


