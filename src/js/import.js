class Accordion{
    constructor() {
        this.$target = $('.js-accordion-target');
        this.$btn = $('.js-accordion-btn');
        this.ease = Power4.easeOut;
        this.speed = .7;
    }
    init(){
        try {
            this.checkError();
        } catch (e) {
            console.error(e.message);
            return;
        }
        
        this.setEvent();
    }
    checkError(){
        if (!this.$target.length) {
            throw new Error('.js-accordion-target does not exist');
        }
        
        if (!this.$btn.length) {
            throw new Error('.js-accordion-btn does not exist');
        }
        
        if (this.$target.length !== this.$btn.length) {
            throw new Error('not match element length');
        }
        
        this.$btn.each((i, el) => {
            if ($(el).attr('data-accordion-target')) {
                if (!$($(el).attr('data-accordion-target')).length) {
                    throw new Error('target element does not exist');
                }
            } else {
                throw new Error('data-accordion-target attribute does not exist');
            }
        });
    }
    setEvent(){
        this.$target.css({
            height: '0',
            overflow: 'hidden'
        })
        
        $(window).on('resize', () => {
            this.resize();
		});
        
        this.$btn.on('click', (e) => {
            let $el = $(e.currentTarget),
                $target = $($el.attr('data-accordion-target')),
                height = $target.children().innerHeight();
            
            if ($el.hasClass('is-open')) {
				$el.removeClass('is-open');
                this.setHeight({
                    $target: $target,
                    speed: this.speed,
                    height: 0
                });
			} else {
				$el.addClass('is-open');
                this.setHeight({
                    $target: $target,
                    speed: this.speed,
                    height: height
                });
			}
            
            return false;
        });
    }
    resize(){
        this.$btn.each((i, el) => {
            if (!$(el).hasClass('is-open')) return;
            
            let $target = $($(el).attr('data-accordion-target')),
                height = $target.children().innerHeight();
            
            this.setHeight({
                $target: $target,
                speed: 0,
                height: height
            });
        });
    }
    setHeight(param){
        let $target = param.$target,
            s = param.speed,
            h = param.height;
            
        TweenMax.to($target, s, {
            ease: this.ease,
            height: h
        });
    }   
}

window.accordion = new Accordion();
accordion.init()