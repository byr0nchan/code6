Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {'plugin': '/js/extjs/plugin'}
});

// 自适应宽度
Ext.EventManager.onWindowResize(function () {
    Ext.ComponentManager.each(function (id, cmp) {
        if (cmp.hasOwnProperty('renderTo') && cmp.updateLayout) {
            cmp.updateLayout();
        }
    });
});

// 常用工具
var tool = tool || {};

/**
 * 消息提示
 * @param text 消息内容
 * 可选 type 消息类型（info success warning error）（默认：warning）
 * 可选 delay 显示时长（默认：5000 ms）
 */
tool.toast = function (text) {
    tool.toastInstance = tool.toastInstance || new Ext.create('plugin.toast');
    var type = arguments[1] ? arguments[1] : 'warning';
    tool.toastInstance.delay = arguments[2] ? arguments[2] : 5000;
    tool.toastInstance[type](text);
};

//读取Cookie
tool.getCookie = function (name) {
    var defaultValue = arguments[1]; //默认值
    tool.cookies = tool.cookies || Ext.util.Cookies;
    var val = tool.cookies.get(name);
    if (typeof (defaultValue) !== 'undefined' && defaultValue != null) {
        val = val ? val : defaultValue;
        tool.cookies.set(name, val, null, location.pathname);
    }
    return val;
};

/**
 * Ajax请求
 * @param method
 * @param url
 * @param params
 * @param callback
 */
tool.ajax = function (method, url, params, callback) {
    Ext.Ajax.request({
        method: method,
        url: url,
        params: params,
        headers: {
            'X-XSRF-TOKEN': tool.getCookie('XSRF-TOKEN')
        },
        success: function (rsp) {
            try {
                rsp = Ext.JSON.decode(rsp.responseText);
            } catch (e) {
                rsp = rsp.responseText;
            }
            callback(rsp);
        },
        failure: function (rsp) {
            tool.toast('请求失败（状态码：' + rsp.status + '）');
        }
    });
};
