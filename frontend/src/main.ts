import { initPasses, loadPasses } from "./passes";
import { initUsers, loadUsers } from "./users";
import { initLogs, loadLogs } from "./logs";

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target')!;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(target)?.classList.add('active');
        btn.classList.add('active');
        
        if (target === 'passes-view') loadPasses();
        if (target === 'users-view') loadUsers();
        if (target === 'logs-view') loadLogs();
    });
});

initPasses();
initUsers();
initLogs();

loadPasses();