const cheerio = require('cheerio');
const parseTorrent = require('parse-torrent');
const request = require('request-promise');
const linkFinder = require('./pageFinder');


async function pageParser(type ,id, seriesSeason, seriesEpisode) {
  try {
    let elements = [];
    let dubNew;
    const base = await linkFinder.pageFinder(id);
    const mainHtml = await request(base);
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


    //console.log(elements) //Uncomment for debugging.
    return elements;
     

  } catch (e) {
    console.log("There was a problem with the scraper.",e);
  }
}


module.exports.pageParser = pageParser;