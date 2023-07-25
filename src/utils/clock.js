/**
 * Created by xiaoyao on 2023/07/06.
 * source from xiaoyao
 */


//时钟背景
function drawBackground(context,r,rem,whiteOrBlack) {
	
	// context.fillStyle = "red"
	// context.fillRect(10,10,120,120);
	
	
	context.beginPath();//按照下边参数开始绘制新路径
	context.arc(60,60,55,0,Math.PI*2,true);//（圆心X坐标，圆心Y坐标，半径，开始角度（弧度），结束角度弧度，是否按照顺时针画）
	context.closePath();//关闭路径
	context.fillStyle = whiteOrBlack==='#fff'?'#000':'#fff';//设置填充颜色
	context.fill();//开始填充
	
    context.save();
    context.translate(r, r);
    context.beginPath();
    context.lineWidth = 8*rem;
    context.strokeStyle = whiteOrBlack
    context.arc(0, 0, r - 5*rem, 0, 2 * Math.PI, false);
    context.stroke();
    context.closePath();
	
//遍历小时数
    var houseNumble = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
    houseNumble.forEach(function (number, i) {
        context.textAlign = 'center';
        context.textBaseline = 'middle'
		context.fillStyle = whiteOrBlack
        context.font = 18*rem+'px Arial'
        var rad = 2 * Math.PI / 12 * i;
        var x = Math.cos(rad) * (r - 30*rem);
        var y = Math.sin(rad) * (r - 30*rem);
        context.fillText(number, x, y);
    })
//定义刻度
    for (var i = 0; i < 60; i++) {
        var rad = 2 * Math.PI / 60 * i;
        var x = Math.cos(rad) * (r - 18*rem);
        var y = Math.sin(rad) * (r - 18*rem);
        context.beginPath();
        if (i % 5 == 0) {
            context.fillStyle = whiteOrBlack
            context.arc(x, y, 2*rem, 0, 2 * Math.PI);
        } else {
            context.fillStyle = whiteOrBlack
            context.arc(x, y, 2*rem, 0, 2 * Math.PI);
        }

        context.fill();
        context.closePath();
    }
	
}
//定义时针
function drawHour(context,r,rem,hour,minute,whiteOrBlack) {
    context.save();
    context.beginPath();
    context.lineWidth = 6*rem;
    context.lineCap = 'round'
    context.fillStyle = whiteOrBlack
    var rad = 2 * Math.PI / 12 * hour;
    var mrad = 2* Math.PI/12/60 * minute;
    context.rotate(rad+mrad);
    context.moveTo(0, 10*rem);
    context.lineTo(0, -r / 2);
    context.stroke();
    context.restore();
}
//定义分针
function drawMinute(context,r,rem,minute,whiteOrBlack) {
    context.save();
    context.beginPath();
    context.lineWidth = 3*rem;
    context.lineCap = 'round';
    context.fillStyle = whiteOrBlack
    var rad = 2 * Math.PI / 60 * minute;
    context.rotate(rad);
    context.moveTo(0, 15*rem);
    context.lineTo(0, -r + 24)
    context.stroke();
    context.restore();
}
//定义秒钟
function drawSecond(context,r,rem,second) {
    context.save();
    context.beginPath();
    context.lineWidth = 2*rem;
    context.lineCap = 'round';
    context.fillStyle = "red"
    var rad = 2 * Math.PI / 60 * second;
    context.rotate(rad);
    context.moveTo(-2 ,20);
    context.lineTo( 2, 20);
    context.lineTo( 1, -r + 18);
    context.lineTo( -1, -r + 18);
    context.fill();
    context.restore();
}
//画中心点
function drawDot(context,r,rem,fillStyle) {
    context.beginPath();
    context.fillStyle = fillStyle
    context.arc(0, 0, 4*rem, 0, 2 * Math.PI, false);
    context.fill();
}
//时间函数，让时钟根据当前时间跳动
const drawClock = function(context) {
	var height = context.canvas.height;
	var width = context.canvas.width;
	var r = width / 2;
	var rem = width/200;
    context.clearRect(0,0,width,height);
    var time= new Date();
    var hour =time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
	var whiteOrBlack = hour>6 && hour<18 ? "#000" : "#fff"
    drawBackground(context,r,rem,whiteOrBlack);
    drawHour(context,r,rem,hour,minute,whiteOrBlack);
    drawMinute(context,r,rem,minute,whiteOrBlack);
    drawSecond(context,r,rem,second,whiteOrBlack);
	
    drawDot(context,r,rem,whiteOrBlack);
    context.restore()
}

// Draw();
// setInterval(Draw,1000);
export default drawClock
