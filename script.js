/* ── Tab switching ── */
function switchTab(id, btn) {
    // Ẩn tất cả các section
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Bỏ trạng thái active của các nút tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    // Hiển thị section được chọn
    document.getElementById(id).classList.add('active');
    // Thêm active cho nút vừa click
    btn.classList.add('active');
}

/* ── Theo dõi tiến độ ── */
let doneMissions = 1;

function completeMission(card) {
    if (card.classList.contains('done')) return;

    // Đánh dấu hoàn thành trên giao diện
    card.classList.add('done');
    const statusIcon = card.querySelector('.mission-status');
    statusIcon.textContent = '✓';
    statusIcon.style.background = 'var(--xanh-la)';

    // Cập nhật thanh tiến độ nhiệm vụ
    doneMissions++;
    const totalMissions = 4;
    const pct = (doneMissions / totalMissions) * 100;
    
    const missionBar = document.getElementById('missionBar');
    if(missionBar) missionBar.style.width = pct + '%';
    
    const missionLabel = document.getElementById('missionLabel');
    if(missionLabel) missionLabel.textContent = doneMissions + '/' + totalMissions;

    showToast('🏅 Nhiệm vụ hoàn thành! Huy hiệu mới được mở khóa');
    updateBadges(doneMissions);
}

/* ── Cập nhật trạng thái Huy hiệu ── */
function updateBadges(n) {
    const items = document.querySelectorAll('.badge-item');
    const totalBadges = 8;

    for (let i = 0; i < n; i++) {
        if(items[i]) {
            items[i].classList.remove('locked');
            items[i].classList.add('unlocked');
            
            // Thêm tag "MỚI" cho huy hiệu vừa nhận
            if (i === n - 1 && !items[i].querySelector('.badge-new')) {
                const nb = document.createElement('div');
                nb.className = 'badge-new';
                nb.textContent = 'MỚI';
                items[i].appendChild(nb);
            }
        }
    }

    // Cập nhật thanh tiến độ huy hiệu
    const badgeBar = document.getElementById('badgeBar');
    if(badgeBar) badgeBar.style.width = (n / totalBadges * 100) + '%';
    
    const badgeCount = document.getElementById('badgeCount');
    if(badgeCount) badgeCount.textContent = n + '/' + totalBadges + ' huy hiệu';
}

/* ── Thông báo Toast ── */
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    
    setTimeout(() => {
        t.classList.remove('show');
    }, 2800);
}
