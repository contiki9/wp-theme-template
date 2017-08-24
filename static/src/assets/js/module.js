////////////////////////////////////////////////////////////////
////画面いっぱいの高さに指定する
////////////////////////////////////////////////////////////////
function js_window_maxHeight() {
    $(window).on('load scroll resize', function () {
        var h = window.innerHeight ? window.innerHeight : $(window).height();
        $('.js-window-maxHeight').css('height', h);
    });
}


////////////////////////////////////////////////////////////////
////今いる場所の同じURLのリンクを削除
////////////////////////////////////////////////////////////////
function js_currentUrl() {
    $(function () {
        var activeUrl = location.pathname.split("/")[2];
        navList = $(".js-currentUrl").find("a");
        navList.each(function () {
            if ($(this).attr("href").split("/")[2] == activeUrl) {
                $(this).addClass("active");
            }
        });
    });
}

////////////////////////////////////////////////////////////////
////端末後のフラグ設定
////////////////////////////////////////////////////////////////

var deviceFlug_ua = (function () {
//ユーザーエージェントをフラグにする場合
//////////////////////////////////////
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        return 'sp';
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        return 'tab';
    } else {
        return 'pc';
    }
})();

var deviceFlug_win = (function () {
//windowサイズをフラグにする場合
//////////////////////////////////////
    var wid = $(window).width();
    if (wid <= 480) {
        return 'sp';
    } else if (wid <= 768) {
        return 'tab';
    } else {
        return 'pc';
    }
})();



$(document).ready(function () {
//クリックしたオブジェクト自身を削除
    $('.js-click-remove').click(function () {
        $(this).remove();
    });

//クリックしたオブジェクト自身を削除して指定のコンテンツを表示
    $('.js-click-switch-remove').click(function () {
        link = $(this).attr('href');
        $(link).fadeIn();
        $(this).remove();
        return false;
    });

//簡易トグルスライド
    $('.js-click-tgl-slide').click(function () {
        link = $(this).attr('href');
        $(link).slideToggle();
        return false;
    });

////////////////////////////////////////////////////////////////
//フォームの要素をクリックしたらページ上部までスクロール
////////////////////////////////////////////////////////////////
    $('.js-u-form-scroll input,.js-u-form-scroll select,.js-u-form-scroll textarea').on("focus",function(){
        var position = $(this).parent().parent().offset().top;
        $("html,body").animate({
            scrollTop : position
        }, {
            queue : false
        });
    });
});


$(document).ready(function () {
////////////////////////////////////////////////////////////////
////スマホ用とPC用で画像を切り変える&RETINA対応
////////////////////////////////////////////////////////////////
    if (deviceFlug_win == 'sp') {
        //_pcの画像を_spに変える処理
        $('.js-device-img-change').each(function () {
            $(this).attr("src", $(this).attr("src").replace('_pc', '_sp'));
        });
        //スマホ時に画像を半分にして表示する（retina対応）
        $('.js-device-img-retina').each(function () {
            var imageObj = new Image();
            // 画像のプリロード処理
            imageObj.src = $(this).attr('src');
            $(this).on('load', function () {
                width = imageObj.width;
                $(this).attr("width", width / 2);
            });
        });
    }

////////////////////////////////////////////////////////////////
//スマホ時に画像をaltのテキストに差し替える
////////////////////////////////////////////////////////////////
    if (deviceFlug_win == 'sp') {
        $(".js-device-text-change").each(function (i) {
            var txt = $("img", this).attr("alt");
            $(this).attr("data-label", txt);
        });
    }
////////////////////////////////////////////////////////////////
//PC時に電話番号のリンクを外す。
////////////////////////////////////////////////////////////////
    if (deviceFlug_win == 'pc') {
        $('.js-tel-href').each(function () {
            $(this).contents().unwrap();
        });
    }
});




