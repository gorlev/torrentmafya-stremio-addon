const { addonBuilder } = require("stremio-addon-sdk");
const pageParser = require('./lib/scraper.js')
require("dotenv").config()
const config = require('./config');

const manifest = {
	"id": "community.TorrentMafyaOrg",
	"version": "1.0.2",
	"catalogs": [],
	"resources": ["stream"],
	"types": ["movie", "series"],
	"name": "TorrentMafya",
	"description": "TorrentMafya Addon provides movie/series torrent streams from torrentmafya.org with Turkish dubbing option if it is available in SD, HD, FHD or 4K.",
	"logo": "https://www.torrentmafya.org/wp-content/uploads/2018/09/favicon-mafia.png",
	"idPrefixes": ["tt"]
}
const builder = new addonBuilder(manifest)

const CACHE_MAX_AGE = 4 * 60 * 60; // 4 hours in seconds
const STALE_REVALIDATE_AGE = 4 * 60 * 60; // 4 hours
const STALE_ERROR_AGE = 7 * 24 * 60 * 60; // 7 days
const proxyLink = process.env.PROXY_LINK

builder.defineStreamHandler( async ({type, id}) => {
	
	let seriesId =  id.split(":")[0]
	let seriesSeason = id.split(":")[1]
	let seriesEpisode = id.split(":")[2]

	const stream = await pageParser(type, seriesId, seriesSeason, seriesEpisode, proxyLink)

	return Promise.resolve({ streams: stream, cacheMaxAge: CACHE_MAX_AGE, staleRevalidate: STALE_REVALIDATE_AGE, staleError: STALE_ERROR_AGE })
	
})
console.log(config)
module.exports = builder.getInterface()