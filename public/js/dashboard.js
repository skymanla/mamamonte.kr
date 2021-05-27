var menuBtn = $('.menu-btn'), // 대시보드 메뉴 버튼
    travelMenu = $('.travel-menu'); // 여행자보험 세부 메뉴

menuBtn.on('click', function() {
    var _This = $(this);

    menuBtn.removeClass('active');
    _This.addClass('active');
    if(_This.attr('class').indexOf('travel') > 1){
        travelMenu.show();
    }else{
        travelMenu.hide();
    }
});