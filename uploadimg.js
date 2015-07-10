// web app 调用拍照、相册上传图片
// form target="iframename" 提交表单在ifram中打开，并在iframe中获取返回值
(function($) {
    $.fn.upload = function(options) {
        var defaults = {
            dom: this,  // context 上下文
            action: "", // form action url
            params: {}, // 传参
            onChooseFile: false, // 选择图片执行函数
            onSubmit: false 
        };
        defaults = $.extend(defaults, options); // 扩展defaults 默认设置
        
        // 设置input file 放置到iframe中
        var w = $(defaults.dom).width(),
            h = $(defaults.dom).height(),
            $file = $('<input type="file"/>');
        $file.attr({accept: "image/jpeg,image/png",name: "file"});
        
        if (defaults.onSubmit) {
            // form，iframe初始化
            var up_iframe = "upload_iframe_" + parseInt(Math.random() * 100), 
                $form = $("<form></form>"), 
                $iframe = $("<iframe style='display:none;'></iframe>");
            $iframe.attr({name: up_iframe,id: up_iframe});
            $form.attr({action: defaults.action,enctype: "multipart/form-data",method: "post",target: h});
            // 将参数传递到iframe中
            for (var i in defaults.params) {
                var input_hide = $("<input type='hidden'/>").attr({name: i,value: defaults.params[i]});
                $form.append(input_hide);
                input_hide = null;
            }
            // 添加到页面中
            $file.appendTo($form);
            $form.append($iframe);

            // iframe loading form 中有数据提交并iframe中收到返回值
            $iframe.on("load", function() {
                var l = $(this.contentDocument.body).text();
                if (l.indexOf("{") > 0) {
                    defaults.onSubmit($.parseJSON(l));
                } else {
                    if (l.length > 4) {
                        defaults.onSubmit(l);
                    } else {
                        if (l == "") {
                            return
                        } else {
                            defaults.onSubmit(l);
                        }
                    }
                }
            });

            // form 添加到 context上下文中
            $file.css({position: "absolute",width: "100%",height: "100%",left: 0,top: 0,right: 0,bottom: 0,opacity: 0});
            $form.css({position: "absolute",width: "100%",height: "100%",left: 0,top: 0,right: 0,bottom: 0});
            $(defaults.dom).css({position: "relative",overflow: "hidden"});
            $(defaults.dom).append($form);
        } else {
            $file.css({position: "absolute",width: "100%",height: "100%",left: 0,top: 0,right: 0,bottom: 0,opacity: 0});
            $(defaults.dom).css({position: "relative",overflow: "hidden"}).append($file)
        }

        // 上传图片 并 提交表单
        $file.on("change", function() {
            var l = false;
            if (this.files[0] && this.value.toLocaleString().match("^.*.[jpg|png]$")) {
                if (defaults.onChooseFile) {
                    var $img = new Image();
                    window.URL = window.URL || window.webkitURL;
                    if (window.URL) {
                        $img.src = window.URL.createObjectURL(this.files[0]);
                        $img.onload = function(n) {
                            window.URL.revokeObjectURL(this.src); // 释放
                        }
                    } else {
                        if (this.files[0].getAsDataURL) {
                            $img.src = this.files[0].getAsDataURL();
                        }
                    }
                    defaults.onChooseFile($img, this); // 调用 onChooseFile 函数并传入图片 
                }
                if (defaults.onSubmit) {
                    $form.submit(); // 提交表单
                }
            }
        })
    }
})(Zepto);
