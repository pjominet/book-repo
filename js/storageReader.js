/**
 * Created by Patrick Jominet on 24.05.16.
 */

$(document).ready(function () {

    $("#title").append(sessionStorage.getItem('title'));
    $("#author").append(sessionStorage.getItem('author'));
    $("#isbn").append(sessionStorage.getItem('isbn'));
    $("#abstract").append(sessionStorage.getItem('abstract'));
    $("#pages").append(sessionStorage.getItem('pages'));

});