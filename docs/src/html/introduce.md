# HTML （Hyper Text Markup Language）

## 1. HTML 简介

HTML 是超文本标记语言，用于描述网页的结构和内容。它是一种标记语言，通过标签来组织和格式化文本、图像、链接等元素，从而创建网页。
由 Tim Berners-Lee 于 1991 年在 CERN 引入，当前版本为 HTML5.0（2014）。

## 2. HTML 基本结构

HTML 文档的基本结构包括以下几个部分：

```html
<!DOCTYPE html>
<html>
	<head>
		<title>HTML 简介</title>
		<meta charset="UTF-8" />
		<base href="./src/" target="_blank" />
		<link rel="stylesheet" href="style.css" />
		<script type="text/javascript" src="index.js"></script>
		<style type="text/css">
			div {
				background-color: skyblue;
			}
		</style>
	</head>
	<body>
		<h1>heading content</h1>
		<p>paragraph content</p>
	</body>
</html>
```

## 3. HTML 标签

HTML 标签用于描述网页中的内容，包括标题、段落、链接、图像等。常见的 HTML 标签有：

- `<!DOCTYPE html>` 文档类型声明（并不是标签）。它将文档声明为 HTML 文档。文档类型声明不区分大小写
- `<html>` 根标签，表示整个 HTML 文档。
- `<head>` 头部标签，包含文档的元数据，如标题、样式表等。该标签在网页中不可见。`<head>` 元素内可包含以下元素
  - `<style>` 允许将样式插入到网页中
  - `<title>` 浏览器顶部的内容，包含网页标题
  - `<base>` 指定文档中所有相对 URL 的基本 URL
  - `<link>` 指定外部资源、如样式表、脚本等
  - `<meta>` 网站元数据
  - `<script>` 脚本
- `<title>` 标题标签，表示网页的标题。
- `<body>` 主体标签，包含网页的主要内容，如文本、图像、链接等。
- `<h1>` - `<h6>` 标题标签，用于定义标题，其中 `<h1>` 是最大的标题，`<h6>` 是最小的标题。
- `<p>` 段落标签，用于定义段落。

## 4. HTML 属性

HTML 属性用于为 HTML 元素提供额外的信息，如样式、链接等。常见的 HTML 属性有：

- `id` 元素的唯一标识符
- `class` 元素的类名，用于样式和脚本
- `style` 内联样式
- `src` 资源路径
- `href` 链接路径
- `target` 链接打开方式

## 5. HTML 常用标签

- `<a>` 链接标签，用于创建超链接
- `<img>` 图像标签，用于插入图像
- `<table>` 表格标签，用于创建表格
- `<form>` 表单标签，用于创建表单
- `<input>` 输入标签，用于创建输入框
- `<button>` 按钮标签，用于创建按钮
- `<select>` 下拉列表标签，用于创建下拉列表
- `<option>` 选项标签，用于创建下拉列表的选项

## 6. HTML5 新特性

HTML5 引入了一些新的特性和元素，如：

- `<canvas>` 元素，用于绘制图形
- `<audio>` 和 `<video>` 元素，用于嵌入音频和视频
- `<nav>` 元素，用于定义导航链接
- `<header>` 和 `<footer>` 元素，用于定义页眉和页脚
- `<section>` 元素，用于定义文档中的节
- `<article>` 元素，用于定义独立的内容块
- `<aside>` 元素，用于定义侧边栏内容

## 7. HTML5 语义化标签

HTML5 引入了一些语义化标签，如：

- `<header>` 定义文档或节的头部
- `<footer>` 定义文档或节的尾部
- `<nav>` 定义导航链接
- `<article>` 定义独立的内容块
- `<section>` 定义文档中的节
- `<aside>` 定义侧边栏内容
- `<figure>` 和 `<figcaption>` 定义图像及其描述
- `<time>` 定义日期和时间

## 8. HTML5 表单

HTML5 引入了一些新的表单元素和属性，如：

- `<input>` 元素的新类型，如 `email`、`url`、`number`、`range`、`date` 等
- `<datalist>` 元素，用于创建输入框的自动完成列表
- `<output>` 元素，用于显示表单计算结果
- `<keygen>` 元素，用于创建密钥对生成器
- `<progress>` 元素，用于显示任务的进度
- `<meter>` 元素，用于显示已知范围的度量值

## 9. HTML5 媒体

HTML5 引入了一些新的媒体元素，如：

- `<audio>` 元素，用于嵌入音频
- `<video>` 元素，用于嵌入视频
- `<source>` 元素，用于指定媒体资源的路径和格式
- `<track>` 元素，用于指定媒体资源的字幕和字幕轨道

## 10. HTML5 存储

HTML5 引入了一些新的存储机制，如：

- `localStorage` 和 `sessionStorage`，用于在客户端存储数据
- `Web SQL Database`，用于在客户端存储结构化数据

## 11. HTML5 Web Workers

HTML5 引入了一些新的 Web Workers，用于在后台线程中执行 JavaScript 代码，以避免阻塞主线程。

## 12. HTML5 Web Sockets

HTML5 引入了一些新的 Web Sockets，用于在客户端和服务器之间建立持久连接，实现实时通信。

## 13. HTML5 Geolocation

HTML5 引入了一些新的 Geolocation API，用于获取用户的位置信息。

## 14. HTML5 File API

HTML5 引入了一些新的 File API，用于在客户端操作文件和目录。

## 15. HTML5 Drag and Drop

HTML5 引入了一些新的 Drag and Drop API，用于实现拖放功能。

## 16. HTML5 Canvas

HTML5 引入了一些新的 Canvas API，用于在网页上绘制图形和动画。

## 17. HTML5 SVG

HTML5 引入了一些新的 SVG API，用于在网页上绘制矢量图形。

## 18. HTML5 MathML

HTML5 引入了一些新的 MathML API，用于在网页上显示数学公式。

## 19. HTML5 WebRTC

HTML5 引入了一些新的 WebRTC API，用于实现实时通信。

## 20. HTML5 WebVTT

HTML5 引入了一些新的 WebVTT API，用于在网页上显示字幕和字幕轨道。

## 21. HTML5 Web Speech API

HTML5 引入了一些新的 Web Speech API，用于实现语音识别和语音合成。

## 22. HTML5 WebRTC

HTML5 引入了一些新的 WebRTC API，用于实现实时通信。

## 23. HTML5 WebVTT

HTML5 引入了一些新的 WebVTT API，用于在网页上显示字幕和字幕轨道。

## 24. HTML5 Web Speech API

HTML5 引入了一些新的 Web Speech API，用于实现语音识别和语音合成。

## 25. HTML5 WebRTC

HTML5 引入了一些新的 WebRTC API，用于实现实时通信。

## 26. HTML5 WebVTT

HTML5 引入了一些新的 WebVTT API，用于在网页上显示字幕和字幕轨道。

## 27. HTML5 Web Speech API

HTML5 引入了一些新的 Web Speech API，用于实现语音识别和语音合成。

## 29. HTML 注释

在 HTML 中，注释以 `<!--` 开头，以 `-->` 结尾。注释不会在浏览器中显示，但它们可以帮助开发人员理解代码。

例如：

```html
<!-- 这是一个注释 -->
<p>这是一个段落。</p>
```

在上面的例子中，`<!-- 这是一个注释 -->` 是一个注释，它不会在浏览器中显示。
