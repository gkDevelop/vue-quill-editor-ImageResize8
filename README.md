# vue-quill-editor-ImageResize8
vue-quill-editor框架下ImageResize支持图片8个方向收缩

#使用方式
import ImageResize8 from './ImageResize8.js' // 自定义图片缩放组件引用;
Quill.register('modules/ImageResize8', ImageResize8)

editorOption: {
  ...,
  modules: {
    ...,
     imageResize8: {
       handlecolor: 'red',
    }
  }
}
