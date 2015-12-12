(function ($) {

    // set header image
    var $header = $('header');
    console.log($header);
    var width = $header.width();
    var height = $header.height();
    var url = 'https://source.unsplash.com/random/' + width + 'x'; // + height; // removing height speeds up image fetch
    $header.css('background-image', 'url(' + url + ')');

    // set footer image
    var $footer = $('footer');
    console.log($footer);
    var width = $footer.width();
    var height = $footer.height();
    var url = 'https://source.unsplash.com/random/' + width + 'x'; // + height; // removing height speeds up image fetch
    // $footer.css('background-image', 'url(' + url + ')');

}) (jQuery);
