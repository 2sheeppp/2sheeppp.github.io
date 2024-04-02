var response = prompt("请输入您的昵称：");
alert("你好，" + response + "！快来接受我的挑战吧~");

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d")
canvasStyle = window.getComputedStyle(canvas, null)
canvas.width = canvas.height = 480
var cards = [] //卡片数组
var pair = [] //配对数组
var save = [] //翻开卡片的索引
var startTime;//获取开始时间
var endTime;//获取结束时间
var clickCount = 0;//记录鼠标点击次数

function newgame(){
  startTime = Date.now()
  var rnd = [] //空数组用于填充卡面
    for (var i = 0; i < 36; i++) {
        rnd.push(i % 18)
    }
    var idx = 0 //索引
    cards = [] //清空卡片数组
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            idx = parseInt(Math.random() * rnd.length) //获取随机索引值
            cards.push({
                value: rnd[idx], //写入卡片值
                turn: false, //标记卡片为未翻开
                x: i, //写入卡片横坐标
                y: j //写入卡片纵坐标
            })
            rnd.splice(idx, 1) //删掉已经写入卡面的索引对应的数字
        }
    }

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height) //清空画布
    ctx.font = "40px sans-serif" //设定文字属性
    for (var i = 0; i < cards.length; i++) { //遍历卡片数组
        card = cards[i]
        ctx.fillStyle = "white" //默认填充白色
        if (!card.turn) { //如卡片为翻开状态，则填充为黑色
            ctx.fillStyle = "black"
        }
        ctx.fillRect(80 * card.x + 1, 80 * card.y + 1, 78, 78) //绘制卡片
        ctx.fillStyle = "black" //填充文字为黑色
        ctx.fillText(card.value, 80 * card.x + 21, 80 * card.y + 61) //将文字值写入卡片位置
    }
}



canvas.addEventListener("click", function (evt) { //获取点击事件
    var cRect = canvas.getBoundingClientRect()
    var canvasX = evt.clientX - cRect.left
    var canvasY = evt.clientY - cRect.top
    var x = Math.floor(canvasX / 120)
    var y = Math.floor(canvasY / 120)
    var origin = x *6 + y //根据点击位置计算卡片索引
    clickCount++
    if (!cards[origin].turn){ //如果卡片状态为未翻开状态
        cards[origin].turn = !cards[origin].turn //切换索引卡片翻转状态
        pair.push(cards[origin].value) //将翻开的卡片值写入pair数组
        save.push(origin) //将翻开的卡片索引写入save 数组
    if (pair.length >= 2) { //当翻开两张时
        if (pair[0] != pair[1]){ //判断两张卡片值是否相等
            setTimeout(function(){ //如不相等，延迟0.5秒后将翻开的卡片翻转回未翻开状态
                for (var i=0;i<save.length;i++){
                    cards[save[i]].turn = !cards[save[i]].turn
                }
                save=[] //清空save及pair
                pair=[]
            },500)
        }
        else{ //如两张卡片值相等，则保持翻转状态，仅清空save及pair数组
            save=[]
            pair=[]
        }
    }
    }
    // 判断游戏是否结束
    var gameComplete = true
    for (var i = 0; i < cards.length; i++) {
      if (!cards[i].turn) {
        gameComplete = false
        break
      }
    }
    if (gameComplete) {
      endGame()
      alert("恭喜你，"+ response +"!挑战成功！")
    }

    // 在游戏结束时调用该函数，计算游戏所用时间并显示提示信息
function endGame() {
    endTime = Date.now(); // 获取游戏结束时间
    var timeDiff = endTime - startTime; // 计算游戏所用时间差
    var seconds = Math.floor(timeDiff / 1000); // 转换成秒
    var minutes = Math.floor(seconds / 60); // 分钟
    var remainingSeconds = seconds % 60; // 剩余秒数
}

// 点击显示所用时长按钮时，显示游戏所用时长
document.getElementById("show-time-btn").addEventListener("click", function() {
    if (gameComplete) {
        var timeDiff = endTime - startTime; // 计算游戏所用时间差
        var seconds = Math.floor(timeDiff / 1000); // 转换成秒
        var minutes = Math.floor(seconds / 60); // 分钟
        var remainingSeconds = seconds % 60; // 剩余秒数
        alert("游戏所用时长为：" + minutes + "分钟" + remainingSeconds + "秒");
    } else {
        alert("游戏尚未结束，无法显示所用时长！");
    }
  });

// 点击次数按钮显示点击次数
document.getElementById("show-count-btn").addEventListener("click", function() {
  if (gameComplete) {
    alert("您总共点击了" + clickCount + "次")
  } else {
    alert("游戏尚未结束，无法显示点击次数！")
  }

  });

});

newgame()
setInterval(draw, 1)
