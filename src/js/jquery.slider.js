hslide();
function hslide() {
    var state = {
        interval: 3000,
        autoplay: false,
        timer: 0,
        startTime:0,
        stopTime:0
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
        stopAutoplay();
    },function (){
        startAutoplay(elements.slides,elements.dots,state.interval - (state.stopTime - state.startTime));
    });

    function init() {

        var $wrapper = elements.wrapper;
        var $slides = elements.slides;
        var dotsWrapperHtml = '<div class="hslide-dots"></div>';
        var dotHtml = '<div class="hslide-dot"></div>';
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
        state.timer = setTimeout(function () {
            switchSlide(id,$slides,$dots);
            startAutoplay($slides,$dots,state.interval);
        }, interval, $slides, $dots, interval);
        if(!state.autoplay){
            state.autoplay = true;
        }
    }

    function stopAutoplay() {
        clearTimeout(state.timer);
        state.stopTime = new Date().getTime();
        if(state.autoplay){
            state.autoplay = false;
        }
    }
}