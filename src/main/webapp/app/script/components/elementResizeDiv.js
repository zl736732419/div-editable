/**
 * div resize组件
 * Created by zhenglian on 2016/10/19.
 * 回调函数结构
 * callback: {
 *      leftUp: function() {
 *      },
 *      up: function() {
 *      },
 *      rightUp: function() {
 *      },
 *      left: function() {
 *      },
 *      right: function() {
 *      },
 *      leftDown: function() {
 *      },
 *      down: function() {
 *      },
 *      rightDown: function() {
 *      }
 * }
 */
(function($) {
    $.elementResizeDiv = {
        settings: {
            pointCls: '.point',
            width: 8,
            height: 8,
            callback: null //外部回调接口
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
            if((typeof div) === 'undefined' ||
                (typeof div) === 'null') {
                throw new Error('错误，当前要resize的目标元素为空!');
            }

            $(div).addClass('resizeDiv');
            this.resize(div);
        },
        resize: function(div) {
            this.drawEightPoints(div);
            this.initEvent(div);
        },

        /**
         * 初始化事件
         */
        initEvent: function(div) {
            this.initPointDragEvent(div);
        },
        initPointDragEvent: function(div) {
            var resize = this;
            var point = null;
            var startXY = null; //拖动之前的开始位置坐标
            var curXY = null; //当前位置坐标
            var distanceXY = null; //开始位置到当前位置的距离
            var callback = this.settings.callback;
            $(div).find(this.settings.pointCls).on('mousedown', function(e) {
                e.preventDefault();
                resize.preventBuddle(e);
                point = $(this);
                var pointCls = $(point).attr('class').split(' ')[1];
                startXY = resize.getXY(e);

                var x = div.offsetLeft;
                var y = div.offsetTop;
                var width = $(div).outerWidth(true);
                var height = $(div).outerHeight(true);
                var fn = null;
                $(document).on('mousemove', function(e) {
                    e.preventDefault();
                    resize.preventBuddle(e);
                    curXY = resize.getXY(e);
                    distanceXY = resize.getDistanceXY(startXY, curXY);
                    switch(pointCls) {
                        case 'leftUp': //左上角
                            distanceXY.dx = distanceXY.dy;
                            x += distanceXY.dx;
                            y += distanceXY.dy;
                            width -= distanceXY.dx;
                            height -= distanceXY.dy;

                            if(callback != null) {
                                fn = callback.leftUp;
                            }

                            break;
                        case 'up': //上中点
                            distanceXY.dx = 0;
                            y += distanceXY.dy;
                            height -= distanceXY.dy;

                            if(callback != null) {
                                fn = callback.up;
                            }
                            break;
                        case 'rightUp': //右上角
                            distanceXY.dy = -distanceXY.dx;
                            y += distanceXY.dy;
                            width += distanceXY.dx;
                            height -= distanceXY.dy;

                            if(callback != null) {
                                fn = callback.rightUp;
                            }

                            break;
                        case 'left': //左中点
                            distanceXY.dy = 0;
                            x += distanceXY.dx;
                            width -= distanceXY.dx;

                            if(callback != null) {
                                fn = callback.left;
                            }

                            break;
                        case 'right': //右中点
                            distanceXY.dy = 0;
                            width += distanceXY.dx;

                            if(callback != null) {
                                fn = callback.right;
                            }

                            break;
                        case 'leftDown': //左下角
                            distanceXY.dx = -distanceXY.dy;
                            x += distanceXY.dx;
                            width -= distanceXY.dx;
                            height += distanceXY.dy;

                            if(callback != null) {
                                fn = callback.leftDown;
                            }

                            break;
                        case 'down': //下中点
                            height += distanceXY.dy;

                            if(callback != null) {
                                fn = callback.down;
                            }

                            break;
                        case 'rightDown': //右下角
                            distanceXY.dx = distanceXY.dy;
                            width += distanceXY.dx;
                            height += distanceXY.dy;

                            if(callback != null) {
                                fn = callback.rightDown;
                            }

                            break;
                    }

                    var position = {
                        x: x,
                        y: y,
                        width: width,
                        height: height
                    };

                    resize.updateDivPosition(div, position);
                    resize.updatePointsPosition(div);
                    startXY = $.extend(true, {}, curXY);

                    //执行回调函数
                    fn && fn(div);

                });

                $(document).on('mouseup', function(e) {
                    e.preventDefault();
                    resize.preventBuddle(e);
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                })
            });
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
         * 更改div所在的位置
         * @param div
         * @param position
         */
        updateDivPosition: function(div, position) {
            $(div).css({
                left: position.x,
                top: position.y,
                width: position.width,
                height: position.height
            });
        },
        /**
         * 获取鼠标当前位置信息
         * @param e
         * @returns
         */
        getXY: function(e) {
            return {
                x: e.pageX,
                y: e.pageY
            };
        },
        /**
         * 根据开始位置和当前位置获取坐标差值
         * @param startXY
         * @param curXY
         */
        getDistanceXY: function(startXY, curXY) {
            return {
                dx: curXY.x - startXY.x,
                dy: curXY.y - startXY.y
            };
        },
        /**
         * 绘制八个助拖点
         * @param div
         */
            drawEightPoints: function(div) {
            var pointCls = this.settings.pointCls;
            var $pointers = $(div).find(pointCls);
            if($pointers.length > 0) {
                $pointers.remove();
            }

            var width = $(div).outerWidth(true);
            var height = $(div).height();

            var pointWidth = this.settings.width;
            var pointHeight = this.settings.height;

            //左上角
            var $leftUp = $('<div></div>', {'class': pointCls.substring(1) + ' leftUp'});
            $(div).append($leftUp);
            $leftUp.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            //上中点
            var $up = $('<div></div>', {'class': pointCls.substring(1) + ' up'});
            $(div).append($up);
            $up.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            //右上角
            var $rightUp = $('<div></div>', {'class': pointCls.substring(1) + ' rightUp'});
            $(div).append($rightUp);
            $rightUp.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            //左中点
            var $left = $('<div></div>', {'class': pointCls.substring(1) + ' left'});
            $(div).append($left);
            $left.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            //右中点
            var $right = $('<div></div>', {'class': pointCls.substring(1) + ' right'});
            $(div).append($right);
            $right.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });


            //左下角
            var $leftDown = $('<div></div>', {'class': pointCls.substring(1) + ' leftDown'});
            $(div).append($leftDown);
            $leftDown.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            //下中点
            var $down = $('<div></div>', {'class': pointCls.substring(1) + ' down'});
            $(div).append($down);
            $down.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            //右下角
            var $rightDown = $('<div></div>', {'class': pointCls.substring(1) + ' rightDown'});
            $(div).append($rightDown);
            $rightDown.css({
                width: pointWidth + 'px',
                height: pointHeight + 'px'
            });

            this.updatePointsPosition(div);

            //默认是不显示的
            $(div).find(pointCls).css({
                display: 'none'
            });
        },
        /**
         * 更改八个点的位置
         */
        updatePointsPosition: function(div) {
            var width = $(div).outerWidth(true);
            var height = $(div).height();

            var pointWidth = this.settings.width;
            var pointHeight = this.settings.height;

            //左上角
            $(div).find('.leftUp').css({
                left: -(pointWidth / 2) + 'px',
                top: -(pointHeight / 2) + 'px'
            });

            //上中点
            $(div).find('.up').css({
                left: (width - pointWidth) / 2 + 'px',
                top: -(pointHeight / 2) + 'px'
            });

            //右上角
            $(div).find('.rightUp').css({
                left: (width - pointWidth/2) + 'px',
                top: -(pointHeight / 2) + 'px'
            });

            //左中点
            $(div).find('.left').css({
                left: -(pointWidth/2) + 'px',
                top: (height - pointHeight) / 2 + 'px'
            });

            //右中点
            $(div).find('.right').css({
                left: (width - pointWidth/2) + 'px',
                top: (height - pointHeight) / 2 + 'px'
            });

            //左下角
            $(div).find('.leftDown').css({
                left: -(pointWidth/2) + 'px',
                top: (height - pointHeight/2) + 'px'
            });

            //下中点
            $(div).find('.down').css({
                left: (width - pointWidth)/2 + 'px',
                top: (height - pointHeight/2) + 'px'
            });

            //右下角
            $(div).find('.rightDown').css({
                left: (width - pointWidth/2) + 'px',
                top: (height - pointHeight/2) + 'px'
            });
        },
    };
})(jQuery);