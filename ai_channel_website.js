// --- إعدادات السحاب (JSONBin) ---
const BIN_ID = "6aa96340ac6210605ad0ecc2"; 
const API_KEY = "$2a$10$q3hqusJObfe1Ofk6eOk.g.DadnEjpiQCiSUPWmB/jsT0kkprqVzau";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// جلب المقالات من السحاب
async function fetchPosts() {
    try {
        let response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        let data = await response.json();
        return data.record.posts || [];
    } catch (error) {
        console.error("خطأ في جلب المقالات:", error);
        return [];
    }
}

// حفظ المقالات في السحاب
async function savePostsToCloud(posts) {
    try {
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ posts: posts })
        });
    } catch (error) {
        console.error("خطأ في حفظ المقالات:", error);
    }
}

// عرض المقالات في الصفحة الرئيسية
async function loadIndexPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    container.innerHTML = '<p style="text-align:center;">جاري تحميل المقالات...</p>';
    const posts = await fetchPosts();
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = '<p style="text-align:center;">لا توجد مقالات حالياً.</p>';
        return;
    }

    posts.forEach((post, index) => {
        container.innerHTML += `
            <div class="card" onclick="openModal(${index})" style="border:1px solid #ccc; padding:15px; margin:10px 0; cursor:pointer;">
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
            </div>
        `;
    });
}

// نشر مقال جديد من لوحة التحكم
async function publishPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    if (!title || !content) {
        alert("الرجاء ملء جميع الحقول!");
        return;
    }

    alert("جاري النشر على السحاب...");
    let posts = await fetchPosts();
    posts.unshift({ title, content, date: new Date().toLocaleDateString('ar-EG') });
    
    await savePostsToCloud(posts);
    
    alert("تم النشر بنجاح! سيظهر المقال للجميع الآن.");
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    loadAdminPosts();
}

// إدارة وحذف المقالات في لوحة التحكم
async function loadAdminPosts() {
    const list = document.getElementById('adminPostsList');
    if (!list) return;
    
    list.innerHTML = 'جاري التحميل...';
    const posts = await fetchPosts();
    list.innerHTML = '';
    
    posts.forEach((post, index) => {
        list.innerHTML += `
            <div class="admin-post-item" style="display:flex; justify-content:space-between; margin:10px 0; background:#f4f4f4; padding:10px;">
                <span>${post.title}</span>
                <button onclick="deletePost(${index})" style="color:red;">حذف</button>
            </div>
        `;
    });
}

async function deletePost(index) {
    if (!confirm("هل أنت تأكد من حذف هذا المقال؟")) return;
    let posts = await fetchPosts();
    posts.splice(index, 1);
    await savePostsToCloud(posts);
    loadAdminPosts();
    alert("تم الحذف بنجاح!");
}

// التحقق من كلمة المرور للوحة التحكم
function loginAdmin() {
    const pass = document.getElementById('adminPassword').value;
    if (pass === "123") {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminPosts();
    } else {
        alert("كلمة المرور خطأ!");
    }
}

// نافذة عرض المقال الكامل
async function openModal(index) {
    const posts = await fetchPosts();
    const post = posts[index];
    if (!post) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('articleModal');

    if (modalTitle && modalBody && modal) {
        modalTitle.innerText = post.title;
        modalBody.innerText = post.content;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('articleModal');
    if (modal) modal.style.display = 'none';
}

// التشغيل التلقائي عند فتح الصفحة
window.onload = () => {
    if (document.getElementById('postsContainer')) {
        loadIndexPosts();
    }
};
