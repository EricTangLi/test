/*!
 * VisionIQ Report - Reimagined JavaScript
 * 版本: 1.0
 * 作者: AI Worker
 * 描述: 为 report_reimagined.html 提供交互功能和动画效果。
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict'; // 启用严格模式

    // 辅助函数：检查元素是否存在，并在不存在时输出警告
    function checkElement(element, selector, context = '页面') {
        if (!element) {
            console.warn(`[${context}警告] 未找到元素: ${selector}`);
            return false;
        }
        return true;
    }

    // --- 1. 可选的 <details> 交互增强 (已集成到CSS动画触发) ---
    // 注意: CSS中的 .expand-icon 旋转和 .expandable-content 的 fadeIn 动画
    // 是通过 details[open] 选择器触发的，JS主要用于未来可能的更复杂交互。
    // 此处为确保与之前要求一致，添加 is-open 类，尽管当前CSS可能不直接使用它来驱动核心动画。
    const allDetails = document.querySelectorAll('details.expandable-section');
    allDetails.forEach(detail => {
        if (checkElement(detail, 'details.expandable-section', 'Details交互')) {
            detail.addEventListener('toggle', function() {
                if (this.open) {
                    this.classList.add('is-open');
                } else {
                    this.classList.remove('is-open');
                }
            });
        }
    });

    // --- 2. 聊天弹窗交互 ---
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatArea = document.getElementById('chat-area');

    if (checkElement(openChatBtn, '#open-chat-btn', '聊天弹窗') && 
        checkElement(chatArea, '#chat-area', '聊天弹窗')) {
        openChatBtn.addEventListener('click', function() {
            chatArea.classList.add('is-open'); // CSS控制显示动画
            // console.log('聊天弹窗已打开');
        });
    }

    if (checkElement(closeChatBtn, '#close-chat-btn', '聊天弹窗') && 
        checkElement(chatArea, '#chat-area', '聊天弹窗')) {
        closeChatBtn.addEventListener('click', function() {
            chatArea.classList.remove('is-open'); // CSS控制隐藏动画
            // console.log('聊天弹窗已关闭');
        });
    }

    // --- 3. 聊天“发送”按钮功能 (占位) ---
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatInputField = document.getElementById('chat-input-field');
    const chatMessagesArea = document.querySelector('#chat-area .chat-messages');

    if (checkElement(chatSendBtn, '#chat-send-btn', '聊天功能') &&
        checkElement(chatInputField, '#chat-input-field', '聊天功能') &&
        checkElement(chatMessagesArea, '.chat-messages', '聊天功能')) {
        
        // 移除初始占位符文本（如果存在且聊天开始）
        const initialPlaceholder = chatMessagesArea.querySelector('.chat-placeholder-text');
        if(initialPlaceholder) {
            initialPlaceholder.remove(); // 仅在第一次发送时或加载时移除
        }

        chatSendBtn.addEventListener('click', function() {
            const messageText = chatInputField.value.trim();
            if (messageText) {
                // 创建用户消息元素
                const userMessageElement = document.createElement('p');
                userMessageElement.classList.add('chat-message', 'user-message');
                userMessageElement.innerHTML = `<strong>我:</strong> ${escapeHTML(messageText)}`; // 防止XSS
                chatMessagesArea.appendChild(userMessageElement);

                // 清空输入框
                chatInputField.value = '';

                // 将消息区域滚动到底部
                chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;

                console.log("前端消息发送 (占位):", messageText);

                // (可选) 模拟医生回复的简单占位
                setTimeout(() => {
                    const doctorReplyElement = document.createElement('p');
                    doctorReplyElement.classList.add('chat-message', 'doctor-message'); // 假设有 .doctor-message 样式
                    doctorReplyElement.innerHTML = `<strong>医生:</strong> 您好，已收到您的问题："${escapeHTML(messageText.substring(0,20))}..." (自动回复占位)`;
                    chatMessagesArea.appendChild(doctorReplyElement);
                    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
                }, 1000);
            }
        });
    }

    // HTML转义函数，防止XSS
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    // --- 4. “预约复查建档”按钮 (#btn-appoint) 占位功能 ---
    const btnAppoint = document.getElementById('btn-appoint');
    if (checkElement(btnAppoint, '#btn-appoint', '预约按钮')) {
        btnAppoint.addEventListener('click', function() {
            alert("预约功能正在开发中，敬请期待！");
            console.log("预约复查建档按钮被点击 (占位功能)");
        });
    }

    // --- 5. 页面模块加载动画 (Intersection Observer) ---
    const reportModules = document.querySelectorAll('.report-module');
    if (reportModules.length > 0) {
        const observerOptions = {
            root: null, // 相对于视口
            rootMargin: '0px',
            threshold: 0.1 // 模块10%可见时触发
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // 动画执行一次后停止观察
                    // console.log(`模块 ${entry.target.id || ''} 已变为可见`);
                }
            });
        };

        const moduleObserver = new IntersectionObserver(observerCallback, observerOptions);
        reportModules.forEach(module => moduleObserver.observe(module));
    } else {
        console.warn('[模块加载动画] 未找到 .report-module 元素');
    }

    // --- 6. 示意性趋势图的JS辅助 (线条绘制) ---
    function drawTrendLine() {
        const chartPlaceholder = document.getElementById('trend-chart-placeholder');
        // 确保在图表占位符内查找，以防页面其他地方有类似类名
        if (!checkElement(chartPlaceholder, '#trend-chart-placeholder', '趋势图')) return;

        const currentPoint = chartPlaceholder.querySelector('.data-point.current-point');
        const predictedPoint = chartPlaceholder.querySelector('.data-point.predicted-point');
        // 假设趋势线元素已在HTML中，或者动态创建它
        let lineElement = chartPlaceholder.querySelector('.trend-line'); 
        const chartContainer = chartPlaceholder.querySelector('.chart-container'); // HTML中应有此容器

        if (!checkElement(currentPoint, '.data-point.current-point', '趋势图') ||
            !checkElement(predictedPoint, '.data-point.predicted-point', '趋势图') ||
            !checkElement(chartContainer, '.chart-container', '趋势图')) {
            console.warn('[趋势图] 缺少绘制线条所需的关键元素。');
            return;
        }

        // 如果HTML中没有 .trend-line 元素，则动态创建 (更稳健)
        if (!lineElement) {
            lineElement = document.createElement('div');
            lineElement.classList.add('trend-line');
            // lineElement.id = 'line-current-to-predicted'; // 可选ID
            chartContainer.appendChild(lineElement); // 添加到图表容器中
        }


        // 获取数据点相对于图表容器的中心位置
        // data-point 的 transform: translate(-50%, 50%) 使其视觉中心在其left/bottom坐标
        // offsetLeft/Top 是相对于 offsetParent (通常是 .chart-container)
        const pointRadius = currentPoint.offsetWidth / 2; // 假设点是圆形且offsetWidth可用

        const currentX = currentPoint.offsetLeft + pointRadius;
        // Y坐标需要从容器底部计算，因为点的bottom属性是相对于容器底部的
        const currentY = chartContainer.offsetHeight - currentPoint.offsetTop - pointRadius;

        const predictedX = predictedPoint.offsetLeft + pointRadius;
        const predictedY = chartContainer.offsetHeight - predictedPoint.offsetTop - pointRadius;

        const deltaX = predictedX - currentX;
        const deltaY = predictedY - currentY; // 注意：屏幕Y轴向下为正，数学Y轴向上为正

        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        // atan2(y,x) 返回弧度，转换为角度。屏幕Y轴反转，所以deltaY可能需要取反，取决于坐标系定义
        // 如果 (0,0) 是左上角，则 deltaY (y2-y1) 为负值表示向上，atan2 会处理好
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        lineElement.style.width = length + 'px';
        // CSS中 transform-origin: left center; 很重要
        lineElement.style.transform = `rotate(${angle}deg)`; 
        lineElement.style.position = 'absolute'; // 确保绝对定位
        
        // 定位线条的起点（左边缘中点）到 currentPoint 的中心
        lineElement.style.left = currentX + 'px';
        // top 是相对于父容器顶部的。chartContainer.offsetHeight - currentY 是 currentPoint 中心点Y坐标（从顶部算）
        // 然后减去线条高度的一半，使线条垂直居中于其旋转轴
        lineElement.style.top = (chartContainer.offsetHeight - currentY - (lineElement.offsetHeight / 2)) + 'px';
        
        // console.log(`趋势线绘制: 从 (${currentX},${currentY}) 到 (${predictedX},${predictedY}), 长度 ${length}, 角度 ${angle}deg`);
        // console.log('Line Top:', lineElement.style.top, 'Line Left:', lineElement.style.left);
    }

    // 页面加载后绘制趋势线
    // 如果图表或其数据点是动态加载的，则应在相应数据加载完成后调用此函数
    drawTrendLine(); 
    // 可选：如果窗口大小改变可能影响布局，重新绘制
    // window.addEventListener('resize', drawTrendLine); 

    // console.log("儿童视力健康筛查报告 (优化版) JavaScript 已加载并执行。"); // 可选的加载完成日志
});
