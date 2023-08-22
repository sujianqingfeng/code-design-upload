# code-design-upload

> code-design 暂时只支持上传图片

## 安装

当前插件并没有上架 google 商店
在 release 下载 code-design-upload.zip，浏览器打开开发者模式，把文件拖入即可。

## json 配置签名如下

> 可以参考[scheme.json](./scheme.json)文件

```ts
type Config = {
  // 配置名称
  name: string
  // 图片上传bt按钮文本
  pictureUploadBtText: string
  // 上传地址
  action: string
  // 表单文件的key
  fileKey: string
  // 额外的参数
  extraForm: Record<string, any>
  // 验证返回结果
  verifyIsOk: {
    // 取值路径
    path: string
    // 验证值
    value?: any
  }
  resultMap: {
    // 取url路径
    urlPath: string
  }
  // 文件名称射k
  formMapName?: string | undefined
}
```
