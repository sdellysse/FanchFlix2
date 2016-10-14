

var movie;
imdb.getReq({ name: 'The Toxic Avenger' }, function(err, things) {
    movie = things;
});



console.log(movie);
