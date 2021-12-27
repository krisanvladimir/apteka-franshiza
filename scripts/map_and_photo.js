$(document).ready(function () {
    var marker = $(".map-wrapper__marker");

    marker.hover(function () {
        $(this).find(".map-wrapper__marker-desc").stop().fadeIn(200);
    }, function () {
        $(this).find(".map-wrapper__marker-desc").stop().fadeOut(100);
    });

    ////////////////
    ////////////////
    //TABS&GALLERIES
    var pbTabs = $(".photo-box__tab-item"),
        pbGalleries = $(".pbGallery");

    function getGallery(galleryIndex) {
        if (galleryIndex === undefined) {
            galleryIndex = 0;
        }
        pbTabs.removeClass("photo-box__tab-item_active").eq(galleryIndex).addClass("photo-box__tab-item_active");
        pbGalleries.hide().eq(galleryIndex).show();
        initGallery(pbGalleries.eq(galleryIndex));
    }

    function initGallery(gallery) {
        gallery.find(".pbGallery__photo img").hide().eq(0).show();
        gallery.find(".pbGallery__thumb").removeClass("pbGallery__thumb_active").eq(0).addClass("pbGallery__thumb_active");
    }

    function changeGalleryImage(gallery ,newImage) {
        var photoBox = gallery.find(".pbGallery__photo"),
            height = photoBox.height(),
            width = photoBox.width();

        photoBox.height(height).width(width);
        photoBox.find("img").css("position", "absolute");
        photoBox.find("img:visible").fadeOut(300);
        photoBox.find("img").eq(newImage).fadeIn(300, function () {
            photoBox.find("img").css("position", "relative");
            photoBox.height("auto").width("auto");
        });
    }

    getGallery();
    pbTabs.click(function () {
        var newIndex = pbTabs.index($(this));
        getGallery(newIndex);
    });
    $(".pbGallery__thumb").click(function () {
        var gallery = $(this).parents(".pbGallery"),
            newImage = gallery.find(".pbGallery__thumb").index($(this));
        if (!gallery.find(".pbGallery__photo img").is(":animated") && !$(this).hasClass("pbGallery__thumb_active")) {
            changeGalleryImage(gallery, newImage);
            gallery.find(".pbGallery__thumb").removeClass("pbGallery__thumb_active");
            $(this).addClass("pbGallery__thumb_active");
        }
    });

    ////////
    ////////
    //SLIDER
    var pbSlider = $(".pbSlider"),
        pbSliderImagesBox = pbSlider.find(".pbSlider__photo"),
        pbSliderImages = pbSlider.find(".pbSlider__photo img"),
        pbSliderTexts = pbSlider.find(".pbSlider__text-item"),
        pbNext = pbSlider.find(".pbNext"),
        pbPrev = pbSlider.find(".pbPrev"),
        pbSliderCurrent = pbSlider.find(".pbSlider__current"),
        pbSliderCount = pbSlider.find(".pbSlider__count");

    pbSliderImages.eq(0).show();
    pbSliderTexts.eq(0).show();
    pbSliderCurrent.text("1");
    pbSliderCount.text(pbSliderImages.length);

    function changeSliderImage(dirrection) {
        var nextSlide = 0,
            currentSlide = pbSliderTexts.index(pbSliderTexts.filter(":visible")),
            height = pbSliderImagesBox.height(),
            width = pbSliderImagesBox.width();
        if (dirrection === "next") {
            nextSlide = (currentSlide < pbSliderImages.length - 1) ? currentSlide+1 : 0;
        } else if (dirrection === "prev") {
            nextSlide = (currentSlide > 0) ? currentSlide-1 : pbSliderImages.length - 1;
        }

        pbSliderTexts.hide().eq(nextSlide).show();
        pbSliderCurrent.text(nextSlide+1);
        pbSliderImagesBox.height(height).width(width);
        pbSliderImages.css("position", "absolute");
        if (dirrection === "next") {
            pbSliderImages
                .eq(currentSlide)
                .animate({"left": "-100%"}, 300, function () {
                    pbSliderImages.eq(currentSlide).hide();
                });
            pbSliderImages
                .eq(nextSlide)
                .show()
                .css("left", "100%")
                .animate({"left": "0"}, 300, function () {
                    pbSliderImages.css({"position": "relative", "left": "initial"});
                    pbSliderImagesBox.height("auto").width("auto");
                });
        } else if (dirrection === "prev") {
            pbSliderImages
                .eq(currentSlide)
                .animate({"left": "100%"}, 300, function () {
                    pbSliderImages.eq(currentSlide).hide();
                });
            pbSliderImages
                .eq(nextSlide)
                .show()
                .css("left", "-100%")
                .animate({"left": "0"}, 300, function () {
                    pbSliderImages.css({"position": "relative", "left": "initial"});
                    pbSliderImagesBox.height("auto").width("auto");
                });
        }
    }

    pbNext.click(function () {
        if (!pbSliderImages.is(":animated")) {
            changeSliderImage("next");
        }
    });
    pbPrev.click(function () {
        if (!pbSliderImages.is(":animated")) {
            changeSliderImage("prev");
        }
    });
    pbSliderImages.swipe({
        swipeStatus:function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection)
        {
            var height = pbSliderImagesBox.height(),
                width = pbSliderImagesBox.width(),
                newPos = 0,
                slideDirrection = 0;

            if (phase === "start") {
                pbSliderImagesBox.height(height).width(width);
                pbSliderImages.css("position", "absolute");
            }
            if (phase === "move") {
                newPos = (direction === "left") ? -distance : distance;
                $(this).css("left", newPos/3);
            }
            if (phase === "cancel") {
                $(this).animate({"left": "0"}, 300, function () {
                    pbSliderImages.css({"position": "relative", "left": "initial"});
                    pbSliderImagesBox.height("auto").width("auto");
                });
            }
            if (phase === "end") {
                slideDirrection = (direction === "left") ? "next" : "prev";
                changeSliderImage(slideDirrection);
            }
        }
    });

    ///////////////
    ///////////////
    //MOBILE SLIDER
    var mSlider = $(".mSlider"),
        mSliderImagesBox = mSlider.find(".mSlider__photo"),
        mSliderImages = mSlider.find(".mSlider__photo img"),
        mSliderTexts = mSlider.find(".mSlider__text-item"),
        mNext = mSlider.find(".mNext"),
        mPrev = mSlider.find(".mPrev"),
        mSliderCurrent = mSlider.find(".mSlider__current"),
        mSliderCount = mSlider.find(".mSlider__count");

    mSliderImages.eq(0).show();
    mSliderTexts.eq(0).show();
    mSliderCurrent.text("1");
    mSliderCount.text(mSliderImages.length);

    function mChangeSliderImage(dirrection) {
        var nextSlide = 0,
            currentSlide = mSliderTexts.index(mSliderTexts.filter(":visible")),
            height = mSliderImagesBox.height(),
            width = mSliderImagesBox.width();
        if (dirrection === "next") {
            nextSlide = (currentSlide < mSliderImages.length - 1) ? currentSlide+1 : 0;
        } else if (dirrection === "prev") {
            nextSlide = (currentSlide > 0) ? currentSlide-1 : mSliderImages.length - 1;
        }

        mSliderTexts.hide().eq(nextSlide).show();
        mSliderCurrent.text(nextSlide+1);
        mSliderImagesBox.height(height).width(width);
        mSliderImages.css("position", "absolute");
        if (dirrection === "next") {
            mSliderImages
                .eq(currentSlide)
                .animate({"left": "-100%"}, 300, function () {
                    mSliderImages.eq(currentSlide).hide();
                });
            mSliderImages
                .eq(nextSlide)
                .show()
                .css("left", "100%")
                .animate({"left": "0"}, 300, function () {
                    mSliderImages.css({"position": "relative", "left": "initial"});
                    mSliderImagesBox.height("auto").width("auto");
                });
        } else if (dirrection === "prev") {
            mSliderImages
                .eq(currentSlide)
                .animate({"left": "100%"}, 300, function () {
                    mSliderImages.eq(currentSlide).hide();
                });
            mSliderImages
                .eq(nextSlide)
                .show()
                .css("left", "-100%")
                .animate({"left": "0"}, 300, function () {
                    mSliderImages.css({"position": "relative", "left": "initial"});
                    mSliderImagesBox.height("auto").width("auto");
                });
        }
    }

    mNext.click(function () {
        if (!mSliderImages.is(":animated")) {
            mChangeSliderImage("next");
        }
    });
    mPrev.click(function () {
        if (!mSliderImages.is(":animated")) {
            mChangeSliderImage("prev");
        }
    });
    mSliderImages.swipe({
        swipeStatus:function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection)
        {
            var height = mSliderImagesBox.height(),
                width = mSliderImagesBox.width(),
                newPos = 0,
                slideDirrection = 0;

            if (phase === "start") {
                mSliderImagesBox.height(height).width(width);
                mSliderImages.css("position", "absolute");
            }
            if (phase === "move") {
                newPos = (direction === "left") ? -distance : distance;
                $(this).css("left", newPos/3);
            }
            if (phase === "cancel") {
                $(this).animate({"left": "0"}, 300, function () {
                    mSliderImages.css({"position": "relative", "left": "initial"});
                    mSliderImagesBox.height("auto").width("auto");
                });
            }
            if (phase === "end") {
                slideDirrection = (direction === "left") ? "next" : "prev";
                mChangeSliderImage(slideDirrection);
            }
        }
    });
});