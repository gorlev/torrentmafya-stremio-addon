var env = process.env.NODE_ENV ? 'beamup':'local';
const HttpsProxyAgent = require('https-proxy-agent');
const proxyAgent = new HttpsProxyAgent(process.env.PROXY_LINK);

var config = {
    URL: 'torrentmafya.org',
    proxy: proxyAgent.proxy.host + ":" + proxyAgent.proxy.port
}

switch (env) {
    //Public server build.
    case 'beamup':
		config.port = process.env.PORT
        config.local = "https://5a0d1888fa64-torrentmafya-stremio-addon.baby-beamup.club"
        break;

    //Local sever build.
    case 'local':
		config.port = 56940
        config.local = "http://127.0.0.1:" + config.port;
        break;
}

module.exports = config;