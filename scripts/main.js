var isSendForm = false;
$(document).ready(function () {
    $('.modal__button').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function () {
                if ($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#name';
                }
                $('body').css('overflow: hidden');
            }
        }
    });
    $('#success-modal-init').magnificPopup({
        type: 'inline',
        preloader: false
    });
    $('#success-modal-twice').magnificPopup({
        type: 'inline',
        preloader: false
    });
    $('#btn-show-youtube').magnificPopup({
        type: 'inline',
        preloader: false,
    });
});

$(function () {

    /**
     * Валидация всей формы
     * @param {object} form jQuery объект формы
     * @param {string} error_class класс ошибки
     * @returns {Boolean}
     */
    function isFormValidate(form, error_class) {
        var result = true,
            rq = $('.required', form).length,
            check = [
                'input[type="text"]',
                'input[type="login"]',
                'input[type="password"]',
                'input[type="number"]',
                'input[type="checkbox"]',
                'input[type="tel"]',
                'input[type="email"]',
                'input[type="select"]',
                'textarea',
                'select'
            ],
            parent;
        error_class = error_class || 'has-error';
        $('.required, input, textarea, select').removeClass(error_class);
        if (rq < 1) {
            return result;
        }

        for (var i = 0; i < rq; i++) {
            parent = $('.required', form).eq(i);
            $(check.join(','), parent).each(function () {
                if (!isFieldValidate($(this))) {
                    $(this).addClass(error_class);
                    return result = false;
                }
            });
        }

        return result;
    }

    /**
     * Проверка валидации поля
     * @param {object} field jQuery объект поля формы
     * @returns {Boolean}
     */
    function isFieldValidate(field) {
        var result = true, val = '';
        if (field && field.attr('name')) {
            if (!field.val()) {
                field.val('');
                return false;
            }

            val = (field.val() + '').trim();
            if (field.hasClass('valid_email') && !isValidEmail(val)) {
                result = false;
            } else if (field.attr('type') === 'checkbox' && !field.is(':checked')) {
                result = false;
            } else if (val === null || val === '' || val === field.data('mask')) {
                field.val('');
                result = false;
            }
        }

        return result;
    }

    /**
     * Показ модального окна об успешной отправке
     */
    function showSuccessModal() {
        $('#success-modal-init').click();
    }

    function showTwiceSuccessModal() {
        $('#success-modal-twice').click();
    }


    /**
     * Чистим поля формы
     */
    function cleanForm(form) {
        $('input', form).each(function () {
            $(this).val('');
        });
    }

    $('input[name="phone"]').mask("+7 (999) 999-99-99").data('mask', '+7 (___) ___-__-__');

    $('body').on('blur', '.validate_email', function () {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        var address = $(this).val();
        if (reg.test(address) === false) {
            $(this).addClass('has-error');
        }
    });

    $('.footer__form-group').on('click', '.placeholder_area', function () {
        var _t = $(this);
        if (!_t.hasClass('focus')) {
            $('input, textarea', _t.closest('.footer__form-group')).focus();
            _t.addClass('focus');
        }
    });
    $('.footer__form-group').on('focus', 'input, textarea', function () {
        var _t = $(this);
        _t.addClass('focus');
    });
    $('.footer__form-group').on('blur', 'input, textarea', function () {
        var _t = $(this);
        if (!_t.val() || _t.val() === _t.data('mask')) {
            _t.removeClass('focus');
            $('.placeholder_area', _t.closest('.footer__form-group')).removeClass('focus');
        }
    });


    $('a#show_rules').click(function () {

        $.fancybox($('#rules'), {
            padding: 0,
            closeBtn: false,
            helpers: {
                overlay: {
                    locked: false
                }
            }
        })
    });

    $('#rules #close_window').click(function () {
        $.fancybox.close();
    })


    $('.square_button').click(function () {

        type = $(this).attr('id');
        video = 'video_' + type;


        $.fancybox($('#video_play_container.' + type), {
            padding: 0,
            closeBtn: false,
            helpers: {
                overlay: {
                    locked: false
                }
            },
            beforeShow: function () {
                jwplayer(video).play('playing');
            },
            beforeClose: function () {
                state = jwplayer(video).getState();
                switch (state) {
                    case 'complete':
                        break;
                    case 'playing':
                        jwplayer(video).play('paused');
                        break;
                    case 'buffering':
                        jwplayer(video).play('paused');
                        break;
                }
            }
        })
    })


    $('#video_play_container #close_window').click(function () {
        $.fancybox.close();
    })

    $('body').on('submit', '.ajax_form', function (e) {
        e.preventDefault();
        e.stopPropagation();
        //Собираем данные формы
        let parent = $(this);
        if (!isFormValidate(parent, 'has-error')) {
            $('input.has-error', parent).first().focus();
        } else if (isSendForm === true) {
            showTwiceSuccessModal();
        } else {
            parent.find("[type='submit']").prop('disabled', true);
            let dataFields = parent.serializeArray();
            dataFields.push({'name': 'url_from', 'value': window.location.href});
            $.ajax({
                url: parent.attr('action'),
                dataType: 'json',
                type: 'POST',
                data: dataFields,
                success: function (data) {
                    if (data.status) {
                        showSuccessModal();
                        cleanForm(parent);
                        isSendForm = true;
                        yaCounter41407124.reachGoal('send_form');
                        ga('send', 'event', 'form', 'send');
                    } else {
                        alert('Извините, во время отправки произошла ошибка. Позвоните нам 8 495 120 11 20');
                    }
                },
                error: function (data) {
                    alert('Извините, произошла ошибка. Позвоните нам 8 495 120 11 20');
                },
                complete: function (data) {
                    parent.find("[type='submit']").prop('disabled', false);
                }
            });
        }
    });


    //Ставим значение нужного поля в форму.

    $('.square_button#own').click(function () {
        type_caption = 'Собственная аптека';
        $('input#messages_type').val(type_caption);

    });


    $(".scroll_to_form").click(function () {
        destination = $("footer").offset().top - 110;
        $("body, html").animate({scrollTop: destination}, 1000);
    });


    var numb_1 = $('#numb1').data("numb");
    var numb_2 = $('#numb2').data("numb");
    var numb_3 = $('#numb3').data("numb");
    var numb_4 = $('#numb4').data("numb");
    //var numb_4 = $('#numb4').data("numb");

    $('#numb1').viewportChecker({
        offset: 150,
        callbackFunction: function (elem, action) {
            $('#numb1').animateNumber({number: numb_1}, 1200);
        }
    });
    $('#numb2').viewportChecker({
        offset: 150,
        callbackFunction: function (elem, action) {
            $('#numb2').animateNumber({number: numb_2}, 900);
        }
    });
    $('#numb3').viewportChecker({
        offset: 150,
        callbackFunction: function (elem, action) {
            var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(' ')
            $('#numb3').animateNumber({number: numb_3, numberStep: comma_separator_number_step}, 1500);
        }
    });
    $('#numb4').viewportChecker({
        offset: 150,
        callbackFunction: function (elem, action) {
            var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(' ')
            $('#numb4').animateNumber({number: numb_4, numberStep: comma_separator_number_step}, 1500);
        }
    });

    function makeInvisible($el) {
        $el.addClass('js-invisible');
    }

    var $mapObject = $('.js-svg-map');
    var $regionFill = $mapObject.find('.fil1');
    var $regionIcon = $mapObject.find('g').not('.js-svg-map > g');
    var $regionTitle = $mapObject.find('.fil2');
    makeInvisible($regionFill);
    makeInvisible($regionIcon);
    makeInvisible($regionTitle);
    $('#box-map').viewportChecker({
        offset: 150,
        callbackFunction: function (elem, action) {
            //  function setTransition(on = true, $el, speed) {
            function setTransition(on, $el, speed) {
                if (!on) {
                    $el.css({
                        transition: 'initial'
                    });
                } else {
                    $el.css({
                        transition: 'opacity ' + speed
                    });
                }
            }

            function makeVisible($el) {
                $el.removeClass('js-invisible');
            }

            function sequentialDisplay($el, time) {
                if (!time) {
                    var time = 0;
                }

                $el.each(function () {
                    var $that = $(this);
                    setTimeout(function () {
                        makeVisible($that);
                    }, time);
                    time = time + 50;
                });

                return time;
            }

            $(function () {
                var transitionSpeed = '350ms';
                var lastTime = 0;
                var endTime = 0;

                setTransition(true, $mapObject, transitionSpeed);
                setTransition(true, $regionFill, transitionSpeed);
                setTransition(true, $regionIcon, transitionSpeed);
                setTransition(true, $regionTitle, transitionSpeed);

                makeVisible($mapObject);

                lastTime = sequentialDisplay($regionFill);
                endTime = sequentialDisplay($regionIcon, lastTime);

                setTimeout(function () {
                    makeVisible($('#t-москва'));
                }, lastTime + 100);

                $regionIcon.on("mouseenter", function () {
                    var id = $(this).find('image').attr('id').replace(/l-/g, '');
                    makeVisible($('#t-' + id));
                });

                $regionIcon.on("mouseleave", function () {
                    var id = $(this).find('image').attr('id').replace(/l-/g, '');
                    if (id == 'москва') {
                        return false;
                    }
                    makeInvisible($('#t-' + id));
                });

                var timerId = setInterval(function () {
                    var count_regions = $regionIcon.length;
                    for (var i = 0; i < 30; i++) {
                        var rand_region = Math.floor(Math.random() * (count_regions - 1));
                        if (!$regionIcon.eq(rand_region).hasClass('light')) {
                            var duration = Math.floor(Math.random() * (700 - 300) + 300);

                            $regionIcon.eq(rand_region).addClass('light');
                            $regionIcon.eq(rand_region).fadeTo(duration, 0.1, function () {
                                $(this).fadeTo(200, 1, function () {
                                    $(this).removeClass('light');
                                });
                            });
                        }
                    }
                }, 1000);

            });
        }
    });

    if ($(window).width() > 768) {
        $('.box-case__left-title, .box-case__title, .box-case__left-text-1, .box-why__title, .box-why__row,' +
            '.box-info__block-1, .box-info__block-2, .box-info__block-3, .box-info__block-4, .box-step__title, .box-future__title, .box-info__wrap,' +
            ' .box-future__title-desc, .box-future__bc, .box-future__row, .footer__vertical, .footer__form, .footer__contacts, .calculator_container, .online_pharmacy__title, .online_pharmacy__title-desc, .online_pharmacy_benefits, #online_pharmacy').addClass('visible-hidden');

        $('.box-info__wrap').viewportChecker({
            offset: 0,
            classToAdd: 'animation4',
            repeat: true
        });
        $('.box-future__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.online_pharmacy__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.online_pharmacy__title-desc').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.online_pharmacy_benefits').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-future__title-desc').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-future__bc').viewportChecker({
            offset: 0,
            classToAdd: 'animation2',
            repeat: true
        });
        $('#online_pharmacy').viewportChecker({
            offset: 0,
            classToAdd: 'animation2',
            repeat: true
        });
        $('.box-future__row').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.footer__vertical').viewportChecker({
            offset: 0,
            classToAdd: 'animation2',
            repeat: true
        });
        $('.footer__form').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.footer__contacts').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-case__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation1',
            repeat: true
        });
        $('.box-case__left-title').viewportChecker({
            offset: 0,
            classToAdd: 'animation2',
            repeat: true
        });
        $('.box-case__left-text-1').viewportChecker({
            offset: 0,
            classToAdd: 'animation1',
            repeat: true
        });
        $('.box-why__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation1',
            repeat: true
        });
        $('.box-why__row').viewportChecker({
            offset: 0,
            classToAdd: 'animation2',
            repeat: true
        });
        $('.calculator_container').viewportChecker({
            offset: 0,
            classToAdd: 'animation2',
            repeat: true
        });
        $('.box-info__block-1').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-info__block-2').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-info__block-3').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-info__block-4').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-step__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true
        });
        $('.box-step__ladder-wrap').viewportChecker({
            offset: 300,
            classToAdd: 'animation-step',
            repeat: true,
            invertBottomOffset: false
        });
        $('.box-viewer__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true,
        });
        $('.reviews__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true,
        });
        $('.b-success__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true,
        });
        $('.b-winner__title').viewportChecker({
            offset: 0,
            classToAdd: 'animation3',
            repeat: true,
        });
    }
});
$(function () {
    if (document.body.clientWidth < 768) {
        $('video')[0].pause();
    }

    $(window).resize(function () {

        if (document.body.clientWidth < 768) {
            $('video')[0].pause();
        }
        if (document.body.clientWidth >= 768) {
            $('video')[0].play();
        }

    });

});
$(function () {
    $('.box-step__slider').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,

    });
});

(function ($) {
    $(window).on("load", function () {
        $(".footer__carousel").mCustomScrollbar({
            axis: "x", // horizontal scrollbar,
            mouseWheel: "false",
            theme: "dark-thin"
        });
    });
})(jQuery);

$(function () {
    $("#rules_text").mCustomScrollbar({
        theme: "dark-thin"
    });

    $('.js-smoothScroll a, .js-smoothScrollLink').smoothScroll('800');
});


(function ($) {
    $(window).on("scroll", function () {
        var wheight = $(window).height() - 300;
        $('.menu-scroll').each(function (index, data) {
            var id = $(this).attr('id');
            $('a.header__ul-link[href="#' + id + '"]').removeClass('active');

            var top = $(this).offset().top - $(window).scrollTop();
            if (top > 0 && top < wheight) {
                $('a.header__ul-link[href="#' + id + '"]').addClass('active');
            }
        });
    });
})(jQuery);

$(function () {
    //галлереи
    $(document).on('click', '.js-gallery__item', function (event) {
        event.preventDefault();
        var $link = $(this);
        var $collection = $link.find('.js-gallery__slides');
        var $images = $collection.find('img');
        $.fancybox($images, {
            // padding: 0,
            helpers: {
                overlay: {
                    locked: false
                }
            },
        });
    });


    ////карусель коментов
    //инициализация слайдеров
    $('.js-reviews__slider--full .js-reviews').slick({
        infinite: true,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: true,
        appendDots: $('.js-reviews__slider--full .js-reviews__navigation'),
    });
    $('.js-reviews__slider--mobile .js-reviews').slick({
        infinite: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        appendDots: $('.js-reviews__slider--mobile .js-reviews__navigation'),
    });

    //изменения счетчика слайдера
    function changeReviewsCounter($slider) {
        var $slick = $slider.find('.js-reviews');
        var slick = $slick.slick('getSlick');
        ;
        var $counterActive = $slider.find('.js-reviews__counter-active');
        var $counterAll = $slider.find('.js-reviews__counter-all');
        var currentSlide = slick.slickCurrentSlide();
        var slidesToShow = slick.slickGetOption('slidesToShow');
        var countSlides = slick.slideCount;

        $counterActive.html(currentSlide + slidesToShow);
        $counterAll.html(countSlides);
    }

    // задаем первоначальные значения счетчиков
    $('.js-reviews__slider').each(function (index, slider) {
        var $slider = $(slider);
        changeReviewsCounter($slider);
    });
    //событие после сменой слайда
    $('.js-reviews__slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        var $slider = $(this);
        changeReviewsCounter($slider);
    });

});
var test;

/**
 * Events
 */
$(function () {
    $('.social_event').on('click', function () {
        yaCounter41407124.reachGoal('social');
        ga('send', 'event', 'click', 'social')
    });

    $('.telephone_event').on('click', function () {
        yaCounter41407124.reachGoal('phone_8_495');
        ga('send', 'event', 'click', 'telephone');
    });
    $('.email_event').on('click', function () {
        ga('send', 'event', 'click', 'email');
        yaCounter41407124.reachGoal('click_email');
    });
    $('.mobile_click_event').on('click', function () {
        ga('send', 'event', 'click', 'mobile');
        yaCounter41407124.reachGoal('click_mobile')
    });
});

$(function () {
    $('.btn-show-3d').on('click', function () {
        let parent = $(this).parent();
        parent.find('img').remove();
        parent.append('<iframe src="/3d-tur.html?fov=80&lat=0&lon=75&id=1" frameborder="no" scrolling="no" allowfullscreen></iframe>');
        $(this).remove();
    });
});


$(function () {
    $('.box-tariffs__row').slick({
        dots: true,
        infinite: true,
        initialSlide: 0,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: '.tariff-arrow-prev',
        nextArrow: '.tariff-arrow-next',
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 768,
                settings: 'unslick'
            }
        ]
    });
});

$(function () {
    $('#btn-show-youtube').on('click', function () {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var player;
    });
});

function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '560',
        width: '317',
        videoId: '3iU_ALC3IZY',
        playerVars: {'autoplay': 0, 'rel': 0},
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    if (!$('#popup-video-preview').hasClass('mfp-hide'))
        event.target.playVideo();
}
