function URIUtil() {

}

URIUtil.prototype.createElasticsearchUri = function (options) {
    var uri = "http://";
    if (options.username && options.username != "" && options.password && options.password != "") {
        uri += options.username + ":" + options.password + "@";
    }
    uri += options.host + ":" + options.port;
    return uri;
}

module.exports = URIUtil;
