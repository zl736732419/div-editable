/**
 * div拖动组件
 * Created by zhenglian on 2016/10/19.
 *
 * 回调函数结构
 * callback: {
 *     drag: function(div){}
 * }
 *
 */
(function($) {
    $.elementDragDiv = {
        settings: {
            callback: null
        },
        newInstance: function(callback) {
            if((typeof callback) != 'undefined') {
                this.settings.callback = callback;
            }else {
                this.settings.callback = null;
            }

            return $.extend(true, {}, this);
        },
        enable: function(div) {
            var drag = this;
            if((typeof div) === 'undefined' ||
                (typeof div) === 'null') {
                throw new Error('错误，当前要拖动的目标元素为空!');
            }

            $(div).addClass('dragDiv');

            var startXY = null;
            var curXY = null;
            var distanceXY = null;
            var left = 0;
            var top = 0;
            $(div).on('mousedown', function(e) {
                if(e.which != 3) { //不影响右键菜单
                    drag.preventBuddle(e);
                }
                drag.changeMouseToDragStyle(div);

                startXY = drag.getXY(e);
                $(document).on('mousemove', function(e) {
                    if(e.which != 3) { //不影响右键菜单
                        drag.preventBuddle(e);
                    }

                    curXY = drag.getXY(e);
                    distanceXY = drag.getDistanceXY(startXY, curXY);

                    drag.validatePos(div, distanceXY);

                    left = div.offsetLeft + distanceXY.dx;
                    top = div.offsetTop + distanceXY.dy;

                    $(div).css({
                        left: left + 'px',
                        top: top + 'px'
                    });

                    startXY = $.extend(true, {}, curXY);
                });

                $(document).on('mouseup', function(e) {
                    if(e.which != 3) {
                        drag.preventBuddle(e);
                    }

                    drag.changeMouseToDefaultStyle(div);
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    var callback = drag.settings.callback;
                    if(callback != null) {
                        callback.drag && callback.drag(div);
                    }
                });
                return false;
            });

        },
        /**
         * 验证当前拖动的位置坐标是否合理
         * @param div
         * @param distanceXY
         */
        validatePos: function(div, distanceXY) {
            var left = div.offsetLeft;
            var top = div.offsetTop;
            var curLeft = left + distanceXY.dx;
            var curTop = top + distanceXY.dy;


            if(curLeft < 0) {
                distanceXY.dx = -left;
            }

            if(curTop < 0) {
                distanceXY.dy = -top;
            }

            var $parent = $(div).parent('div');
            var parentWidth = $parent.outerWidth(true);
            var parentHeight = $parent.height();
            var divWidth = $(div).outerWidth(true);
            var divHeight = $(div).height();
            var maxWidth = parentWidth - divWidth
            var maxHeight = parentHeight - divHeight;

            if(curLeft > maxWidth) {
                distanceXY.dx = maxWidth - left;
            }

            if(curTop > maxHeight) {
                distanceXY.dy = maxHeight - top;
            }
        },
        /**
         * 获取拖动的xy偏移量
         * @param startXY
         * @param curXY
         */
        getDistanceXY : function(startXY, curXY) {
            return {
                dx : (curXY.x - startXY.x),
                dy : (curXY.y - startXY.y)
            };
        },
        getXY : function(e) { //获取鼠标的pageX,pageY
            return {
                x : e.pageX,
                y : e.pageY
            };
        },
        /**
         * 阻止事件冒泡
         */
        preventBuddle: function(e) {
            if(e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        },
        /**
         * 元素拖动时改变鼠标样式为拖动样式
         * @param g
         */
        changeMouseToDragStyle : function(div) {
            $(div).css({
                cursor : 'move'
            });
        },
        /**
         * 元素停止拖动后改变鼠标样式为默认样式
         * @param g
         */
        changeMouseToDefaultStyle : function(div) {
            $(div).css({
                cursor : 'default'
            });
        }
    };
})(jQuery);