# 每道题目演示动画的SOP

## 1. 技术栈
### 1.1 开发
- 每道题目的演示代码单独一个仓库，方便AI编程时约束上下文
  - 目前（2025-04-06）阶段的AI还是更适合进行demo级别的开发，因此控制仓库的代码量及工程复杂度是demo级别就可以了
- 技术栈基本都是：React + TypeScript + D3.js
  - TypeScript比较适合AI编程时理解类型，尽可能减少编程阶段产生的理解问题
  - D3.js做2D动画比较合适，如果是3D动画的话可以考虑three.js
### 1.2 部署
- 每道题目的演示最终使用github pages服务来部署
- 每个仓库的npm的package.json中应该有个命令，能够从本地直接部署github pages的分支
- 每个仓库应该有个github action，在每次合并代码到主分支的时候，自动部署github pages
## 2. 页面风格统一
- 尽可能使用单独的一个屏幕盛放所有的内容，不出现垂直滚动条或者水平滚动条
- 所有的演示动画的数据源：
  - 让用户能够自行输入
  - 或者生成随机的数据样例
## 3. 社交链接 
- 仓库页面
  - 在仓库的介绍里，要把website设置为github pages的url，github官方提供了支持，直接勾选即可
- 每个仓库的README里
  - 要有引导到github pages的url里，能够单击跳转到演示页面
  - 要有动画演示效果的gif动画
    - 可以先录视频，然后把视频转换为gif https://ezgif.com/video-to-gif
  - 要有链接能够单击跳转到leetcode原题目页面
- 每个题目的演示页面上，要能够
  - 跳转到对应的题目的Leetcode的页面
  - 跳转到题目的演示网站的源代码仓库
  - 跳转到统一hot 100动画的列表页
- 在hot 100的列表站里有引导到每道题目的独立的演示页面

## 4. 动画演示分镜

- 每个动画演示效果，要有详细的分镜效果，并且对于每个动画效果的播放：
  - 要能够自动播放
  - 要能够手动控制”上一步“、”下一步“等

- 如果涉及到栈（比如递归、单调栈），要把栈的内容也绘制出来
- 如果涉及到数组，要把数组的每个内容都绘制出来
- 如果涉及到数组元素交换，要有明确的交换效果
- 如果涉及道指针，要有明确的箭头把指针所指向的内容标识出来





