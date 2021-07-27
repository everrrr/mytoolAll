var $ = layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    form = layui.form,
    layer = layui.layer,
    upload = layui.upload,
    element = layui.element,
    laypage = layui.laypage,
    tree = layui.tree;

$("#tag li").click(function() {
	$(this).addClass('active').siblings().removeClass('active')
	let index = $('#tag li').index($(this))

	$('.tag1').hide()
	$('.tag2').hide()
	$('.tag3').hide()

	$(`.tag${index+1}`).show()
})


function publicBinding(){
	$('#myfile').find('.tab').each(function(index){
		//console.log(index)
		let self = this
		$(self).find('.delete').on('click', function(){
			$(this).parent().remove()
		})
	})
	$('#myeverfile').find('.tab').each(function(index){
		//console.log(index)
		let self = this
		$(self).find('.delete').on('click', function(){
			$(this).parent().remove()
		})
	})
	
}



/**
 * 获得json数据
 */
getJsonData()

function getJsonData() {
	//console.log(1)
	$.ajax({
		url: './JSON/task.json',
		type: 'GET',
		success: function(res) {
			if (res.code) {
				let data_a = res.a
				let data_b = res.b
				//console.log(data_a)
				//console.log(data_b)
				let str = ""
				data_a.forEach(element => {
					//console.log(element)
					let id = Number(element.id)
					if (id % 2 == 0) {
						str = `
							<div class="tab"><input class="text-item blue-font" name="${element.id}" value="${element.name}"><span class="delete">删除</span></div>
						`
					} else {
						str = `
					 		<div class="tab"><input class="text-item" name="${element.id}" value="${element.name}"><span class="delete">删除</span></div>
					 	`
					}
					$('#myfile').append(str)
				})
				
				data_b.forEach(element => {
					//console.log(element)
					let id = Number(element.id)
					if (id % 2 == 0) {
						str = `
							<div class="tab blue-font"><input class="text-item blue-font" name="${element.id}" value="${element.name}"><span class="delete">删除</span></div>
						`
					} else {
						str = `
					 		<div class="tab"><input class="text-item" name="${element.id}" value="${element.name}"><span class="delete">删除</span></div>
					 	`
					}
					$('#myeverfile').append(str)
				})
				publicBinding()
				
			}
		}
	})
}


$('.tag1 .option-box .add').on('click', function(){
	console.log('add')
	
	let id = $('#myfile').find('.tab').last().find('.text-item').attr('name')
	console.log(id)
	let name = 'xinzeng'
	if (id % 2 == 0) {
		str = `
			<div class="tab"><input class="text-item blue-font" name="${id}" value="${name}"><span class="delete">删除</span></div>
		`
	} else {
		str = `
	 		<div class="tab"><input class="text-item" name="${id}" value="${name}"><span class="delete">删除</span></div>
	 	`
	}
	$('#myfile').append(str)
	publicBinding()
})

$('.tag2 .option-box .add').on('click', function(){
	console.log('add')
	let id = $('#myeverfile').find('.tab').last().find('.text-item').attr('name')
	console.log(id)
	let name = 'xinzeng'
	if (id % 2 == 0) {
		str = `
			<div class="tab"><input class="text-item blue-font" name="${id}" value="${name}"><span class="delete">删除</span></div>
		`
	} else {
		str = `
	 		<div class="tab"><input class="text-item" name="${id}" value="${name}"><span class="delete">删除</span></div>
	 	`
	}
	$('#myeverfile').append(str)
	publicBinding()
})

$('.tag1 .option-box .ensure').on('click', function(){
	console.log('ensure')
	let data = []
	$('#myfile').find('.tab').each(function(){
		let obj = {}
		obj.id = $(this).find('.text-item').attr('name')	
		obj.name = $(this).find('.text-item').attr('value')
		data.push(obj)
	})
	console.log(data)
	layer.alert(JSON.stringify(data))
})

$('.tag2 .option-box .ensure').on('click', function(){
	console.log('ensure')
	let data = []
	$('#myeverfile').find('.tab').each(function(){
		let obj = {}
		obj.id = $(this).find('.text-item').attr('name')	
		obj.name = $(this).find('.text-item').attr('value')
		data.push(obj)
	})
	console.log(data)
	layer.alert(JSON.stringify(data))
})


