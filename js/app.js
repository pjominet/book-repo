/**
 * Created by Patrick Jominet on 30.05.16.
 */
$(document).ready(function () {

    /** Initialization **/
    var books;
    var searchResults = 0;
    var matchBookIndexes = [];
    var searchByOption = 0; //default state
    var appendState = false; //default state
    var searchBar = $('#searchBar');
    var searchButton = $('#searchButton');
    var resetButton = $('#clearButton');
    searchBar.focus();

    /** Json Handler **/
    //$.get("data/search.json", function (data) {
    $.get('php/db_handler.php', function (data) {
        books = data;

        /** Homecoming **/
        if (sessionStorage.getItem('input') != null) {
            var oldInput = sessionStorage.getItem('input');
            var oldSearchByOption = sessionStorage.getItem('searchByOption');
            searchBar.val(oldInput);
            if (oldSearchByOption == 1) {
                changeDropdownLabel('Titles');
                searchBar.prop('disabled', false);
                searchButton.prop('disabled', false);
            } else if (oldSearchByOption == 2) {
                changeDropdownLabel('Authors');
                searchBar.prop('disabled', false);
                searchButton.prop('disabled', false);
            } else if (oldSearchByOption == 3) {
                changeDropdownLabel('Both');
                searchBar.prop('disabled', false);
                searchButton.prop('disabled', false);
            }
            searchByOption = oldSearchByOption;
            goSearch(oldInput);
            resultPanelHandler();
            $.getScript('js/dataHandler.js');
        }
        console.log('ajax success');
    });

    /** Action Handler **/
    // when any key is pressed
    searchBar.keyup(
        function () {
            executeSearch();
        });

    // when search button is clicked
    searchButton.click(
        function () {
            executeSearch();
        });

    $('#searchByTitles').click(
        function (event) {
            event.preventDefault();
            if (!appendState) {
                appendDropdownDefault();
                appendState = true;
            }
            changeDropdownLabel('Titles');
            searchByOption = 1;
            var checkInput = searchBar.val();
            if (checkInput != '') {
                executeSearch();
            }
            searchBar.focus();
        });

    $('#searchByAuthors').click(
        function (event) {
            event.preventDefault();
            if (!appendState) {
                appendDropdownDefault();
                appendState = true;
            }
            changeDropdownLabel('Authors');
            searchByOption = 2;
            var checkInput = searchBar.val();
            if (checkInput != '') {
                executeSearch();
            }
            searchBar.focus();
        });

    $('#dropdownLabelList').on('click', '#searchByAll', function (event) {
        event.preventDefault();
        changeDropdownLabel('All');
        searchByOption = 0;
        if (appendState) {
            $('li.divider').remove();
            $('li').filter(":contains('All')").remove();
            appendState = false;
        }
        var checkInput = searchBar.val();
        if (checkInput != '') {
            executeSearch();
        }
        searchBar.focus();
    });

    /** Dropdown Handler **/
    function changeDropdownLabel(label) {
        $('#dropdownLabel').html(
            label + '&nbsp;' +
            '<span class="caret"></span>'
        );
    }

    function appendDropdownDefault() {
        $('#dropdownLabelList').append(
            '<li class="divider"></li>' +
            '<li><a href="#" id="searchByAll">All</a></li>'
        );
    }


    /** Input Handler **/
    function executeSearch() {
        //reset variables & flush old data
        searchResults = 0;
        matchBookIndexes = [];
        $('#accordion').empty();
        sessionStorage.clear();
        // start search
        var userInput = searchBar.val();
        goSearch(userInput);
        resultPanelHandler();
        $.getScript('js/dataHandler.js');
        sessionStorage.setItem('input', userInput);
        sessionStorage.setItem('searchByOption', searchByOption);
    }

    /** Search Algorithm **/
    function goSearch(input) {
        input = input.toLowerCase();

        // do not search when input is only whitespace
        if (input.length != 0) {
            // iterate books
            $.each(books, function (index, book) {
                //console.log(index +'='+ book);
                // iterate book
                $.each(book, function (key, value) {
                    //console.log(key +'='+ value);
                    if (key === 'title' && (searchByOption == 1 || searchByOption == 0)) {
                        var bookTitle = value.toLowerCase();
                        // find matches
                        if (bookTitle.includes(input)) {
                            if ($.inArray(index, matchBookIndexes) === -1) {
                                searchResults++;
                                matchBookIndexes.push(index);
                            }
                        }
                    } else if (key === 'author' && (searchByOption == 2 || searchByOption == 0)) {
                        var bookAuthor = value.toLowerCase();
                        // find matches
                        if (bookAuthor.includes(input)) {
                            if ($.inArray(index, matchBookIndexes) === -1) {
                                searchResults++;
                                matchBookIndexes.push(index);
                            }
                        }
                    }
                });
            });
        }
    }

    /** Result Panel Handler **/
    function resultPanelHandler() {
        var checkInput = searchBar.val();
        var resultPanel = $('#resultPanel');
        if (searchResults > 0) {
            resultPanel.replaceWith(
                '<div class="panel panel-default" id="resultPanel">' +
                '<div class="panel-heading">' +
                '<h3>Search Results&nbsp;<span class="label label-info" id="resultNbr"></span></h3>' +
                '</div>' +
                '<div class="panel-body">' +
                '<!-- Accordion View -->' +
                '<div class="panel-group" id="accordion"></div>' +
                '</div>' +
                '</div>'
            );
            $('#resultNbr').html(searchResults);
            generateAccordion(searchResults, matchBookIndexes);
            resetButton.show();

        } else if (searchResults === 0 && checkInput != '') {
            resultPanel.replaceWith(
                '<div class="alert alert-warning" id="resultPanel">' +
                '<p><span class="glyphicon glyphicon-remove"></span> No books with similar title found.</p>' +
                '</div>'
            );
            resetButton.show();
        } else {
            resultPanel.replaceWith(
                '<div id="resultPanel"></div>'
            );
        }
    }

    /** Accordion **/
    function generateAccordion(numberResults, indexArray) {

        var accordion = '';

        for (var i = 0; i < numberResults; i++) {

            accordion +=
                '<!-- Tab ' + (i + 1) + ' -->' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading accordion-heading" data-toggle="collapse" data-target="#collapse_' + i + '" data-parent="#accordion">' +
                '<h4 class="panel-title">' + books[indexArray[i]].title + '</h4>' +
                '</div>' +
                '<!-- Collapsible Content -->' +
                '<div id="collapse_' + i + '" class="panel-collapse collapse">' +
                '<ul class="list-group">' +
                '<li class="list-group-item">' +
                '<p class="list-group-item-text">Author: ' + books[indexArray[i]].author + '</p>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<p class="list-group-item-text">ISBN: ' + books[indexArray[i]].ISBN + '</p>' +
                '</li>' +
                '</ul>' +
                '<div class="panel-footer"><a class="getInfo" id="item_' + indexArray[i] + '" href="detail.html">more Information...</a></div>' +
                '</div>' +
                '</div>'

        }
        $('#accordion').append(accordion);
    }

});