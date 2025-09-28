class StudentPlanner {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.updateDateDisplay();
        this.bindEvents();
        this.renderTasks();
    }

    updateDateDisplay() {
        const dateElement = document.getElementById('current-date');
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = this.currentDate.toLocaleDateString('en-US', options);
    }

    bindEvents() {
        const addBtn = document.getElementById('add-btn');
        const taskInput = document.getElementById('task-input');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    addTask() {
        const taskInput = document.getElementById('task-input');
        const categorySelect = document.getElementById('category-select');
        const taskText = taskInput.value.trim();

        if (!taskText) {
            this.showNotification('Please enter a task!', 'warning');
            return;
        }

        const task = {
            id: Date.now().toString(),
            text: taskText,
            category: categorySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        
        taskInput.value = '';
        this.showNotification('Task added successfully!', 'success');
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.showNotification('Task deleted!', 'info');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    renderTasks() {
        const categories = ['assignments', 'study', 'events'];
        
        categories.forEach(category => {
            const listElement = document.getElementById(`${category}-list`);
            const categoryTasks = this.tasks.filter(task => task.category === category);
            
            if (categoryTasks.length === 0) {
                listElement.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
                return;
            }

            listElement.innerHTML = categoryTasks.map(task => `
                <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                    <span class="task-text" onclick="planner.toggleTask('${task.id}')" style="cursor: pointer; ${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                        ${this.escapeHtml(task.text)}
                    </span>
                    <button class="delete-btn" onclick="planner.deleteTask('${task.id}')">
                        ✕
                    </button>
                </li>
            `).join('');
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('studentPlannerTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('studentPlannerTasks');
        return saved ? JSON.parse(saved) : [];
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });

        // Set background color based on type
        const colors = {
            success: '#48bb78',
            warning: '#ed8936',
            info: '#4299e1',
            error: '#f56565'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    clearAllTasks() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.showNotification('All tasks cleared!', 'info');
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `student-planner-tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Chinese Dictionary Data
const chineseDictionary = {
    '学': { pinyin: 'xué', meaning: 'to study, to learn' },
    '好': { pinyin: 'hǎo', meaning: 'good, well' },
    '人': { pinyin: 'rén', meaning: 'person, people' },
    '大': { pinyin: 'dà', meaning: 'big, large' },
    '小': { pinyin: 'xiǎo', meaning: 'small, little' },
    '中': { pinyin: 'zhōng', meaning: 'middle, center' },
    '国': { pinyin: 'guó', meaning: 'country, nation' },
    '水': { pinyin: 'shuǐ', meaning: 'water' },
    '火': { pinyin: 'huǒ', meaning: 'fire' },
    '山': { pinyin: 'shān', meaning: 'mountain' },
    '天': { pinyin: 'tiān', meaning: 'sky, heaven' },
    '地': { pinyin: 'dì', meaning: 'earth, ground' },
    '日': { pinyin: 'rì', meaning: 'sun, day' },
    '月': { pinyin: 'yuè', meaning: 'moon, month' },
    '年': { pinyin: 'nián', meaning: 'year' },
    '时': { pinyin: 'shí', meaning: 'time, hour' },
    '分': { pinyin: 'fēn', meaning: 'minute, to divide' },
    '秒': { pinyin: 'miǎo', meaning: 'second' },
    '家': { pinyin: 'jiā', meaning: 'home, family' },
    '爱': { pinyin: 'ài', meaning: 'love' },
    '心': { pinyin: 'xīn', meaning: 'heart, mind' },
    '手': { pinyin: 'shǒu', meaning: 'hand' },
    '眼': { pinyin: 'yǎn', meaning: 'eye' },
    '口': { pinyin: 'kǒu', meaning: 'mouth' },
    '耳': { pinyin: 'ěr', meaning: 'ear' },
    '头': { pinyin: 'tóu', meaning: 'head' },
    '身': { pinyin: 'shēn', meaning: 'body' },
    '脚': { pinyin: 'jiǎo', meaning: 'foot' },
    '走': { pinyin: 'zǒu', meaning: 'to walk' },
    '跑': { pinyin: 'pǎo', meaning: 'to run' }
};

class ChineseDictionary {
    constructor() {
        this.currentCharacter = '学';
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.strokeOrder = [];
        this.currentStroke = 0;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.bindEvents();
        this.loadCharacter('学');
        this.populateCharacterGrid();
    }

    setupCanvas() {
        this.canvas = document.getElementById('writing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = '#4a9d5c';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => this.searchCharacter());
        document.getElementById('hanzi-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCharacter();
        });

        // Pronunciation
        document.getElementById('pronounce-btn').addEventListener('click', () => this.pronounceCharacter());

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });

        // Canvas controls
        document.getElementById('clear-canvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('show-stroke-order').addEventListener('click', () => this.showStrokeOrder());
        document.getElementById('practice-mode').addEventListener('click', () => this.practiceMode());
    }

    switchTab(tab) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tab}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    }

    searchCharacter() {
        const searchTerm = document.getElementById('hanzi-search').value.trim();
        if (!searchTerm) return;

        // Search by Hanzi
        if (chineseDictionary[searchTerm]) {
            this.loadCharacter(searchTerm);
            return;
        }

        // Search by Pinyin
        for (const [hanzi, data] of Object.entries(chineseDictionary)) {
            if (data.pinyin.toLowerCase().includes(searchTerm.toLowerCase())) {
                this.loadCharacter(hanzi);
                return;
            }
            if (data.meaning.toLowerCase().includes(searchTerm.toLowerCase())) {
                this.loadCharacter(hanzi);
                return;
            }
        }

        this.showNotification('Character not found!', 'warning');
    }

    loadCharacter(hanzi) {
        if (!chineseDictionary[hanzi]) return;

        const data = chineseDictionary[hanzi];
        document.getElementById('current-hanzi').textContent = hanzi;
        document.getElementById('current-pinyin').textContent = data.pinyin;
        document.getElementById('current-meaning').textContent = data.meaning;
        
        this.currentCharacter = hanzi;
        this.generateStrokeOrder();
        this.clearCanvas();
    }

    pronounceCharacter() {
        const pinyin = document.getElementById('current-pinyin').textContent;
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(pinyin);
            utterance.lang = 'zh-CN';
            speechSynthesis.speak(utterance);
        } else {
            this.showNotification('Speech synthesis not supported', 'info');
        }
    }

    generateStrokeOrder() {
        // Simple stroke order simulation
        this.strokeOrder = [];
        const strokes = Math.floor(Math.random() * 5) + 3; // 3-7 strokes
        for (let i = 0; i < strokes; i++) {
            this.strokeOrder.push({
                x: Math.random() * 200 + 50,
                y: Math.random() * 200 + 50,
                width: Math.random() * 50 + 20
            });
        }
    }

    showStrokeOrder() {
        this.clearCanvas();
        this.currentStroke = 0;
        this.animateStroke();
    }

    animateStroke() {
        if (this.currentStroke >= this.strokeOrder.length) return;

        const stroke = this.strokeOrder[this.currentStroke];
        this.ctx.beginPath();
        this.ctx.arc(stroke.x, stroke.y, stroke.width, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.currentStroke++;
        setTimeout(() => this.animateStroke(), 500);
    }

    practiceMode() {
        this.clearCanvas();
        this.showNotification('Practice mode: Try to write the character!', 'info');
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    populateCharacterGrid() {
        const grid = document.getElementById('character-grid');
        grid.innerHTML = '';
        
        Object.entries(chineseDictionary).slice(0, 12).forEach(([hanzi, data]) => {
            const item = document.createElement('div');
            item.className = 'character-item';
            item.innerHTML = `
                <span class="character-hanzi">${hanzi}</span>
                <span class="character-pinyin">${data.pinyin}</span>
            `;
            item.addEventListener('click', () => this.loadCharacter(hanzi));
            grid.appendChild(item);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });

        // Set background color based on type
        const colors = {
            success: '#48bb78',
            warning: '#ed8936',
            info: '#4299e1',
            error: '#f56565'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the planner when the page loads
let planner;
let dictionary;
document.addEventListener('DOMContentLoaded', () => {
    planner = new StudentPlanner();
    dictionary = new ChineseDictionary();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully');
            })
            .catch((error) => {
                console.log('Service Worker registration failed');
            });
    }
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add task
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        planner.addTask();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        document.getElementById('task-input').value = '';
        document.getElementById('task-input').blur();
    }
});
