$("#tag li").click(function (){
	$(this).addClass('active').siblings().removeClass('active')
	let index = $('#tag li').index($(this))
	
	$('.tag1').hide()
	$('.tag2').hide()
	$('.tag3').hide()
	
	$(`.tag${index+1}`).show()
})
