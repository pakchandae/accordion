class Accordion{
    constructor() {
        this.targetClass = 'js-accordion-target';
        this.$target = $('.' + this.targetClass);
        this.triggerClass = 'js-accordion-trigger';
        this.$trigger = $('.' + this.triggerClass);
        this.dataTarget = 'data-accordion-target';
        this.dataInitialHeight = 'data-accordion-height';
        this.openClass = 'is-open';
        this.ease = 'swing';
        this.speed = 300;
    }
    
    /**
     * 初期化処理。下記の場合エラー
     * - トリガー要素に[data-accordion-target]属性が存在しない
     * - トリガー要素に指定した[data-accordion-target]要素が存在しない
     * - [data-accordion-target]属性を持った要素に.js-accordion-triggerが指定されていない
     */
    init(){
        try {
            if (!this.$target.length || !this.$trigger.length) return;
            
            this.$trigger.each((i, el) => {
                if ($(el).attr(this.dataTarget)) {
                    if (!$($(el).attr(this.dataTarget)).length || !$($(el).attr(this.dataTarget)).hasClass(this.targetClass)) {
                        throw new Error(this.targetClass + ' element does not exist');
                    }
                } else {
                    throw new Error(this.dataTarget + ' attribute does not exist');
                }
            });
            
            $('[' + this.dataTarget + ']').each((i, el) => {
                if ($($(el).attr(this.dataTarget)).length && !$(el).hasClass(this.triggerClass)) {
                    throw new Error(this.triggerClass + ' attribute does not exist');
                }
            });
            
        } catch (e) {
            console.error(e.message);
            return;
        }
        
        this.setTarget();
        this.setEvent();
    }
    
    /**
     * ターゲット要素の初期スタイル指定
     */
    setTarget(){
        this.$target.each((i, el) => {
            let $el = $(el),
                initialHeight = $el.attr(this.dataInitialHeight);
                
            $el.css({
                height: initialHeight ? Number(initialHeight) : 0,
                overflow: 'hidden',
            })
        });
    }
    
    /**
     * イベント定義
     */
    setEvent(){
        $(window).on('resize', () => {
            this.resize();
		});
        
        this.$trigger.on('click', (e) => {
            this.click(e);
            return false;
        });
    }
    
    /**
     * クリックイベント
     * @param  {object} event クリックイベントオブジェクト
     */
    click(event){
        let $target = $($(event.currentTarget).attr(this.dataTarget)),
            initialHeight = $target.attr(this.dataInitialHeight),
            height = this.getHeight($target.contents()),
            h = 0;
        
        if ($target.hasClass(this.openClass)) {
            h = initialHeight ? Number(initialHeight) : 0;
            $target.removeClass(this.openClass);
        } else {
            h = height;
            $target.addClass(this.openClass);
        }
        
        this.setHeight({
            $target: $target,
            speed: this.speed,
            height: h,
        });
    }
    
    /**
     * リサイズイベント
     */
    resize(){
        this.$target.each((i, el) => {
            let $el = $(el),
                h = this.getHeight($el.contents());
                
            if (!$el.hasClass(this.openClass)) return;
            
            this.setHeight({
                $target: $el,
                speed: 0,
                height: h,
            });
        });
    }
    
    /**
     * ターゲット要素の高さ指定
     * @param {object} param 対象要素・スピード・高さ
     */
    setHeight(param){
        let $target = param.$target,
            s = param.speed,
            h = param.height;
            
        $target.stop().animate({ height: h }, s, this.ease);
    }   
    
    /**
     * 対象要素の高さを取得
     * @param {object} $el 対象要素
     * @return {number} 対象要素の高さ
     */
    getHeight($el){
        let h = 0;
        
        $el.each((i, el) => {
            if ($(el).get(0).nodeType === Node.TEXT_NODE) {            
                $(el).wrap('<span>');
                h += $(el).parent().outerHeight(true);
                $(el).unwrap('<span>');
            } else {
                h += $(el).outerHeight(true);
            }
        });
        
        return h;
    }   
}

let accordion = new Accordion();
accordion.init()