# SegGroup的块级标签（Seg-level Label）标注工具

[[English]](README.md)

<p float="left">
    <img src="image/annotator.png" width="800"/>
</p>

本代码库包含了文章**SegGroup: Seg-Level Supervision for 3D Instance and Semantic Segmentation**的标注工具。

[[arXiv]](https://arxiv.org/abs/2012.10217) [[知乎专栏]](https://zhuanlan.zhihu.com/p/536482202) [[代码]](https://github.com/antao97/SegGroup)

我们设计了一个基于WebGL的网页端标注工具，使用[React](http://reactjs.org)和[three.js](https://threejs.org/)开发。

**视频：** [[油管]](https://www.youtube.com/watch?v=HPVbzQTURus) [[B站]](https://www.bilibili.com/video/BV1Av411h7BA/)


如果您发现我们的工作对您的研究有帮助，您可以考虑引用我们的论文。
```
@article{tao2022seggroup,
  title={{SegGroup}: Seg-Level Supervision for {3D} Instance and Semantic Segmentation},
  author={Tao, An and Duan, Yueqi and Wei, Yi and Lu, Jiwen and Zhou, Jie},
  journal={IEEE Transactions on Image Processing},
  year={2022},
  publisher={IEEE}
```

在[这里](https://github.com/antao97/SegGroup/tree/main/seggroup/dataset/scannet/manual_label.zip)我们提供了手工标注的结果。

**更新：** 

- [2022/07/01] 这份工作被IEEE Transactions on Image Processing接收了！

&nbsp;

## 使用说明

### 安装Node.js

从https://nodejs.org/en/download/为您的平台下载预构建的安装程序。

### 下载本代码库

```
git clone https://github.com/AnTao97/SegGroup.annotator.git
```

进入`annotator/`文件夹以从头开始标注，或进入`annotator_with_gt/`文件夹基于真实标签来标注。在以下步骤中，我们以 `annotator/` 为例。

```
cd annotator/
```

### 下载ScanNet数据集

我们的注释工具使用来自ScanNet数据集的.PLY格式三维网格数据，请按照数据集的[说明](https://github.com/ScanNet/ScanNet#scannet-data)进行下载。

### 准备软链接

为下载的ScanNet数据集添加软链接（使用绝对路径）。

```
ln -s DATASET_ABSOLUTE_PATH public/data/scannet
```

在此代码库之外的任何位置创建一个文件夹以保存标注结果，然后为这个文件夹添加软链接（使用绝对路径）。

```
ln -s LABEL_ABSOLUTE_PATH public/data/label
```

### 启动程序

启动文件编写器：

```
node fileWriter.js
```

启动 Web 界面：

```
npm install
npm start
```

打开[http://localhost:3000](http://localhost:3000)在浏览器中查看。

## 操作说明

界面包括左侧的场景显示窗口和右侧的控制面板，标注工具窗口内可以旋转和平移场景，通过鼠标可以浏览和注释块级标签（Seg-level Labels）。

### 从头开始标注

在此标注模式下，初始时场景以原始扫描颜色显示。

标注者需要在标注每个实例的位置（Instance Location）之前选择一个语义类别（Semantic Class），如果下一个要标注的实例与刚才标注的一个标注的实例共享相同的语义类别，则注释者只需在控制面板中单击`Add`即可继续使用刚才选择的语义类。

为了在标注过程中显示过分割（Over-segmentation）结果，鼠标光标所在的过分割块区域会自动显示为红色。

当一个实例位置被标注时，该实例位置对应的过分割块的颜色会从红色变为新的颜色，以表明该过分割块被注释，标注后过分割块的不同颜色表示它们属于不同的实例。

### 基于真实标签的标注

因为ScanNet数据集中的场景具有点级真实标签（Point-level Ground-truth Label），所以在我们的论文中，我们实际上选择基于真实标签来标注我们的块级标签（Seg-level Label），以降低标注难度。

与从头开始标注相比，在这种标注模式下，标注工具不需要对每个实例位置的语义类别进行标注。

在场景显示窗口中，不同的颜色表示不同的实例，白色表示实例已被标记。在标注过程刚开始时，场景以非白色显示。

标注者需要对每个实例进行标注，以使场景在所有区域都变为白色。

与鼠标光标对应的过分割块也同样会显示为红色。

当通过鼠标单击对实例位置进行标注时，对应于实例位置的过分割块的颜色会从红色变为黑色。同时，上一个标注的实例颜色会变为白色，表示该实例已经标注。

### 标注后

标注结果包括实例位置和块级标签。

对于块级标签，不同的颜色表示它们属于不同的实例，场景未标注的区域为白色，实例位置用小红球来指示。

&nbsp;

## 控制标注工具

鼠标左键 + 移动：平移场景

鼠标右键 + 移动：旋转场景

鼠标滚轮：上下缩放

A/D：上一个/下一个场景

空格：显示过分割结果

F：改变颜色

H：重置相机

Q：显示原始三维扫描网格场景

### 标注过程

Shift + 鼠标左键：添加标注

Z：删除刚才的标注

### 标注后

E：显示实例位置

W：标注结果和真实标签之间的交换（仅对基于真实标签的标注模式有效）

&nbsp;
## 参考代码库:
- [point-cloud-annotator](https://github.com/zexihan/point-cloud-annotator)  
