const { addonBuilder } = require("stremio-addon-sdk");
const pageParser = require('./lib/scraper.js')


// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.TorrentMafyaOrg",
	"version": "1.0.1",
	"catalogs": [],
	"resources": [
		"stream"
	],
	"types": [
		"movie",
		"series"
	],
	"name": "TorrentMafya",
	"description": "TorrentMafya Addon provides movie/series torrent streams from torrentmafya.org with Turkish dubbing option if it is available in SD, HD, FHD or 4K.",
	"logo": "https://www.torrentmafya.org/wp-content/uploads/2018/09/favicon-mafia.png",
	"idPrefixes": [
		"tt"
	]
}
const builder = new addonBuilder(manifest)


builder.defineStreamHandler( async ({type, id}) => {
	console.log("request for streams: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
	
		let seriesId =  id.split(":")[0]
		let seriesSeason = id.split(":")[1]
		let seriesEpisode = id.split(":")[2]
		
		const stream = await pageParser.pageParser(type, seriesId, seriesSeason, seriesEpisode)

		return Promise.resolve({ streams: stream })
})

module.exports = builder.getInterface()