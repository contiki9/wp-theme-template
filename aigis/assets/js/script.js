$(function() {
  console.log('hello00');
  /**
   * 表示しているページと同じか、共通の親ディレクトリを持つリンクにクラスを追加します。
   * パスは（`/`で始める）ルート相対パスで記述します。
   * `current`と`$targetLink`は任意のクラス名を指定してください。
   * ナビゲーションにトップページが含まれていない場合は`else`以降を削除します。
   */
  function aigisNavCurrentLink() {
    var current = 'is-current';
    var $targetLink = $('.aigis-nav');
    console.log('hello');
    if(location.pathname != '/') {
      $targetLink.find('a[href^="' + location.pathname.split("/")[1] + '"]').addClass(current);
    } else {
      $targetLink.find('a:eq(0)').addClass(current);
    }
  }
  aigisNavCurrentLink();


    $('.aigis-nav a').each(function(){
        var $href = $(this).attr('href');
        if(location.href.match($href)) {
        $(this).addClass('active');
        } else {
        $(this).removeClass('active');
        }
    });

});




