jQuery(function ($) {
    if ($(window).width() > 1200) {
        $('#map .city').mouseenter(function () {
            var t = $(this);
            if (!t.hasClass('moscow')) {
                mouseenter(event, t);
            }
        });
        $('#map .city-modal').mouseleave(function () {
            $('#map .city-modal').addClass('hidden');
        });
    }
});

function mouseenter(event, t) {
    var x = t.offset().left + 5,
            y = t.offset().top + 5;
    $('#map .city-modal').text(t.attr('city')).removeClass('hidden').offset({left: x, top: y});
}