/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC",
            adapt_type     :1,
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                // 是否跳过隐藏图片，默认不跳过
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                /*？？*/ 
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {/* Nothing. */} 
                else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {

                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;

                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }
        function adapt(img_el){
            var tableWidth = img_el.parent().width(),tableHeight = img_el.parent().height();
            var img = new Image();
            img.src = img_el.attr("data-" + settings.data_attribute);
            var imgWidth = img.width,imgHeight = img.height;
            var flag_show = true;
            
            // 先判断图片的宽大于高还是小于高
            if(imgWidth<imgHeight){
                // 竖着图片
                // 比较图片的高度与包裹图片的盒子高度
                flag_show = compare_img_box(imgHeight,tableHeight);

                // 判断展示的高度与框的高度
                var showImg_height = imgHeight/imgWidth*tableWidth,upTop;
                if(showImg_height>tableHeight){
                    upTop = (showImg_height-tableHeight)/2;
                }else{
                    upTop = 0; 
                }
                if(flag_show){
                    if(settings.adapt_type == 1){
                        // 以长边为基准适配图片 使图片完全展示
                        // showImg.attr("style","max-height:100%");
                        img_el.attr("style","width:auto;max-height:100%;");
                    }else if(settings.adapt_type == 2){
                        // 以短边为基准适配图片 使图片展示中心部分
                        img_el.attr("style","max-width:100%;position:relative;top:-"+upTop+"px");
                    }
                }else{
                    // 图片可以完全放在框中
                    img_el.attr("style","max-width:100%;");
                }
               
            }else if(imgWidth == imgHeight){
                // 正方形图片
                flag_show = compare_img_box(imgHeight,tableHeight);
                if(flag_show){
                    img_el.attr("style","max-width:100%");
                }else{
                    img_el.attr("style","max-width:100%");
                }
            }else if(imgWidth >imgHeight){
                // 横放图片
                // 比较图片的高度与包裹图片的盒子高度
                flag_show = compare_img_box(imgWidth,tableWidth);
                
                // 判断展示的宽度与框的宽度
                var showImg_width = imgWidth/imgHeight*tableHeight,upLeft = -(showImg_width-tableWidth)/2;
                if(showImg_width > tableWidth){
                    upLeft = (showImg_width-tableWidth)/2;
                }else{
                    upLeft = 0;
                }
                if(flag_show){
                    if(settings.adapt_type == 1){
                        // 以长边为基准适配图片 使图片完全展示
                        img_el.attr("style","width:100%;height:auto; line-height:inherit");
                    }else if(settings.adapt_type == 2){
                        // 以短边为基准适配图片 使图片展示中心部分
                        img_el.attr("style","height:100%;position:relative;left:-"+upLeft+"px");
                    }
                }else{
                        img_el.attr("style","max-width:100%;");
                }
                    

            }
        }
        function compare_img_box(img_longside,box_longside){
                return img_longside>box_longside?true:false;
            }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }
                // 重新整理options.failure_limit与options.effect_speed
            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        /* 每次滚动执行一次滚动事件，不是每张图片执行一次滚动事件*/ 
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, function() {
                return update();
            });
        }

        /* 处理所有图片的功能 */ 
        this.each(function() {
            var self = this;
            var $self = $(self);

            // 初始化都设置为false
            self.loaded = false; 
            /* $self代表图片的jquery对象*/ 
            /* If no src attribute given use data:uri. */
            /**
             * img元素的src属性是否存在，不存在则设置为settings的placeholder
             */ 
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            /*当加载原始图片时appear触发*/ 
            $self.one("appear", function() {
                if (!this.loaded) {  //默认是false
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }

                    $("<img />")
                        .one("load", function() {
                            var original = $self.attr("data-" + settings.data_attribute);

                            $self.hide();
                            // img图片还是背景图片
                            if ($self.is("img")) {
                                $self.attr("src", original);
                                adapt($self);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }

                            // $self[settings.effect](settings.effect_speed);

                            $self['show']();   // === $self.show()

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            /**
                             * $.grep使用过滤函数过滤数组元素。
                             * 此函数至少传递两个参数：待过滤数组和过滤函数。过滤函数必须返回 true 以保留元素或 false 以删除元素。
                             */ 
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            /* 如果设置了settings.event为别的事件 例如："click"*/ 
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.on("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.    在jquery命名空间方便的方法       */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
