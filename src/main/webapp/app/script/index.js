/**
 * Created by zhenglian on 2016/10/20.
 */
$(function() {
	"use strict";

    // 禁用浏览器默认右键点击弹出菜单事件，右键菜单这里由jquery.smartMenu实现，需要自己定义菜单内容，见elementContextMenu.js
    $(document).off('contextmenu').on('contextmenu', function() {
        return false;
    });

    /**
     * 添加创建div按钮事件
     */
    $('.btn-tools').find('#createDiv').off('click').on('click', function() {
        var div = createOneDiv();

        editable(div);

    });

    /**
     * 让div可编辑
     * @param div
     */
    function editable(div) {
        var select = $.elementSelectDiv.newInstance();
        select.enable(div);

        var resize = $.elementResizeDiv.newInstance();
        resize.enable(div);

        var drag = $.elementDragDiv.newInstance();
        drag.enable(div);

        var contextMenu = $.elementContextMenuDiv.newInstance();
        contextMenu.enable(div);
    }

    /**
     * 创建div
     * @returns {*}
     */
    function createOneDiv() {
        var $div = $('<div></div>', {class: 'itemDiv'});
        var $parent = $('.panel');
        var parentWidth = $parent.width();
        var parentHeight = $parent.height();

        var divSize = 50;

        $div.css({
            position: 'absolute',
            left: (Math.random() * (parentWidth - divSize))+ 'px',
            top: (Math.random() * (parentHeight - divSize)) + 'px',
            width: divSize + 'px',
            height: divSize + 'px',
            outline: 'none',
            fontFamily: "SimSun, 'microsoft yahei',Tahoma, Helvetica, serif",
            fontSize: '15px',
            textAlign: 'left',
            lineHeight: '20px',
            border: '1px solid #ccc',
            color: '#000'
        });

        var num = $parent.find('div.itemDiv').length + 1;
        $div.html(num);
        $parent.append($div);

        return $div[0];
    }

});
