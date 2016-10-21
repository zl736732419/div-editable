####功能说明
	该项目主要是实现div编辑操作，包括拖动(drag)，改变大小(resize), 右键菜单(contextMenu),选中(select)等操作，
	这些操作分别对应不同的jquery插件实现。
	
>需要注意的是，该项目引入jquery采用的是bower包管理器，在代码中并没有带jquery插件.
>
>如果不懂bower的，那么你可以选择自己下载一个jquery插件(我这里用的是jquery2.2.4),然后替换index.html中的jquery脚本依赖,引用jquery3时，jquery.smartMenu.js的$().size()会有问题，你可以自己>在改一下这个插件的代码。
>
>如果对bower有了解，那么直接进入到app目录下，运行bower install即可按照bower.json下载相关依赖插件
