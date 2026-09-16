// قائمة المقالات (بدون أي مقالات افتراضية)
let allPosts = JSON.parse(localStorage.getItem('my_website_posts')) || [];

function renderPosts(postsToRender) {
    const container = document.getElementById('postsContainer');
    if (!postsToRender || postsToRender.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:var(--text-sub);">
                <p style="font-size:1.2rem; margin-bottom:10px;">📭 لا توجد مقالات حالياً</p>
                <p style="font-size:0.9rem;">يمكنك إضافة مقالات وأدوات جديدة من لوحة التحكم (admin.html)</p>
            </div>
        `;
        return;
    }

    container.innerHTML = postsToRender.map(post => `
        <div class="card" onclick="openModal(${post.id})">
            <span class="card-badge">${post.category}</span>
            ${post.image ? `<img src="${post.image}" class="card-img" alt="${post.title}">` : ''}
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 100)}...</p>
        </div>
    `).join('');
}

function openModal(id) {
    const post = allPosts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('modalCategory').innerText = post.category;
    document.getElementById('modalTitle').innerText = post.title;
    
    const imgElement = document.getElementById('modalImage');
    if (post.image) {
        imgElement.src = post.image;
        imgElement.style.display = 'block';
    } else {
        imgElement.style.display = 'none';
    }

    document.getElementById('modalContent').innerText = post.content;

    // تجهيز أزرار الروابط مع زر حذف المقال
    const linksContainer = document.getElementById('modalLinkContainer');
    let linksHTML = '';

    if (post.links && post.links.length > 0) {
        linksHTML = post.links.map((link, idx) => `
            <div style="margin-bottom: 12px;">
                <button class="modal-link" onclick="triggerAdGate('${link.url}', 'link-btn-${idx}')" id="link-btn-${idx}">
                    🔗 ${link.name}
                </button>
            </div>
        `).join('');
    }

    // إضافة زر الحذف في أسفل المقال
    linksHTML += `
        <div style="margin-top: 25px; border-top: 1px solid var(--border); padding-top: 15px; text-align: center;">
            <button onclick="deletePost(${post.id})" style="background:#ef4444; color:#fff; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.9rem; transition: background 0.2s;">
                🗑️ حذف هذا المقال
            </button>
        </div>
    `;

    linksContainer.innerHTML = linksHTML;
    document.getElementById('articleModal').style.display = 'flex';
}

function closeModal(event) {
    if (!event || event.target.id === 'articleModal' || event.target.className === 'close-btn') {
        document.getElementById('articleModal').style.display = 'none';
    }
}

// دالة حذف المقال
function deletePost(id) {
    if (confirm("هل أنت تأكد من رغبتك في حذف هذا المقال نهائياً؟")) {
        allPosts = allPosts.filter(p => p.id !== id);
        localStorage.setItem('my_website_posts', JSON.stringify(allPosts));
        closeModal();
        renderPosts(allPosts);
    }
}

// نظام قفل الإعلانات والتوجيه
function triggerAdGate(targetUrl, buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn.classList.contains('ready')) {
        window.open(targetUrl, '_blank');
        return;
    }

    // فتح الإعلان المباشر
    window.open("https://pl31360088.profitableratecpmnetwork.com/3c/46/68/3c4668b6dff417330e2a129729c101f0.js", "_blank");

    // بدء العداد التنازلي
    let timeLeft = 10;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    const timer = setInterval(() => {
        btn.innerText = `⏳ جاري تجهيز الرابط... انتظر (${timeLeft}) ثوانٍ`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.classList.add('ready');
            btn.style.background = "#22c55e";
            btn.style.color = "#ffffff";
            btn.innerText = "🚀 رابطك جاهز! اضغط هنا للانتقال الآن";
        }
    }, 1000);
}

function filterPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
    renderPosts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    renderPosts(allPosts);
});
