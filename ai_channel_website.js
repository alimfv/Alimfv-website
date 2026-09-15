const BIN_ID = "6aa96340ac6210605ad0ecc2"; 
const API_KEY = "$2a$10$q3hqusJObfe1Ofk6eOk.g.DadnEjpiQCiSUPWmB/jsT0kkprqVzau";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let globalPosts = [];
let countdownInterval = null;

// دالة إصلاح الروابط تلقائياً وإضافة https:// إذا كانت مفقودة
function fixUrl(url) {
    if (!url) return '';
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        return 'https://' + url;
    }
    return url;
}

async function fetchPosts() {
    try {
        let response = await fetch(API_URL, { headers: { 'X-Master-Key': API_KEY } });
        let data = await response.json();
        return data.record.posts || [];
    } catch (error) { return []; }
}

async function savePostsToCloud(posts) {
    let response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify({ posts: posts })
    });
    return response.ok;
}

async function loadIndexPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    container.innerHTML = '<p style="color: #94a3b8;">جاري الاتصال بالسحاب...</p>';
    globalPosts = await fetchPosts();
    renderPosts(globalPosts);
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8;">لا توجد مقالات حالياً.</p>';
        return;
    }

    posts.forEach((post, index) => {
        let categoryHtml = post.category ? `<span class="card-badge">${post.category}</span>` : '';
        let imageHtml = post.image ? `<img src="${fixUrl(post.image)}" class="card-img" alt="صورة">` : '';
        let snippet = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
        
        container.innerHTML += `
            <div class="card" onclick="openModal(${index})">
                ${imageHtml}
                ${categoryHtml}
                <h3>${post.title}</h3>
                <p>${snippet}</p>
                <span class="read-more">قراءة المقال كاملاً ←</span>
            </div>
        `;
    });
}

function openModal(index) {
    const post = globalPosts[index];
    if (!post) return;

    if (countdownInterval) clearInterval(countdownInterval);

    document.getElementById('modalCategory').innerText = post.category || 'عام';
    document.getElementById('modalTitle').innerText = post.title;
    document.getElementById('modalContent').innerText = post.content;

    const imgElem = document.getElementById('modalImage');
    if (post.image) {
        imgElem.src = fixUrl(post.image);
        imgElem.style.display = 'block';
    } else {
        imgElem.style.display = 'none';
    }

    const linkContainer = document.getElementById('modalLinkContainer');
    if (post.link && post.link.trim() !== '') {
        const safeUrl = fixUrl(post.link);
        linkContainer.innerHTML = `
            <button id="goLinkBtn" class="modal-link" onclick="startLinkTimer('${safeUrl}')">
                زيارة الرابط / الأداة 🔗
            </button>
            <div id="timerStatus" style="margin-top:10px; font-size:0.9rem; font-weight:bold; color:#38bdf8;"></div>
        `;
    } else {
        linkContainer.innerHTML = '';
    }

    document.getElementById('articleModal').style.display = 'flex';
}

// دالة عداد الـ 10 ثواني
function startLinkTimer(targetUrl) {
    const btn = document.getElementById('goLinkBtn');
    const status = document.getElementById('timerStatus');
    if (!btn) return;

    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed";

    let timeLeft = 10;
    btn.innerText = `⏳ انتظر (${timeLeft}) ثوانٍ...`;
    status.innerText = "جاري تجهيز الرابط المباشر...";

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            btn.innerText = `⏳ انتظر (${timeLeft}) ثوانٍ...`;
        } else {
            clearInterval(countdownInterval);
            btn.innerText = `🚀 جاري التوجيه الآن...`;
            status.innerText = "تم إكمال العد التنازلي!";
            window.open(targetUrl, '_blank');

            setTimeout(() => {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.innerText = "زيارة الرابط / الأداة 🔗";
                status.innerText = "";
            }, 3000);
        }
    }, 1000);
}

function closeModal(e) {
    if (countdownInterval) clearInterval(countdownInterval);
    document.getElementById('articleModal').style.display = 'none';
}

function filterPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = globalPosts.filter(p => 
        (p.title && p.title.toLowerCase().includes(query)) || 
        (p.content && p.content.toLowerCase().includes(query))
    );
    renderPosts(filtered);
}

async function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const image = document.getElementById('postImage').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const link = document.getElementById('postLink').value.trim();
    const statusMsg = document.getElementById('statusMsg');
    
    if (!title || !content) {
        alert("الرجاء كتابة العنوان والمحتوى!");
        return;
    }

    statusMsg.style.color = "#38bdf8";
    statusMsg.innerText = "⏳ جاري الإرسال إلى السحاب...";

    let posts = await fetchPosts();
    posts.unshift({ title, category, image, content, link, date: new Date().toLocaleDateString('ar-EG') });
    
    let success = await savePostsToCloud(posts);
    
    if (success) {
        statusMsg.style.color = "#4ade80";
        statusMsg.innerText = "✅ تم النشر بنجاح وظهرت في الموقع للجميع!";
        document.getElementById('postTitle').value = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postLink').value = '';
        loadAdminPosts();
    } else {
        statusMsg.style.color = "#ef4444";
        statusMsg.innerText = "❌ حدث خطأ أثناء الحفظ بالسحاب!";
    }
}

async function loadAdminPosts() {
    const list = document.getElementById('adminPostsList');
    if (!list) return;
    
    list.innerHTML = 'جاري التحميل...';
    const posts = await fetchPosts();
    list.innerHTML = '';
    
    if (posts.length === 0) {
        list.innerHTML = '<p style="color: #94a3b8;">لا توجد عناصر منشورة.</p>';
        return;
    }

    posts.forEach((post, index) => {
        list.innerHTML += `
            <div class="item-row">
                <span><strong>${post.title}</strong> (${post.category || 'عام'})</span>
                <button class="del-btn" onclick="deletePost(${index})">حذف</button>
            </div>
        `;
    });
}

async function deletePost(index) {
    if (!confirm("هل أنت تأكد من الحذف؟")) return;
    let posts = await fetchPosts();
    posts.splice(index, 1);
    await savePostsToCloud(posts);
    loadAdminPosts();
}

window.onload = () => {
    if (document.getElementById('postsContainer')) loadIndexPosts();
    if (document.getElementById('adminPostsList')) loadAdminPosts();
};
