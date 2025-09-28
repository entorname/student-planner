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


// Initialize the planner when the page loads
let planner;
document.addEventListener('DOMContentLoaded', () => {
    planner = new StudentPlanner();
    
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
