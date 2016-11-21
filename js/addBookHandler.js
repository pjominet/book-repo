/**
 * Created by Patrick Jominet on 17.06.16.
 */
$(document).ready(function () {

    /** Initialization **/
    var submitButton = $('#submitBook');
    var resetButton = $('#resetForm');
    var titleInput = $('#inputTitle').focus();
    var authorInput = $('#inputAuthor');
    var isbnInput = $('#inputISBN');
    var pagesInput = $('#inputPages');
    var abstractInput = $('#inputAbstract');
    var isbnRegex = /(\d{3})-(\d{1})-(\d{5})-(\d{3})-(\d{1})/;
    var titleIsSet = false;
    var authorIsSet = false;
    var isbnIsSet = false;
    var pagesIsSet = false;
    var abstractIsSet = false;

    /** Input Handler **/
    isbnInput.keyup(function () {
        isbnIsSet = validateISBN(isbnInput.val(), $('#validateISBN'));
        everythingIsSet();
        somethingIsSet();
    });

    titleInput.keyup(function () {
        titleIsSet = validateInput(titleInput.val(), $('#validateTitle'));
        everythingIsSet();
        somethingIsSet();
    });

    authorInput.keyup(function () {
        authorIsSet = validateInput(authorInput.val(), $('#validateAuthor'));
        everythingIsSet();
        somethingIsSet();
    });

    pagesInput.keyup(function () {
        pagesIsSet = validateInput(pagesInput.val(), $('#validatePages'));
        everythingIsSet();
        somethingIsSet();
    });

    abstractInput.keyup(function () {
        abstractIsSet = validateInput(abstractInput.val(), $('#validateAbstract'));
        everythingIsSet();
        somethingIsSet();
    });

    /** Validate Input Values**/
    function validateISBN(isbnNumber, inputField) {
        if (isbnRegex.test(isbnNumber) && isbnNumber != '') {
            inputField.removeClass('has-error').addClass('has-success');
            return true;
        } else if (isbnNumber != '') {
            inputField.removeClass('has-success').addClass('has-error');
            return false;
        } else {
            inputField.removeClass('has-success has-error');
            return false;
        }
    }

    function validateInput(input, inputField) {
        if (input != '') {
            inputField.addClass('has-success');
            return true;
        } else {
            inputField.removeClass('has-success');
            return false;
        }
    }

    function everythingIsSet() {
        if (titleIsSet && authorIsSet && isbnIsSet && pagesIsSet && abstractIsSet) {
            submitButton.removeAttr('disabled');
            return true;
        } else {
            submitButton.attr('disabled', true);
            return false;
        }
    }
    function somethingIsSet() {
        if(titleIsSet || authorIsSet || isbnIsSet || pagesIsSet || abstractIsSet) {
            resetButton.removeAttr('disabled');
            return true;
        }
        else return false;
    }

    /** Submit Addition **/
    submitButton.click(
        function (event) {
            event.preventDefault();

            var newBook = {
                title: titleInput.val(),
                author: authorInput.val(),
                ISBN: isbnInput.val(),
                pages: pagesInput.val(),
                abstract: abstractInput.val()
            };
            var message = $('#operationMessage');

            $.post("php/writeToJson.php", {jsonData: JSON.stringify(newBook)}, function (response) {
            //$.post("php/db_add.php", {jsonData: JSON.stringify(newBook)}, function (response) {
                //console.log(response);
                if (response == true) {
                    message.replaceWith(
                        '<div class="alert alert-success" id="operationMessage">' +
                        '<p><span class="glyphicon glyphicon-ok"></span> Addition successful.</p>' +
                        '</div>'
                    )
                } else {
                    message.replaceWith(
                        '<div class="alert alert-danger" id="operationMessage">' +
                        '<p>' +
                        '<span class="glyphicon glyphicon-remove"></span> ' +
                        response + '<br>' +
                        '</p>' +
                        '</div>'
                    )
                }
            });
        });

    /** Reset Form **/
    resetButton.click (
        function (event) {
            event.preventDefault();
            $(this).closest('form').find("input, textarea").val("");
            resetButton.attr('disabled', true);
            submitButton.attr('disabled', true);
            validateInput(titleInput.val(), $('#validateTitle'));
            validateInput(authorInput.val(), $('#validateAuthor'));
            validateISBN(isbnInput.val(), $('#validateISBN'));
            validateInput(pagesInput.val(), $('#validatePages'));
            validateInput(abstractInput.val(), $('#validateAbstract'));
            titleInput.focus();
        }
    )
});