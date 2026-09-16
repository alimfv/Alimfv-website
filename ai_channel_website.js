const defaultPosts = [
    {
        id: 1,
        title: "أداة ذكاء اصطناعي لبناء قصص المانجا وتوليد برومبتات المشاهد",
        category: "أدوات ذكاء اصطناعي",
        image: "",
        content: `إذا كانت لديك فكرة لقصة مانجا وتريد تحويلها إلى مشاهد مصورة دون الحاجة للتفكير في تفاصيل كتابة أوامر الرسم، فهذه الأداة هي الحل الأسرع لك!

تعمل الأداة كمساعد سيناريو ومخرج فني؛ حيث تبدأ بوضع فكرة القصة البسيطة، لتقوم الأداة بتطوير الأحداث، تقسيم المشاهد، وتوليد أوامر رسم (Prompts) جاهزة ومخصصة لإنشاء صفحات المانجا.

طريقة عمل الأداة:
• تطوير القصة: تحويل فكرتك البسيطة إلى أحداث متسلسلة وحوارات مشوقة.
• توليد برومبتات الصور (Prompts): استخراج أوامر وصفية دقيقة باللغة الإنجليزية لتوليد صور مانجا متناسقة عبر أدوات توليد الصور (مثل Midjourney أو Leonardo AI).
• ضبط تفاصيل المشهد: تحديد زوايا الكاميرا، وضعيات الشخصيات، وتعابير الوجه داخل كل برومبت لضمان الجودة.

خطوات الاستخدام:
1. اكتب فكرة قصتك داخل الأداة.
2. احصل على السيناريو كاملاً مقسماً إلى مشاهد مع البرومبت الخاص بكل صورة.
3. انسخ البرومبت واستخدمه في مولد الصور للحصول على صفحات مانجا احترافية جاهزة للنشر!`,
        link: "https://google.com"
    }
];

let allPosts = JSON.parse(localStorage.getItem('my_website_posts')) || defaultPosts;

function renderPosts(postsToRender) {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    if (!postsToRender || postsToRender.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:var(--text-sub);">
                <p style="font-size:1.2rem; margin-bottom:10px;">📭 لا توجد مقالات حالياً</p>
            </div>
        `;
        return;
    }

    container.innerHTML = postsToRender.map(post => `
        <div class="card" onclick="openModal(${post.id})">
            <span class="card-badge">${post.category || 'أدوات'}</span>
            ${post.image ? `<img src="${post.image}" class="card-img" alt="${post.title}">` : ''}
            <h3>${post.title}</h3>
            <p>${post.content ? post.content.substring(0, 100) : ''}...</p>
        </div>
    `).join('');
}

function openModal(id) {
    const post = allPosts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('modalCategory').innerText = post.category || 'أدوات';
    document.getElementById('modalTitle').innerText = post.title;
    
    const imgElement = document.getElementById('modalImage');
    if (imgElement) {
        if (post.image) {
            imgElement.src = post.image;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }
    }

    document.getElementById('modalContent').innerText = post.content || '';

    const linksContainer = document.getElementById('modalLinkContainer');
    if (linksContainer) {
        const targetLink = post.link || "#";
        linksContainer.innerHTML = `
            <div style="margin-top: 25px; text-align: center;">
                <a href="${targetLink}" target="_blank" style="display:block; width:100%; text-decoration:none; padding: 14px 0; background: #2563eb; color: #ffffff; border-radius: 10px; font-weight: bold; font-size: 1.05rem; box-shadow: 0 4px 12px rgba(37,99,235,0.3); box-sizing: border-box;">
                    🚀 الذهاب إلى الأداة الآن
                </a>
            </div>
        `;
    }

    const modal = document.getElementById('articleModal');
    if (modal) modal.style.display = 'flex';
}

function closeModal(event) {
    if (!event || event.target.id === 'articleModal' || event.target.className === 'close-btn') {
        const modal = document.getElementById('articleModal');
        if (modal) modal.style.display = 'none';
    }
}

function filterPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
    renderPosts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    renderPosts(allPosts);
});
