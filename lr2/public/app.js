document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
        
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            if (targetId === 'users-view') loadUsers();
            if (targetId === 'passes-view') loadPasses();
            if (targetId === 'logs-view') loadLogs();
        });
    });

    
});