const BIN_ID = "6aa96340ac6210605ad0ecc2"; 
const API_KEY = "$2a$10$q3hqusJObfe1Ofk6eOk.g.DadnEjpiQCiSUPWmB/jsT0kkprqVzau";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let globalPosts = [];

// جلب البيانات من السحاب
async function fetchPosts() {
    try {
        let response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        let data = await response.json();
        return data.record.posts || [];
    } catch (error) {
        console.error("خطأ في الجلب:", error);
        return [];
    }
}

// حفظ البيانات في السحاب
async function savePostsToCloud(posts) {
    let response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ posts: posts })
    });
    return response.ok;
}

// عرض المقالات في الصفحة الرئيسية
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

    posts.forEach((post) => {
        let linkHtml = post.link ? `<br><br><a href="${post.link}" target="_blank">زيارة الرابط / الأداة 🔗</a>` : '';
        let categoryHtml = post.category ? `<span class="card-badge">${post.category}</span>` : '';
        
        container.innerHTML += `
            <div class="card">
                ${categoryHtml}
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                ${linkHtml}
            </div>
        `;
    });
}

// تصفية البحث
function filterPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = globalPosts.filter(p => 
        (p.title && p.title.toLowerCase().includes(query)) || 
        (p.content && p.content.toLowerCase().includes(query))
    );
    renderPosts(filtered);
}

// نشر مقال جديد
async function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
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
    posts.unshift({ title, category, content, link, date: new Date().toLocaleDateString('ar-EG') });
    
    let success = await savePostsToCloud(posts);
    
    if (success) {
        statusMsg.style.color = "#4ade80";
        statusMsg.innerText = "✅ تم النشر بنجاح وظهرت في الموقع للجميع!";
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postLink').value = '';
        loadAdminPosts();
    } else {
        statusMsg.style.color = "#ef4444";
        statusMsg.innerText = "❌ حدث خطأ أثناء الحفظ بالسحاب!";
    }
}

// عرض المقالات في لوحة التحكم
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

// تشغيل عند التحميل
window.onload = () => {
    if (document.getElementById('postsContainer')) loadIndexPosts();
    if (document.getElementById('adminPostsList')) loadAdminPosts();
};
