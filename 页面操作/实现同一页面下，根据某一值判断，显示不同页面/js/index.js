//两种window.onload的方式
/* $(function(){
				
}) 
					
$(document).ready(function(){
		

				
})
*/

var temp;



function switchVehicle(data){
	if (data == "btn1") {
	        $(".tab1").removeClass("hide").addClass("show");
	        $(".tab2").removeClass("show").addClass("hide");
	    } else if (data == "btn2") {
	        $(".tab2").removeClass("hide").addClass("show");
	        $(".tab1").removeClass("show").addClass("hide");
	    }
}

$('button').eq(0).click(function(){
	temp = "btn1"
	switchVehicle(temp)
})

$('button').eq(1).on('click', function(){
	temp = 'btn2'
	switchVehicle(temp)
})



