# vue-quill-editor-ImageResize8
vue-quill-editor框架下ImageResize支持图片8个方向收缩

#使用方式
// 自定义图片缩放组件引用;
import ImageResize8 from './ImageResize8.js' 
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
