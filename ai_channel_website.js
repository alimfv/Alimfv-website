// قراءة البيانات المضافة من لوحة التحكم + مقال افتراضي أول
const defaultPosts = [
    {
        id: 1,
        title: "أداة مذهلة لصنع قصص المانجا والأنمي بالذكاء الاصطناعي مجاناً",
        category: "أدوات ذكاء اصطناعي",
        image: "",
        content: "إذا كانت لديك فكرة لقصة مانجا وتريد تحويلها إلى مشاهد مصورة دون الحاجة للتفكير في تفاصيل كتابة أوامر الرسم، فهذه الأداة هي الحل الأسرع لك!\n\nتعمل الأداة كمساعد سيناريو ومخرج فني؛ حيث تبدأ بوضع فكرة القصة البسيطة، لتقوم الأداة بتطوير الأحداث، تقسيم المشاهد، وتوليد أوامر رسم (Prompts) جاهزة ومخصصة لإنشاء صفحات المانجا.",
        links: [
            { name: "رابط أداة توليد القصص والبرومبتات", url: "https://example.com/tool" },
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

    // تجهيز قائمة الروابط متعددة الأزرار
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

// ميزة قفل الإعلانات (Ad Gate): فتح إعلان Adsterra المباشر ثم تفعيل العداد التنازلي
function triggerAdGate(targetUrl, buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn.classList.contains('ready')) {
        window.open(targetUrl, '_blank');
        return;
    }

    // 1. فتح إعلان Adsterra المباشر في نافذة جديدة (استبدل هذا الرابط برابط Direct Link الخاص بك في Adsterra إذا توفر لديك)
    window.open("https://pl31360088.profitableratecpmnetwork.com/3c/46/68/3c4668b6dff417330e2a129729c101f0.js", "_blank");

    // 2. العداد التنازلي في الصفحة (10 ثوانٍ)
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
            btn.style.background = "#22c55e"; // تغيير اللون إلى الأخضر
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
