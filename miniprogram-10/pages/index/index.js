Page({
  data:{
    remainLandmine:'',
    arr:[],
    arr1:[],
    showArr: [], // 二维数组，存储每个方块的显示状态
    switchValue:false, //标记雷区开关
    ROWS:10,
    COLS:10,
    count:10
  },
  onLoad(){
this.initGame()
  },
  //雷区生成
  initGame(){
    const ROWS = this.data.ROWS; // 行数
    const COLS = this.data.COLS; // 列数
    let arr = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0)); // 先将二维数组全部初始化为0
    let showarr=new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0));
    let count = this.data.count; // 需要生成的雷的个数
    this.setData({
      remainLandmine:count,
      showArr:showarr,
      switchValue:false
      
    })
    while (count > 0) {
      let row = Math.floor(Math.random() * ROWS); // 随机生成行坐标
      let col = Math.floor(Math.random() * COLS); // 随机生成列坐标
      if (arr[row][col] === 0) { // 如果该位置为0，则将其设置为100
        arr[row][col] = 100;
        count--;
      }
    }
// 在生成雷区之后，遍历所有的非雷位置，计算周围雷的数量，并将这个数字赋值给该位置
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLS; j++) {
    if (arr[i][j] !== 100) { // 如果该位置不是雷
      let count = 0; // 周围雷的数量
      for (let m = Math.max(i - 1, 0); m <= Math.min(i + 1, ROWS - 1); m++) {
        for (let n = Math.max(j - 1, 0); n <= Math.min(j + 1, COLS - 1); n++) {
          if (arr[m][n] === 100) {
            count++;
          }
        }
      }
      arr[i][j] = count; // 将周围雷的数量赋值给该位置
    }
  }
}

    this.setData({
      arr: arr,
      arr1:arr
    });
   console.log(this.data.arr); // 输出二维数组
    
  },
  //点击方块
  bindshow: function(event) {
    const ROWS = this.data.ROWS; // 行数
    const COLS = this.data.COLS; // 列数
    var i = event.currentTarget.dataset.i;
    var j = event.currentTarget.dataset.j;
    var showArr = this.data.showArr;
    var arr=this.data.arr;
    var arr1=this.data.arr1;//初始数组
    var sv=this.data.switchValue;
    var remainLandmine=this.data.remainLandmine
    //如果点击到的方块为雷，提示游戏结束，然后重新开始
    if(arr[i][j]==100&&!sv&& showArr[i][j] !== 1){
      wx.showModal({
        title: '游戏结束',
        content: '很遗憾，你踩到了雷',
        showCancel: true, // 显示取消按钮和确定按钮
        confirmText: '继续游戏', // 将确定按钮的文本值改为“继续游戏”
  cancelText: '重新开始', // 将取消按钮的文本值改为“重新开始”
        success(res) {
          if (res.confirm) {
            // 点击确定按钮后重新开始游戏
            
          } else if (res.cancel) {
            // 点击取消按钮后继续游戏
            // 执行继续游戏的逻辑
            wx.redirectTo({
              url: '/pages/index/index' // 跳转到当前页面
            })
          }
        }
      });
    }
// 如果点击到的方块已经标记过了，则将其取消标记
if (showArr[i][j] === 1) {
  arr[i][j] = arr1[i][j];
  showArr[i][j] = 0;
  remainLandmine++;
  this.setData({
    arr: arr,
    showArr: showArr,
    remainLandmine: remainLandmine
  });
  return;
} else if (showArr[i][j] === -1) {
  return; // 如果该方块已经被打开，则不能再被标记
}
    //如果扫雷值为真
    if (sv) {
      // 如果该方块未被标记，则将该方块标记为已标记
      if (showArr[i][j] !== 1) {
        
        remainLandmine--;
        showArr[i][j] = 1;
      }
    } else {
      showArr[i][j] = -1;
      // 如果点击的方块为零，打开周围的方块
      if (arr[i][j] === 0) {
        this.openAround(i, j);
      }
    }
    this.setData({
      showArr: showArr,
      arr: arr,
      remainLandmine: remainLandmine
    });
    // 如果所有非雷方块都被打开游戏胜利
let count = 0; // 计算所有没被打开的非雷方块数量
for (let i = 0; i < ROWS; i++) {
for (let j = 0; j < COLS; j++) {
if (arr[i][j] !== 100 && showArr[i][j] !== -1) {
count++;
// console.log(count)
}
}
}
if (count ===  0&&remainLandmine==0) { //
wx.showModal({
title: '游戏胜利',
content: '恭喜你，你成功排除了所有的雷！',
showCancel: false,
success(res) {
// 点击确定按钮后重新开始游戏
if (res.confirm) {
// wx.redirectTo({
// url: '/pages/index/index' // 跳转到当前页面
// })
}
}
});
}

  console.log(count)
},
  switchChange: function (e) {
    this.setData({
      switchValue: e.detail.value
    })
  },
// 如果是零，打开周围方块
openAround: function(i, j) {
  let arr = this.data.arr;
  let showArr = this.data.showArr;
let ROWS=this.data.ROWS
let COLS=this.data.COLS
  // 遍历周围的八个方块，将它们的值设为-1
  for (let m = Math.max(i - 1, 0); m <= Math.min(i + 1, ROWS - 1); m++) {
    for (let n = Math.max(j - 1, 0); n <= Math.min(j + 1, COLS - 1); n++) {
      if (arr[m][n] !== 100 && showArr[m][n] !== -1) { // 如果该方块不是雷且未被打开过
        showArr[m][n] = -1; // 打开该方块
        this.setData({
          showArr: showArr
        });
        if (arr[m][n] === 0) { // 如果该方块也是零，递归打开周围的方块
          this.openAround(m, n);
        }
      }
    }
  }
},
//重新开始
reStart: function() {
  wx.redirectTo({
    url: '/pages/index/index' // 跳转到当前页面
  })
},
onRowChange: function(event) {
  this.setData({
    ROWS: event.detail.value
  });
  this.initGame();
},

onColChange: function(event) {
  this.setData({
    COLS: event.detail.value
  });
  this.initGame();
},
onLandmineChange(e) {
  this.setData({
    count: e.detail.value,
  });
  this.initGame();
},
})