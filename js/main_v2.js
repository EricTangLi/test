document.addEventListener('DOMContentLoaded', function() {
    // 1. 可选的 <details> 交互增强
    const allDetails = document.querySelectorAll('details.expandable-section');
    allDetails.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                this.classList.add('is-open');
                // console.log('Details opened:', this.querySelector('summary').textContent);
            } else {
                this.classList.remove('is-open');
                // console.log('Details closed:', this.querySelector('summary').textContent);
            }
        });
    });

    // 2. 聊天弹窗交互
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatArea = document.getElementById('chat-area');

    if (openChatBtn && chatArea) {
        openChatBtn.addEventListener('click', function() {
            chatArea.style.display = 'flex'; // Assuming flex display for the popup
            // console.log('Chat opened');
        });
    } else {
        console.warn('Open chat button or chat area not found.');
    }

    if (closeChatBtn && chatArea) {
        closeChatBtn.addEventListener('click', function() {
            chatArea.style.display = 'none';
            // console.log('Chat closed');
        });
    } else {
        console.warn('Close chat button or chat area not found (needed for close functionality).');
    }

    // 3. 聊天输入框“发送”按钮 (占位功能)
    const chatSendBtn = document.querySelector('#chat-area .chat-input .btn-send');
    const chatInput = document.querySelector('#chat-area .chat-input input[type="text"]');
    const messagesArea = document.querySelector('#chat-area .chat-messages');

    if (chatSendBtn && chatInput && messagesArea) {
        chatSendBtn.addEventListener('click', function() {
            const messageText = chatInput.value.trim();
            if (messageText) {
                console.log('发送消息 (前端占位):', messageText);

                // (可选) 在 .chat-messages 区域添加一条表示用户已发送消息的占位DOM元素
                const newMessage = document.createElement('p');
                newMessage.textContent = '我: ' + messageText;
                newMessage.style.textAlign = 'right'; // Prosty styl dla wiadomości użytkownika
                newMessage.style.color = '#333'; // Basic styling
                newMessage.style.marginBottom = '10px';

                messagesArea.appendChild(newMessage);
                messagesArea.scrollTop = messagesArea.scrollHeight; // Przewiń na dół

                chatInput.value = ''; // 清空输入框
            }
        });
    } else {
        console.warn('Chat send button, input field, or messages area not found.');
    }

    // 4. 预约复查建档按钮 (占位功能)
    const btnAppoint = document.getElementById('btn-appoint');
    if (btnAppoint) {
        btnAppoint.addEventListener('click', function() {
            console.log('预约复查建档按钮被点击 (前端占位)');
            alert('您点击了“预约复查建档”。此功能暂未实现。');
            // 未来可以跳转到预约页面或显示预约弹窗
        });
    } else {
        console.warn('Appointment button not found.');
    }

    // 5. Trend Line Drawing
    const currentPoint = document.querySelector('.data-point.current-point');
    const predictedPoint = document.querySelector('.data-point.predicted-point');
    const lineElement = document.getElementById('line-current-to-predicted');
    const chartContainer = document.querySelector('.chart-container');

    if (currentPoint && predictedPoint && lineElement && chartContainer) {
        // Get positions relative to the chart container
        // The points are positioned by their bottom-left corner due to transform: translate(-50%, 50%)
        // We need their center positions. Width/height of points is 10px.
        const pointRadius = 5;

        const currentX = currentPoint.offsetLeft + pointRadius;
        const currentY = chartContainer.offsetHeight - (currentPoint.offsetTop + pointRadius); // Y is from bottom

        const predictedX = predictedPoint.offsetLeft + pointRadius;
        const predictedY = chartContainer.offsetHeight - (predictedPoint.offsetTop + pointRadius); // Y is from bottom

        const deltaX = predictedX - currentX;
        const deltaY = predictedY - currentY; // Y is inverted in screen coords vs. math coords

        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        lineElement.style.width = length + 'px';
        lineElement.style.transform = `rotate(${angle}deg)`;
        lineElement.style.position = 'absolute'; // Ensure position is absolute
        lineElement.style.left = currentX + 'px';
        // Position the line's top edge. currentY is from the bottom of the chartContainer.
        // (chartContainer.offsetHeight - currentY) gives the Y coordinate from the top.
        // Subtract lineElement.offsetHeight / 2 to center the line vertically on the point's Y.
        lineElement.style.top = (chartContainer.offsetHeight - currentY) - (lineElement.offsetHeight / 2) + 'px';

        // console.log(`Line drawn: from (${currentX},${currentY}) to (${predictedX},${predictedY}), length ${length}, angle ${angle}`);

    } else {
        console.warn('One or more elements for trend line drawing not found.');
    }

});
