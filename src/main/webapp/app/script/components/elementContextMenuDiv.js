/**
 * 右键菜单组件
 * 实现该组件需要引用到jquery.smartMenu插件
 * 需要引入smartMenu.css样式
 * jquery-smartMenu.js脚本
 *
 * Created by zhenglian on 2016/10/19.
 */
(function($) {
	"use strict";
    $.elementContextMenuDiv = {
        settings: {
            items: null //右键菜单项
        },
        newInstance: function(items) {
            if(items) {
                this.settings.items = items;
            }
            return $.extend(true, {}, this);
        },
        enable: function(div) {
            this.initEvent(div);
        },
        initEvent: function(div) {
            var menu = this;
            $(div).on('mousedown', function(e) {
                if(e.which == 3) {
                    menu.buildElementMenu(div);
                }

                return false;
            });
        },
        buildElementMenu: function(div) {
            var menu = this;
            var data = this.settings.items;
            if(data == null) { //如果为空就简单实现一个删除项
                data = [
                    [{
                        text: '删除',
                        func: function() {
                            menu.removeMenu(div);
                        }
                    }]
                ];
            }

            menu.hide();
            $(div).smartMenu(data, {
                name: 'menu' + new Date().getTime(),
                textLimit: 10
            });
        },
        /**
         * 隐藏右键菜单
         */
        hide: function() {
            $.smartMenu.remove();
        },
        /**
         * 删除div
         */
        removeMenu: function(div) {
            $(div).remove();
        }
    };
})(jQuery);

