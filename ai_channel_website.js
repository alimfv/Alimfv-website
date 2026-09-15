const STORAGE_KEY = 'site_posts_data';

function getPosts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (!title || !content) {
        alert('يرجى ملء جميع الحقول!');
        return;
    }

    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    posts.unshift(newPost);
    savePosts(posts);

    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';

    alert('تم النشر بنجاح!');
    renderAdminPosts();
}

function deletePost(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== id);
        savePosts(posts);
        renderAdminPosts();
    }
}

function renderAdminPosts() {
    const container = document.getElementById('adminPostsContainer');
    if (!container) return;

    const posts = getPosts();
    if (posts.length === 0) {
        container.innerHTML = '<p style="color: var(--text-sub); text-align:center; padding: 20px;">لا توجد مقالات منشورة بعد.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-item" style="background:#0b0f19; border:1px solid #334155; padding:15px; border-radius:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h4 style="color:#f8fafc; font-size:1rem; margin-bottom:4px;">${escapeHtml(post.title)}</h4>
                <span style="color:#94a3b8; font-size:0.75rem;">${post.date}</span>
            </div>
            <button class="btn-delete" onclick="deletePost(${post.id})" style="background:#ef4444; color:white; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:bold;">حذف</button>
        </div>
    `).join('');
}

// عرض المقالات في الموقع مع تفعيل البحث
function renderPublicPosts(filterText = '') {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    let posts = getPosts();

    // فلترة المقالات حسب نص البحث
    if (filterText.trim() !== '') {
        const query = filterText.toLowerCase();
        posts = posts.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
    }

    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">لا توجد مقالات مطابقة للبحث أو منشورة حالياً.</div>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <div>
                <h3>${escapeHtml(post.title)}</h3>
                <div class="date">${post.date}</div>
                <p>${escapeHtml(post.content)}</p>
            </div>
            <button class="btn-read" onclick="openModal(${post.id})">اقرأ المزيد ودخول المقال</button>
        </div>
    `).join('');
}

// دالة البحث التلقائي عند الكتابة
function filterPosts() {
    const query = document.getElementById('searchInput').value;
    renderPublicPosts(query);
}

function openModal(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);

    if (post) {
        document.getElementById('modalTitle').innerText = post.title;
        document.getElementById('modalDate').innerText = post.date;
        document.getElementById('modalBody').innerText = post.content;
        document.getElementById('articleModal').classList.add('active');
    }
}

function closeModal() {
    document.getElementById('articleModal').classList.remove('active');
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
