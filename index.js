var express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const h2m = require('h2m');

var app = express();
var bodyParser = require('body-parser');

var pullVerseInfo = function (verseUrl) {
	return new Promise(function (resolve, reject) {
		console.log("Getting ", verseUrl);
		request(verseUrl, function (error, verseResponse, verseBody) {
		  if (error) {
			reject(error)
		  }
		  const versePage = cheerio.load(verseBody, { decodeEntities: false });
		  let messageContent = versePage('body .sub-content .the-message').html();
		  let messageContentAsMarkdown = h2m(messageContent);
		  resolve(messageContentAsMarkdown);
		});
	})
  }

app.use(bodyParser.json()) // for parsing application/json
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.get('/', async function (req, res) {
	let verseUrl = req.query.verseUrl;
	console.log("URL", verseUrl);
	res.send(await pullVerseInfo(verseUrl));
	res.end();
})

// Finally, start our server
app.listen(3000)