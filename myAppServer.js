var express = require('express'),
    Yelp = require('yelp'),
    Dodge = require("dodge"),
    app = express();
app.use(express.static(__dirname + '/src'));

var yelp = new Yelp({
    consumer_key: 'hyIQVkkGLREDsZobyPp5dQ',
    consumer_secret: 'UgKdpO46BHlEOT-3K3MIPilF-Ro',
    token: 'PCPmAjNSEpcZ4T7TFaQ3VKj8-nhhRhWJ',
    token_secret: 'uF-cSlKj9usvzCIjSeVzwR2OcS8'
});

var fourSquare = new Dodge({
    clientId: 'UYRIOENZCDMQIPJ11NOFOFAY10VEP5SQH5O45KDGOFPS0RH4',
    clientSecret: 'XOKP41JLNNVEVPWTQ3E53PJSOYVITDBL5SAROWSKVLIHMEVD'
});

function loadData(options, callBack) {
    yelp.search({term: options.term, location: options.location})
        .then(function (yelpData) {
            fourSquare.venues.search({near: options.location, query: options.term}, function (err, venues) {
                if (err) {
                    console.error(err)
                } else {
                    console.log('venue',venues);
                    var data = {
                        yelpData: yelpData.businesses,
                        fourSquareData: venues
                    };
                    callBack(null, data);
                }
            });
        })
        .catch(function (error) {
            callBack(error);
        });
}

app.get('/search', function (request, response) {
    var param = request.query;
    loadData(param, function (err, data) {
        if (err) {
            response.send({error: true});
        } else {
            response.send(data);
        }
    });
});

app.listen(2222);
console.log('Running......2222');