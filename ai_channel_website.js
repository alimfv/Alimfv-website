// المقال الكامل الافتراضي للمانجا مع الدعم الكامل للإعلانات والروابط
const defaultPosts = [
    {
        id: 1,
        title: "أداة مذهلة لصنع قصص المانجا والأنمي بالذكاء الاصطناعي مجاناً",
        category: "أدوات ذكاء اصطناعي",
        image: "",
        content: `إذا كانت لديك فكرة لقصة مانجا وتريد تحويلها إلى مشاهد مصورة دون الحاجة للتفكير في تفاصيل كتابة أوامر الرسم، فهذه الأداة هي الحل الأسرع لك!

تعمل الأداة كمساعد سيناريو ومخرج فني؛ حيث تبدأ بوضع فكرة القصة البسيطة، لتقوم الأداة بتطوير الأحداث، تقسيم المشاهد، وتوليد أوامر رسم (Prompts) جاهزة ومخصصة لإنشاء صفحات المانجا.

📌 طريقة عمل الأداة:
• تطوير القصة: تحويل فكرتك البسيطة إلى أحداث متسلسلة وحوارات مشوقة.
• توليد برومبتات الصور (Prompts): استخراج أوامر وصفية دقيقة باللغة الإنجليزية لتوليد صور مانجا متناسقة عبر أدوات توليد الصور (مثل Midjourney أو Leonardo AI).
• ضبط تفاصيل المشهد: تحديد زوايا الكاميرا، وضعيات الشخصيات، وتعابير الوجه داخل كل برومبت لضمان الجودة.

📌 خطوات الاستخدام:
1. اكتب فكرة قصتك داخل الأداة.
2. احصل على السيناريو كاملاً مقسماً إلى مشاهد مع البرومبت الخاص بكل صورة.
3. انسخ البرومبت واستخدمه في مولد الصور للحصول على صفحات مانجا احترافية جاهزة للنشر!`,
        links: [
            { name: "رابط أداة توليد قصص المانجا والبرومبتات", url: "https://example.com/tool" },
            { name: "تحميل برومبتات المانجا الجاهزة", url: "https://example.com/prompts" }
        ]
    }
];

let allPosts = JSON.parse(localStorage.getItem('my_website_posts')) || defaultPosts;

function renderPosts(postsToRender) {
    const container = document.getElementById('postsContainer');
    if (!postsToRender || postsToRender.length === 0) {
        container.innerHTML = '<p style="color:var(--text-sub);">لا توجد مقالات حالياً.</p>';
        return;
    }

    container.innerHTML = postsToRender.map(post => `
        <div class="card" onclick="openModal(${post.id})">
            <span class="card-badge">${post.category}</span>
            ${post.image ? `<img src="${post.image}" class="card-img" alt="${post.title}">` : ''}
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 110)}...</p>
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

    const linksContainer = document.getElementById('modalLinkContainer');
    if (post.links && post.links.length > 0) {
        linksContainer.innerHTML = post.links.map((link, idx) => `
            <div style="margin-bottom: 12px;">
                <button class="modal-link" onclick="triggerAdGate('${link.url}', 'link-btn-${idx}')" id="link-btn-${idx}">
                    🔗 ${link.name}
                </button>
            </div>
        `).join('');
    } else {
        linksContainer.innerHTML = '';
    }

    document.getElementById('articleModal').style.display = 'flex';
}

function closeModal(event) {
    if (!event || event.target.id === 'articleModal' || event.target.className === 'close-btn') {
        document.getElementById('articleModal').style.display = 'none';
    }
}

// نظام قفل الإعلانات والتوجيه
function triggerAdGate(targetUrl, buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn.classList.contains('ready')) {
        window.open(targetUrl, '_blank');
        return;
    }

    // فتح الإعلان في نافذة جديدة
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
