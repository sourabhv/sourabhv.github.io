(function ($) {

    var $header = $('header');
    console.log($header);
    var width = $header.width();
    var height = $header.height();
    var url = 'https://unsplash.it/' + width + '/' + height + '/?random';
    $header.css('background-image', "url('" + url + "')");

    var $footer = $('footer');
    console.log($footer);
    var width = $footer.width();
    var height = $footer.height();
    var url = 'https://unsplash.it/' + width + '/' + height + '/?random';
    $footer.css('background-image', "url('" + url + "')");


}) (jQuery);
