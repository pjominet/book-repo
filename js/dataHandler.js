/**
 * Created by Patrick Jominet on 03.06.16.
 */


//$.get("data/search.json", function (data) {
$.get("php/db_handler.php", function (data) {

    /** Data Handler **/
    $('a.getInfo').click(
        function (event) {
            var itemID = event.target.id;

            itemID = itemID.replace('item_', '');

            sessionStorage.setItem('title', data[itemID].title);
            sessionStorage.setItem('author', data[itemID].author);
            sessionStorage.setItem('isbn', data[itemID].ISBN);
            sessionStorage.setItem('abstract', data[itemID].abstract);
            sessionStorage.setItem('pages', data[itemID].pages);
        });
});