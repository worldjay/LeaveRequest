function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function formatStringdate (value){
        return value.substring(6, 10)   + value.substring(0, 2) + value.substring(3, 5);

}