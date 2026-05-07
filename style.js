let completedSteps = 0;

function completeTask(step) {
    // Mở khóa huy hiệu tương ứng
    const badge = document.getElementById(`badge-${step}`);
    if (badge.classList.contains('locked')) {
        badge.classList.remove('locked');
        badge.classList.add('unlocked');
        completedSteps++;
        
        alert(`Chúc mừng! Bạn đã nhận được Huy hiệu ${badge.querySelector('span').innerText}!`);
        
        // Mở khóa điểm đến tiếp theo
        const nextStep = document.querySelector(`.checkpoint[data-point="${step + 1}"]`);
        if (nextStep) {
            nextStep.classList.add('active');
            const nextBtn = nextStep.querySelector('.task-btn');
            nextBtn.disabled = false;
            nextBtn.setAttribute('onclick', `completeTask(${step + 1})`);
        }

        // Kiểm tra nếu hoàn thành tất cả
        if (completedSteps === 4) {
            document.getElementById('reward-msg').style.display = 'block';
        }
    }
}