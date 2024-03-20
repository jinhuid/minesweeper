# 一个使用vue写的扫雷小游戏

## 小巧 轻快 点击即玩
- 扫雷 ：[在线地址](https://bebtme.github.io/Minesweeper/)

## 获得源码
> 点击index.html 直接一键复制

## 自定义关卡
> 找到源码的genGameModeConfig对象
``` js
{
    get easy() {
        return new MineMap(8, 8, 10)
    },
    get middle() {
        return new MineMap(16, 16, 40)
    },
    get hard() {
        return new MineMap(16, 30, 99)
    },
    get extreme(){
        return new MineMap(24, 45, 230)
    }
    //照葫芦画瓢 MineMap第一个参数为多少行 第二个多少列 第三个为多少个炸弹(必须<行*列)
    /**
     * eg:
     *      get 难度名(){
     *      return new MineMap(行, 列, 炸弹数量)
     *      }
     */
}
```

## ojbk结束
