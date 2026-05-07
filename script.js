// Danh sách 4 điểm đến trọng điểm
const destinations = [
    {
        id: 0,
        name: "Cầu Bình Lợi cũ",
        description: "Biểu tượng lịch sử trăm năm, view sông & cầu sắt hoài niệm.",
        image: "https://picsum.photos/id/104/400/250",
        mission: "Check-in và chụp ảnh cùng cây cầu cổ, tìm hiểu 1 sự kiện lịch sử.",
        badgeName: "Huy hiệu Người Kể Chuyện Cầu",
        badgeIcon: "🌉",
        checkedIn: false,
        rewardOffer: "🎁 Giảm 10% tại quán cà phê Bình Lợi View"
    },
    {
        id: 1,
        name: "Chợ nổi Bình Lợi",
        description: "Phiên chợ sông độc đáo, trái cây miệt vườn & hàng thủ công.",
        image: "https://picsum.photos/id/133/400/250",
        mission: "Thử một loại đặc sản địa phương và chụp ảnh giao lưu với tiểu thương.",
        badgeName: "Huy hiệu Nhà Buôn Sông Nước",
        badgeIcon: "🛶",
        checkedIn: false,
        rewardOffer: "🎁 Miễn phí 1 ly nước mía hoặc trà gừng"
    },
    {
        id: 2,
        name: "Làng gốm cổ Bình Lợi",
        description: "Lò gốm truyền thống hơn 100 năm, workshop làm gốm mini.",
        image: "https://picsum.photos/id/39/400/250",
        mission: "Tự tay nặn một sản phẩm gốm nhỏ và check-in khu trưng bày.",
        badgeName: "Huy hiệu Nghệ nhân Đất",
        badgeIcon: "🏺",
        checkedIn: false,
        rewardOffer: "🎁 Giảm 20% cho lớp học làm gốm trải nghiệm"
    },
    {
        id: 3,
        name: "Bến Bạch Đằng xưa",
        description: "Bến sông yên bình, nơi giao thoa giữa phố thị và miền sông nước.",
        image: "https://picsum.photos/id/21/400/250",
        mission: "Đi dạo bờ sông lúc hoàng hôn, lưu lại 1 khoảnh khắc thư giãn.",
        badgeName: "Huy hiệu Hoàng Hôn Sông Nước",
        badgeIcon: "🌅",
        checkedIn: false,
        rewardOffer: "🎁 Voucher 50k cho nhà hàng ẩm thực ven sông"
    }
];

// State quản lý người dùng
let userProgress = {
    visited: [false, false, false, false],
    collectedBadges: [false, false, false, false],
    rewardsClaimed: []
};

// Tải dữ liệu từ localStorage
function loadProgress() {
    const saved = localStorage.getItem("binhloi_journey");
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.visited && data.collectedBadges && data.rewardsClaimed) {
                userProgress = data;
                destinations.forEach((dest, idx) => {
                    dest.checkedIn = userProgress.visited[idx];
                });
            }
        } catch(e) { 
            console.warn(e); 
        }
    }
    syncDestCheckins();
    renderAll();
}

// Đồng bộ trạng thái check-in
function syncDestCheckins() {
    destinations.forEach((dest, idx) => {
        dest.checkedIn = userProgress.visited[idx];
    });
}

// Reset toàn bộ tiến trình
function resetAllProgress() {
    userProgress = {
        visited: [false, false, false, false],
        collectedBadges: [false, false, false, false],
        rewardsClaimed: []
    };
    destinations.forEach(d => d.checkedIn = false);
    saveToLocal();
    renderAll();
    showToastMessage("🔄 Đã làm mới hành trình! Hãy bắt đầu khám phá lại Bình Lợi nhé.", "info");
}

// Lưu vào localStorage
function saveToLocal() {
    localStorage.setItem("binhloi_journey", JSON.stringify(userProgress));
}

// Thực hiện check-in
function performCheckIn(destId) {
    if (userProgress.visited[destId]) {
        showToastMessage(`✨ Bạn đã check-in tại ${destinations[destId].name} rồi!`, "info");
        return;
    }
    
    // Đánh dấu đã check-in
    userProgress.visited[destId] = true;
    destinations[destId].checkedIn = true;
    
    let badgeJustReceived = false;
    if (!userProgress.collectedBadges[destId]) {
        userProgress.collectedBadges[destId] = true;
        badgeJustReceived = true;
        const offer = destinations[destId].rewardOffer;
        if (!userProgress.rewardsClaimed.includes(offer)) {
            userProgress.rewardsClaimed.push(offer);
        }
    }
    
    saveToLocal();
    
    const dest = destinations[destId];
    if (badgeJustReceived) {
        showToastMessage(`✅ Hoàn thành nhiệm vụ tại "${dest.name}"! +1 ${dest.badgeName} 🎖️. ${dest.rewardOffer}`, "success");
    }
    
    renderAll();
    
    // Kiểm tra hoàn thành全部 huy hiệu
    const totalBadgesOwned = userProgress.collectedBadges.filter(v => v === true).length;
    if (totalBadgesOwned === 4 && badgeJustReceived) {
        setTimeout(() => {
            showToastMessage("🏆 CHÚC MỪNG! Bạn đã sưu tập đủ 4 huy hiệu Bình Lợi - Nhận ngay combo ưu đãi đặc biệt giảm 15% toàn tour!", "gold");
            const superOffer = "🎉 Combo ưu đãi đặc biệt: Giảm 15% toàn bộ dịch vụ lữ hành Bình Lợi";
            if (!userProgress.rewardsClaimed.includes(superOffer)) {
                userProgress.rewardsClaimed.push(superOffer);
                saveToLocal();
                renderAll();
            }
        }, 300);
    }
}

// Gợi ý điểm check-in tiếp theo
function getSuggestNextCheckin() {
    for (let i = 0; i < destinations.length; i++) {
        if (!userProgress.visited[i]) {
            return destinations[i].name;
        }
    }
    return "Tất cả các điểm đã khám phá! 🎉 Hãy tận hưởng ưu đãi nhé.";
}

// Render toàn bộ giao diện
function renderAll() {
    renderDestinations();
    renderBadges();
    renderOffersAndStats();
    
    const suggestSpan = document.getElementById("recommendTip");
    if (suggestSpan) {
        const nextSpot = getSuggestNextCheckin();
        suggestSpan.innerHTML = `📍 Gợi ý tọa độ check-in: ${nextSpot}`;
    }
}

// Render danh sách điểm đến
function renderDestinations() {
    const grid = document.getElementById("destinationsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    destinations.forEach((dest, idx) => {
        const card = document.createElement("div");
        card.className = "destination-card";
        const isChecked = userProgress.visited[idx];
        const badgeStatusHtml = isChecked ? 
            `<span class="badge-earned"><i class="fas fa-check-circle"></i> Đã check-in</span>` : 
            `<span class="badge-mission"><i class="fas fa-tasks"></i> Nhiệm vụ chờ</span>`;
        
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${dest.image}'); background-size: cover; background-position: center;">
                ${badgeStatusHtml}
            </div>
            <div class="card-content">
                <h3>${dest.name}</h3>
                <p style="font-size:0.85rem; margin: 6px 0; color: #666;">${dest.description}</p>
                <div style="background:#FBF5E8; border-radius:12px; padding: 8px; margin: 10px 0;">
                    <i class="fas fa-clipboard-list"></i> <strong>Nhiệm vụ:</strong> ${dest.mission}
                </div>
                <div class="checkin-area">
                    <div><i class="fas fa-tag"></i> <span style="font-size:0.75rem;">${dest.rewardOffer}</span></div>
                    <button class="btn-checkin" data-id="${idx}" ${isChecked ? 'disabled' : ''}>
                        <i class="fas fa-map-marker-alt"></i> ${isChecked ? 'Đã check-in' : 'Check-in ngay'}
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Gắn sự kiện cho các nút check-in
    document.querySelectorAll('.btn-checkin[data-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            if (!isNaN(id) && !userProgress.visited[id]) {
                performCheckIn(id);
            }
        });
    });
}

// Render danh sách huy hiệu
function renderBadges() {
    const badgeContainer = document.getElementById("badgeGrid");
    if (!badgeContainer) return;
    badgeContainer.innerHTML = "";
    
    destinations.forEach((dest, idx) => {
        const isCollected = userProgress.collectedBadges[idx];
        const badgeDiv = document.createElement("div");
        badgeDiv.className = `badge-item ${!isCollected ? 'locked' : ''}`;
        badgeDiv.innerHTML = `
            <i style="color:${isCollected ? 'var(--vang-mai)' : '#b0a07c'}">${dest.badgeIcon}</i>
            <strong>${dest.badgeName}</strong>
            ${isCollected ? '<i class="fas fa-check-circle" style="color:#4CAF50; margin-left:6px;"></i>' : '<span style="font-size:0.7rem; margin-left:6px;">🔒 Chưa khám phá</span>'}
        `;
        badgeContainer.appendChild(badgeDiv);
    });
}

// Render ưu đãi và thống kê
function renderOffersAndStats() {
    const offerArea = document.getElementById("offerMessageArea");
    const totalBadges = userProgress.collectedBadges.filter(v => v === true).length;
    const totalOffers = userProgress.rewardsClaimed.length;
    
    document.getElementById("totalBadgeCount").innerText = totalBadges;
    document.getElementById("offerCount").innerText = totalOffers;
    
    if (userProgress.rewardsClaimed.length === 0) {
        offerArea.innerHTML = `<div class="offer-message"><i class="fas fa-gift"></i> Hãy check-in tại các điểm đến để nhận ưu đãi và sưu tập huy hiệu!</div>`;
    } else {
        let offersHtml = `<div class="offer-message" style="flex-direction:column; align-items:flex-start;">
            <i class="fas fa-ticket-alt"></i> <strong>🎁 Các ưu đãi đã nhận (${totalOffers}):</strong>
            <ul style="margin-left:1.5rem; margin-top:8px;">`;
        userProgress.rewardsClaimed.forEach(offer => {
            offersHtml += `<li><i class="fas fa-check-circle" style="color:var(--xanh-la);"></i> ${offer}</li>`;
        });
        offersHtml += `</ul></div>`;
        offerArea.innerHTML = offersHtml;
    }
}

// Hiển thị thông báo
function showToastMessage(msg, type = "success") {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "20px";
    toast.style.backgroundColor = type === "gold" ? "#FFD966" : (type === "success" ? "#4CAF50" : "#C44536");
    toast.style.color = type === "gold" ? "#2C2A29" : "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "50px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";
    toast.style.maxWidth = "350px";
    toast.style.fontSize = "0.85rem";
    toast.style.backdropFilter = "blur(4px)";
    toast.innerHTML = `<i class="fas fa-bell"></i> ${msg}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Khởi tạo khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
    loadProgress();
    document.getElementById("resetProgressBtn")?.addEventListener("click", resetAllProgress);
});
