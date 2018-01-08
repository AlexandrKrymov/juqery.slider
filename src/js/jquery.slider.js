hslide();
function hslide() {
    var state = {
        interval: 3000,
        autoplay: false,
        timer: 0,
        startTimer:0,
        stopTimer:0,
        pausedTime:0,
        hoverCount:0,
        animateTimer:0,
        startTime:0,
        stopTime:0,
        hover:false,
        focus: true
    };

    var elements = {
        wrapper: $('.slider-wrapper'),
        slides: $('.slider-item'),
        dots: '',
    };

    init();

    startAutoplay(elements.slides,elements.dots,state.interval);

    // Events

    elements.dots.on('click',function () {
        var id = $(this).data('data-id');
        switchSlide(id,elements.slides,elements.dots);
    });

    elements.wrapper.hover(function (){
        // console.log('hover');
        state.hover = true;
        if(state.focus){
            state.hoverCount += 1;
            stopAutoplay();
        }
    },function (){
        // console.log('unHover');
        state.hover = false;
        if(state.focus){
            console.log(state.hoverCount);
            if(state.hoverCount > 1){
                state.pausedTime = new Date().getTime() - state.stopTimer;
                startAutoplay(elements.slides,elements.dots,state.interval - (state.stopTime - state.startTime - state.pausedTime));
            } else {
                startAutoplay(elements.slides,elements.dots,state.interval - (state.stopTime - state.startTime));
            }
        }
    });

    // elements.wrapper.on('switch-slide', function () {
    //     console.log('Переключение слайда');
    //
    // });

    elements.wrapper.on('stop-autoplay', function () {
        animationPause();
    });

    elements.wrapper.on('start-autoplay', function () {
        animetionPlay();
    });

    window.onblur = function () {
        console.log('blur');
        state.focus = false;
        stopAutoplay();
    };
    window.onfocus = function () {
        console.log('focus');
        state.focus = true;
        if(!state.hover){
            startAutoplay(elements.slides,elements.dots,state.interval - (state.stopTime - state.startTime));
        }
    };

    function init() {

        var $wrapper = elements.wrapper;
        var $slides = elements.slides;
        var dotsWrapperHtml = '<div class="hslide-dots"></div>';
        var dotHtml = '<div class="hslide-dot"><div class="hslide-dot-inner"></div></div>';
        for(var i = 0; i < $slides.length; i++){
            $slides.eq(i).data('data-id', i);
        }
        $wrapper.append(dotsWrapperHtml);
        var $dotsWrapper = $wrapper.find('.hslide-dots');
        for(var i = 0; i < $slides.length; i++){
            $dotsWrapper.append(dotHtml);
        }
        var $dots = $dotsWrapper.find('.hslide-dot');
        elements.dots = $dots;
        for(var i = 0; i < $dots.length; i++){
            $dots.eq(i).data('data-id', i);
        }
        switchSlide(0,$slides,$dots);

    }

    function switchSlide(id,$slides,$dots) {
        $slides.each(function () {
            disactivate($(this));
        });
        $slides.each(function () {
            var $elem = $(this);
            if($elem.data('data-id') === id){
                activate($elem);
            }
        });
        $dots.each(function () {
            disactivate($(this));
        });
        activate($dots.eq(+id));
        state.startTime = new Date().getTime();
        state.hoverCount = 0;
        elements.wrapper.trigger('switch-slide');
    }

    function nextSlide($slides) {
        var activeSlideId = $slides.filter('.is-active').data('data-id');
        if(+activeSlideId === (+$slides.length - 1)){
            return 0;
        }
        return (+activeSlideId + 1);
    }

    function activate($elem) {
        $elem.addClass('is-active');
    }

    function disactivate($elem) {
        $elem.removeClass('is-active');
    }

    function startAutoplay($slides,$dots,interval) {
        console.log(interval);
        var id = nextSlide($slides);
        state.startTimer = new Date().getTime();
        state.timer = setTimeout(function () {
            switchSlide(id,$slides,$dots);
            startAutoplay($slides,$dots,state.interval);
        }, interval, $slides, $dots, interval);
        if(!state.autoplay){
            state.autoplay = true;
        }
        elements.wrapper.trigger('start-autoplay');
    }

    function stopAutoplay() {
        clearTimeout(state.timer);
        state.stopTimer = new Date().getTime();
        state.stopTime = new Date().getTime();
        if(state.autoplay){
            state.autoplay = false;
        }
        elements.wrapper.trigger('stop-autoplay');
    }
    
    function animetionPlay() {
        if(elements.dots.hasClass('animation-pause')){
            // console.log('play');
            elements.dots.removeClass('animation-pause');
        }
    }
    
    function animationPause() {
        var $elem = elements.dots.filter('.is-active');
        if(!$elem.hasClass('animation-pause')){
            // console.log('pause');
            $elem.addClass('animation-pause');
        }
    }

    function dotAnimate($elem,interval) {
        var $innerElem = $elem.find('.hslide-dot-inner');
        var newInterval = getInterval($elem,interval);
        state.animateTimer = setInterval(function () {
            animateDot($innerElem)
        }, newInterval);
    }

    function getInterval($elem,interval) {
        var width = $elem.outerWidth();
        var newInterval = Math.floor(interval / width);
        return newInterval;
    }

    function animateDot($elem) {
        var newWidth = (+$elem.outerWidth() + 1) + 'px';
        $elem.css('width',newWidth)
    }

    function dotAnimateStop() {
        elements.dots.find('.hslide-dot-inner').css('width','');
    }
}