require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res, next) => {
    res.render('index')
})

app.get("/artist-search", (req, res, next) => {
spotifyApi
  .searchArtists(req.query.artist)
  .then((data) => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artistArray: data.body.artists.items});
   
})
  .catch((err) =>
    console.log('The error while searching artists occurred: ', err));
});


app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then((data) => {
        console.log('Artist albums', data.body.items);
        res.render('albums', {albums: data.body.items});
       
    })
      .catch((err) =>
        console.log(err));
    });


    app.get("/songs/:albumId", (req, res, next) => {
        spotifyApi
          .getAlbumTracks(req.params.albumId)
          .then((data) => {
            console.log('Tracks', data.body.items);
            res.render('tracks', {tracklist: data.body.items});
           
        })
          .catch((err) =>
            console.log(err));
        });
    


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
