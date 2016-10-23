/**
 * div 选择组件
 * Created by zhenglian on 2016/10/19.
 * 回调函数结构
 * callback: {
 *      select: function() {
 *
 *      },
 *      unselect: function() {
 *
 *      }
 * }
 *
 */
(function($) {
	"use strict";
    $.elementSelectDiv = {
        settings: {
            selectedCls : '.selected', //选中元素后要添加的样式类
            callback: null //元素的选择回调事件，执行针对某一个元素的特殊处理
        },
        /**
         * 创建选中组件实例
         * @param callback
         */
        newInstance: function(callback) {
            if((typeof callback) != 'undefined') {
                this.settings.callback = callback;
            }else {
                this.settings.callback = null;
            }

            return $.extend(true, {}, this);
        },
        /**
         * 启用选中组件
         * @param $div
         */
        enable: function(div) {
            if((typeof div) === 'undefined' ||
                (typeof div) === 'null') {
                throw new Error('错误，当前要选中的目标元素为空!');
            }
            ///为目标div添加一个class,为了控制样式
            $(div).addClass('selectDiv');
            var select = this;
            $(div).on('click', function(e) {
                var selected = select.isSelected(div);
                if(select.isCtrlKeyDown(e)) { //判断是否按下ctrl进行多选或取消操作
                    if(selected) {
                        select.unSelectElement(div);
                    }else {
                        select.selectElement(div, false);
                    }
                }else {
                    if(!selected) {
                        select.selectElement(div, true);
                    }
                }
            });
        },
        clearAllSelectStatus: function() {
            var selectCls = this.settings.selectedCls;
            var cls = selectCls.substring(1);
            $('.selectDiv').find(selectCls).removeClass(cls);

            $(selectCls).find($.elementResizeDiv.settings.pointCls).css({
                display: 'none'
            });

        },
        /**
         * 取消选中
         */
        unSelectElement: function(div) {
            var selectedCls = this.settings.selectedCls;
            var cls = selectedCls.substring(1);
            $(div).removeClass(cls);

            var resizePointCls = $.elementResizeDiv.settings.pointCls;
            $(div).find(resizePointCls).css({
                display: 'none'
            });

            var callback = this.settings.callback;
            if(callback != null) {
                callback.unselect && callback.unselect(div);
            }
        },
        /**
         * 选中指定div
         * @param div
         * @param clear 是否清空其他选中状态
         */
        selectElement: function(div, clear) {
            var select = this;
            var selectedCls = this.settings.selectedCls;
            var cls = selectedCls.substring(1);
            if(clear) {
                var divs = $('div' + selectedCls).removeClass(cls);
                $(divs).each(function(i, item) {
                    select.unSelectElement(item);
                });
            }

            $(div).addClass(cls);
            var resizeCls = $.elementResizeDiv.settings.pointCls;
            $(div).find(resizeCls).css({
                display: 'block'
            });

            var callback = this.settings.callback;
            if(callback != null) {
                callback.select && callback.select(div);
            }
        },
        /**
         * 判断当前选择动作是否存在ctrl按键
         */
        isCtrlKeyDown: function(e) {
            if(e == null || e == undefined) { //如果没有鼠标事件默认为单选
                return false;
            }

            return e.ctrlKey;
        },
        /**
         * 判断当前div是否被选中
         * @param div
         */
        isSelected: function(div) {
            var selectedCls = this.settings.selectedCls;
            return $(div).hasClass(selectedCls.substring(1));
        }
    }
})(jQuery)