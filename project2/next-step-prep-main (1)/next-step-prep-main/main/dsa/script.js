document.addEventListener('DOMContentLoaded', function() {
    // Initialize all topics with new design
    const topics = document.querySelectorAll('.topic');
    topics.forEach(initializeTopicProgress);

    // Add click listeners to all checkboxes
    document.querySelectorAll('.problem input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
        
        // Load saved state
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
            checkbox.closest('.problem').classList.add('completed');
        }
    });

    // Initial progress update for all topics
    topics.forEach(updateTopicProgress);
    
    // Initial global progress update
    updateGlobalProgress();

    // Initialize overall progress
    updateOverallProgress();
});

function initializeTopicProgress(topic) {
    const oldH2 = topic.querySelector('h2');
    const topicName = oldH2.textContent.trim().split('(')[0].trim();
    
    // Add data-topic attribute
    topic.setAttribute('data-topic', topicName);
    
    // Create new header structure
    const topicHeader = document.createElement('div');
    topicHeader.className = 'topic-header';

    // Create title
    const title = document.createElement('div');
    title.className = 'topic-title';
    title.textContent = topicName;

    // Create progress wrapper
    const progressWrapper = document.createElement('div');
    progressWrapper.className = 'topic-progress-wrapper';

    // Create progress text
    const progressText = document.createElement('div');
    progressText.className = 'topic-progress-text';
    progressText.textContent = '0/0';

    // Create progress container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'topic-progress-container';

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'topic-progress-bar';

    // Assemble the structure
    progressContainer.appendChild(progressBar);
    progressWrapper.appendChild(progressText);
    progressWrapper.appendChild(progressContainer);
    
    topicHeader.appendChild(title);
    topicHeader.appendChild(progressWrapper);

    // Replace old h2 with new header
    oldH2.replaceWith(topicHeader);

    // Add click handler for collapsing
    topicHeader.addEventListener('click', () => {
        topic.classList.toggle('collapsed');
    });

    // Initialize as collapsed
    topic.classList.add('collapsed');

    // Initial progress update
    updateTopicProgress(topic);
}

function updateGlobalProgress() {
    const totalProblems = document.querySelectorAll('.problem').length;
    const completedProblems = document.querySelectorAll('.problem input[type="checkbox"]:checked').length;
    const progressPercentage = Math.round((completedProblems / totalProblems) * 100);

    const globalProgressBar = document.querySelector('.global-progress-bar');
    const globalProgressText = document.querySelector('.global-progress-text');

    if (globalProgressBar && globalProgressText) {
        globalProgressBar.style.width = `${progressPercentage}%`;
        globalProgressText.textContent = `${completedProblems}/${totalProblems}`;

        // Update color based on progress
        if (progressPercentage === 100) {
            globalProgressBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        } else {
            globalProgressBar.style.background = 'linear-gradient(90deg, var(--primary-color), #60a5fa)';
        }
    }
}

function handleCheckboxChange(event) {
    const checkbox = event.target;
    const problem = checkbox.closest('.problem');
    const topic = problem.closest('.topic');
    
    // Save checkbox state
    localStorage.setItem(checkbox.id, checkbox.checked);
    
    if (checkbox.checked) {
        problem.classList.add('completed');
    } else {
        problem.classList.remove('completed');
    }
    
    updateTopicProgress(topic);
    updateGlobalProgress(); // Update global progress when any checkbox changes
    updateOverallProgress();
}

function updateTopicProgress(topic) {
    const totalProblems = topic.querySelectorAll('.problem').length;
    const completedProblems = topic.querySelectorAll('.problem input[type="checkbox"]:checked').length;
    const progressPercentage = Math.round((completedProblems / totalProblems) * 100);

    // Update progress bar
    const progressBar = topic.querySelector('.topic-progress-bar');
    const progressText = topic.querySelector('.topic-progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedProblems}/${totalProblems}`;

        // Update completed status
        if (progressPercentage === 100) {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #ff9f43, #ff7b00)';
        }
    }
}

// Progress bar animation function
function animateProgressBar(progressBar, targetWidth) {
    let currentWidth = parseFloat(progressBar.style.width) || 0;
    const duration = 600; // Animation duration in ms
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOut(progress);
        
        const newWidth = currentWidth + (targetWidth - currentWidth) * easedProgress;
        progressBar.style.width = `${newWidth}%`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function updateOverallProgress() {
    const totalProblems = 386;
    const completedProblems = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const progressBar = document.getElementById('overall-progress-bar');
    const progressFraction = document.getElementById('progress-fraction');
    
    // Calculate percentage
    const percentage = (completedProblems / totalProblems) * 100;
    
    // Animate the progress bar
    animateProgressBar(progressBar, percentage);
    
    // Update the text with a fade effect
    progressFraction.style.opacity = '0';
    setTimeout(() => {
        progressFraction.textContent = `${completedProblems} / ${totalProblems}`;
        progressFraction.style.opacity = '1';
    }, 200);
}

// Debounce function to prevent too frequent updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize progress tracking
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const debouncedUpdate = debounce(updateOverallProgress, 100);
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Add a subtle pulse animation to the progress bar container
            const progressContainer = document.querySelector('.progress-container');
            progressContainer.classList.add('pulse');
            setTimeout(() => progressContainer.classList.remove('pulse'), 500);
            
            debouncedUpdate();
        });
    });
    
    // Initial progress update
    updateOverallProgress();
});

// Add intersection observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe all topic sections
document.querySelectorAll('.topic').forEach(topic => {
    topic.style.opacity = '0';
    topic.style.transform = 'translateY(20px)';
    observer.observe(topic);
});

// Calculate and display progress
function updateProgress() {
    const topics = document.querySelectorAll('.topic');
    topics.forEach(topic => {
        const total = topic.querySelectorAll('input[type="checkbox"]').length;
        const checked = topic.querySelectorAll('input[type="checkbox"]:checked').length;
        const progress = Math.round((checked / total) * 100);
        
        // Update or create progress element
        let progressEl = topic.querySelector('.progress');
        if (!progressEl) {
            progressEl = document.createElement('div');
            progressEl.className = 'progress';
            topic.querySelector('h2').appendChild(progressEl);
        }
        progressEl.textContent = `${progress}%`;
    });
}

// Initial progress calculation
updateProgress();

// Update progress when checkboxes change
document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        updateProgress();
    }
}); 