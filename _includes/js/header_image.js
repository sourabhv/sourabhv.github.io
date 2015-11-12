(function ($) {

    var $header = $('header');
    console.log($header);
    var width = $header.width();
    var height = $header.height();
    var url = 'https://source.unsplash.com/random/' + width + 'x' + height;
    $header.css('background-image', 'url(' + url + ')');

    var $footer = $('footer');
    console.log($footer);
    var width = $footer.width();
    var height = $footer.height();
    var url = 'https://source.unsplash.com/random/' + width + 'x' + height;
    $footer.css('background-image', 'url(' + url + ')');


}) (jQuery);
