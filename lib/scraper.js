const cheerio = require('cheerio');
const parseTorrent = require('parse-torrent');
const fetch = require('node-fetch');
const pageFinder = require('./pageFinder');
const HttpsProxyAgent = require('https-proxy-agent');

async function pageParser(type ,id, seriesSeason, seriesEpisode, proxyLink) {
  try {
    let elements = [];
    let dubNew;

    const proxyAgent = new HttpsProxyAgent(proxyLink);

    const base = await pageFinder(id,proxyLink)
    const mainHtmlResponse = await fetch(base, { agent: proxyAgent});
    const mainHtml = await mainHtmlResponse.text()

    const $ = cheerio.load(mainHtml);

    //Scrapes all the necessary items.
    $('tr').each((i, section) => {
      const nameOfFile = $(section).children("td").first().text();
      const magnetLink =   $(section).children("td").children("a").last().attr('href');
      const size =   $(section).children("td").children(".boyut").text();
      const seeder =   $(section).children("td").children(".sayiGonderen").text();
      const leecher =   $(section).children("td").children(".sayiIndiren").text();
      const resolution =  nameOfFile.split(" ").pop();
      const dub =  $(section).children("td").children("img").attr("title");
      
      //Changes the dubbing string. It can be changed later on request. 
      if (dub === 'Orijinal Ses') {
        dubNew = '';
      } else {
        dubNew = 'Turkish Dubbed | Türkçe Seslendirme'
      }
      
      //Creates array for streams.
      if (type === 'movie') {
        elements.push({
          'name': `TorrentMafya\n ${resolution}`,
          'title': `${parseTorrent(magnetLink).name}\n${size}  S: ${seeder}  L: ${leecher}\n${dubNew}`,
          'infoHash': parseTorrent(magnetLink).infoHash })

      } else if (type === 'series'){ 

        if (nameOfFile.includes(seriesSeason + ".")) {

          elements.push({
            'name': `TorrentMafya\n ${resolution}`,
            'title': `${parseTorrent(magnetLink).name}\n${size}   S: ${seeder}  L: ${leecher}\n${dubNew}`,
            'infoHash': parseTorrent(magnetLink).infoHash,
            'fileIdx': seriesEpisode-1,
          })
        }

      }

    }).get();

    return elements;
     
  } catch (e) {
      console.log("There was a problem with the scraper.",e);
    return elements = []
  }
}

module.exports = pageParser;