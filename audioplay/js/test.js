var $div = $('<div>').addClass('jqCreate').text("I am created by $('<div>')");
var lastChildOfBody = $('body:last-child');
lastChildOfBody.append($div);