// 控制主菜单手风琴收缩，互斥
$("#menu_1 .menu-li>span").click(function() {
	$(this).addClass("menu-active").parent().siblings().children("span").removeClass("menu-active");
	$(this).next("dl").slideDown(); //二选一 
	/* 通过高度变化（向下增大）来动态地显示所有匹配的元素 */
	// $(this).next("dl").slideToggle(); //二选一
	$(this).parent().siblings().children("dl").slideUp();
	/* sildeUp()通过高度的变化（向上减小）来动态地隐藏所有匹配地元素 */
})

// 控制主菜单手风琴收缩，不互斥
$("#menu_2 .menu-li>span").click(function() {
	//$(this).addClass("menu-active").parent().siblings().children("span").removeClass("menu-active");
	/* 不互斥地时候，对于一级标签活跃状态的选中，暂未解决 */
	// $(this).next("dl").slideDown();//二选一
	$(this).next("dl").slideToggle(); //二选一
	// $(this).parent().siblings().children("dl").slideUp();
})

$(".menu-li dd").click(function() {
	$("dd").removeClass("active");
	$(this).addClass("active");
})
