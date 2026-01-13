/**
 * Quill Image Resize 8 Directions Module
 * 实现一个支持 8 个方向调整图片大小的 Quill 模块
 */

class ImageResize8 {
    constructor(quill, options = {}) {
        this.quill = quill;
        this.options = Object.assign({
            handleSize: 8,
            handleColor: options.handlecolor || '#3b82f6',
            overlayColor: 'rgba(59, 130, 246, 0.1)'
        }, options);

        this.img = null;
        this.overlay = null;
        this.handles = [];

        // 监听点击事件
        this.quill.root.addEventListener('click', this.handleClick.bind(this), false);

        // 监听编辑器滚动，更新叠加层位置
        this.quill.root.addEventListener('scroll', this.repositionOverlay.bind(this));

        // 全局点击关闭
        document.addEventListener('mousedown', (e) => {
            if (this.img && !this.overlay.contains(e.target) && e.target !== this.img) {
                this.hide();
            }
        });
    }

    handleClick(evt) {
        if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG') {
            if (this.img === evt.target) return;
            this.show(evt.target);
        } else if (this.img) {
            this.hide();
        }
    }

    show(img) {
        this.img = img;
        this.showOverlay();
    }

    hide() {
        this.img = null;
        this.hideOverlay();
    }

    showOverlay() {
        if (this.overlay) {
            this.hideOverlay();
        }

        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'absolute',
            border: `1px dashed ${this.options.handleColor}`,
            backgroundColor: this.options.overlayColor,
            pointerEvents: 'none',
            zIndex: '10',
            boxSizing: 'border-box'
        });

        this.quill.container.appendChild(this.overlay);
        this.repositionOverlay();
        this.addHandles();
    }

    hideOverlay() {
        if (this.overlay) {
            this.quill.container.removeChild(this.overlay);
            this.overlay = null;
            this.handles = [];
        }
    }

    repositionOverlay() {
        if (!this.overlay || !this.img) return;

        const parentRect = this.quill.container.getBoundingClientRect();
        const imgRect = this.img.getBoundingClientRect();

        Object.assign(this.overlay.style, {
            left: `${imgRect.left - parentRect.left}px`,
            top: `${imgRect.top - parentRect.top}px`,
            width: `${imgRect.width}px`,
            height: `${imgRect.height}px`
        });
    }

    addHandles() {
        const handleSpecs = [
            { cursor: 'nw-resize', top: '0%', left: '0%', side: 'nw' },
            { cursor: 'n-resize', top: '0%', left: '50%', side: 'n' },
            { cursor: 'ne-resize', top: '0%', left: '100%', side: 'ne' },
            { cursor: 'e-resize', top: '50%', left: '100%', side: 'e' },
            { cursor: 'se-resize', top: '100%', left: '100%', side: 'se' },
            { cursor: 's-resize', top: '100%', left: '50%', side: 's' },
            { cursor: 'sw-resize', top: '100%', left: '0%', side: 'sw' },
            { cursor: 'w-resize', top: '50%', left: '0%', side: 'w' }
        ];

        handleSpecs.forEach(spec => {
            const handle = document.createElement('div');
            handle.dataset.side = spec.side;
            Object.assign(handle.style, {
                position: 'absolute',
                width: `${this.options.handleSize}px`,
                height: `${this.options.handleSize}px`,
                backgroundColor: this.options.handleColor,
                border: '1px solid white',
                borderRadius: '50%',
                left: spec.left,
                top: spec.top,
                marginLeft: `-${this.options.handleSize / 2}px`,
                marginTop: `-${this.options.handleSize / 2}px`,
                cursor: spec.cursor,
                pointerEvents: 'auto'
            });

            handle.addEventListener('mousedown', this.handleMousedown.bind(this), false);
            this.overlay.appendChild(handle);
            this.handles.push(handle);
        });
    }

    handleMousedown(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.dragSide = evt.target.dataset.side;
        this.dragStartX = evt.clientX;
        this.dragStartY = evt.clientY;
        this.startWidth = this.img.clientWidth;
        this.startHeight = this.img.clientHeight;
        this.startTop = parseFloat(this.img.style.marginTop || 0);
        this.startLeft = parseFloat(this.img.style.marginLeft || 0);

        this.onMouseMove = this.handleDrag.bind(this);
        this.onMouseUp = this.handleMouseup.bind(this);

        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('mouseup', this.onMouseUp, false);
    }

    handleDrag(evt) {
        if (!this.img) return;

        const deltaX = evt.clientX - this.dragStartX;
        const deltaY = evt.clientY - this.dragStartY;

        let newWidth = this.startWidth;
        let newHeight = this.startHeight;

        // 根据不同方向计算宽高
        if (this.dragSide.includes('e')) {
            newWidth = this.startWidth + deltaX;
        } else if (this.dragSide.includes('w')) {
            newWidth = this.startWidth - deltaX;
        }

        if (this.dragSide.includes('s')) {
            newHeight = this.startHeight + deltaY;
        } else if (this.dragSide.includes('n')) {
            newHeight = this.startHeight - deltaY;
        }

        // 限制最小尺寸
        newWidth = Math.max(20, newWidth);
        newHeight = Math.max(20, newHeight);

        // 应用尺寸
        this.img.style.width = `${newWidth}px`;
        this.img.style.height = `${newHeight}px`;

        this.repositionOverlay();
    }

    handleMouseup() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        // 触发 Quill 的内容变更
        this.quill.update('user');
    }
}

// 导出或注册到全局
if (window.Quill) {
    window.Quill.register('modules/imageResize8', ImageResize8);
}
