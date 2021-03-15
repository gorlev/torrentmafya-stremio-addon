const fetch = require('node-fetch');

//Finds the page to scrape by its IMDB ID.
async function pageFinder(imdbId) {
  try {

    const response = await fetch("https://www.torrentmafya.org/wp-admin/admin-ajax.php", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "action=td_ajax_search&td_string="+imdbId,
      method: "POST",
    });
    
    const data = await response.json();
    const htmldata = data['td_data']
    
    const arrMatches = htmldata.match('(?<=href=").*(?=" rel)');
    const pageLink = await arrMatches[0].toString();
    
    
    //console.log(pageLink);
    
    return pageLink;

  } catch (e) {
     console.log('This movie/series does not appear on this site!\n',e);
  }
}

module.exports.pageFinder = pageFinder;
