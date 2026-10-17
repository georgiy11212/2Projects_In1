// ==================== УПРАВЛІННЯ ПОРТАЛОМ ТА LOCALSTORAGE ====================

let activeTab = 'brawl';
let isMinimized = false;

window.addEventListener('DOMContentLoaded', () => {
    loadBrawlState();
    loadYtState();

    renderProducts();
    initWheel();
    updateBalanceUI();

    init();
});

function switchPortalTab(tab) {
    if (isMinimized) toggleMinimize();
    activeTab = tab;

    document.getElementById('closedStateView').classList.add('hidden');
    document.getElementById('mainPortalContent').classList.remove('hidden');

    const btnBrawl = document.getElementById('btn-tab-brawl');
    const btnYt = document.getElementById('btn-tab-yt');

    if (tab === 'brawl') {
        btnBrawl.className = "px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]";
        btnYt.className = "px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 text-gray-400 hover:text-white";
    } else {
        btnYt.className = "px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]";
        btnBrawl.className = "px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 text-gray-400 hover:text-white";
    }

    document.getElementById('site-brawl').classList.toggle('active', tab === 'brawl');
    document.getElementById('site-yt').classList.toggle('active', tab === 'yt');
}

function toggleMinimize() {
    isMinimized = !isMinimized;
    const mainContent = document.getElementById('mainPortalContent');
    const minBar = document.getElementById('minimizedBar');
    const closedView = document.getElementById('closedStateView');

    if (isMinimized) {
        mainContent.classList.add('hidden');
        closedView.classList.add('hidden');
        minBar.classList.remove('hidden');
        document.getElementById('minimizedLabel').innerHTML = `<i class="fa-solid fa-window-restore"></i> Згорнуто: ${activeTab === 'brawl' ? 'Brawl Store 2.0' : 'YouTube Tycoon'}`;
    } else {
        mainContent.classList.remove('hidden');
        minBar.classList.add('hidden');
    }
}

function closeCurrentSite() {
    document.getElementById('mainPortalContent').classList.add('hidden');
    document.getElementById('closedStateView').classList.remove('hidden');
}

function openSite(tab) {
    switchPortalTab(tab);
}

function resetCurrentProgress() {
    if (confirm(`Повністю скинути весь прогрес для ${activeTab === 'brawl' ? 'Brawl Store 2.0' : 'YouTube Tycoon'}?`)) {
        if (activeTab === 'brawl') {
            localStorage.removeItem('brawl_store_data');
        } else {
            localStorage.removeItem('yt_tycoon_data');
        }
        location.reload();
    }
}

function openTutorial(site) {
    const modal = document.getElementById('tutorialModal');
    const title = document.getElementById('tutTitle');
    const content = document.getElementById('tutContent');

    if (site === 'brawl') {
        title.innerHTML = `<i class="fa-solid fa-gamepad text-cyan-400"></i> Як автор створював Brawl Store 2.0`;
        content.innerHTML = `
            <p><b>1. Структура (HTML):</b> Автор використав семантичні теги шапки, банерів, сітки продуктів та модальних вікон.</p>
            <p><b>2. Дизайн та Неон (CSS):</b> Кастомні змінні <code>--accent</code>, анімації переливання фону та світлові ефекти карток.</p>
            <p><b>3. Звуковий двигун (Web Audio API):</b> Генерація синтезованих звуків та ретро-музики через браузерний аудіоконтекст без сторонніх файлів.</p>
            <p><b>4. Логіка:</b> Написано системи кошика, колеса фортуни та відкриття боксів з рандомним випадінням винагород.</p>
        `;
    } else {
        title.innerHTML = `<i class="fa-brands fa-youtube text-red-500"></i> Як автор створював YouTube Studio Tycoon`;
        content.innerHTML = `
            <p><b>1. Інтерфейс (Tailwind CSS):</b> Сучасна темна студія з адаптивною сіткою.</p>
            <p><b>2. Ігровий цикл (JS Interval):</b> Щосекундний тік таймера, який автоматично додає підписники, долари та ютуберки.</p>
            <p><b>3. Система досягнень:</b> Автоматична перевірка порогів кількості підписників для розблокування срібної, золотої та інших кнопок YouTube.</p>
            <p><b>4. Магазин і Акції:</b> Покупка бустів скорочення таймера та супер-акцій для прискорення гри в 10 разів.</p>
        `;
    }
    modal.classList.add('open');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}

function closeTutorial() {
    const modal = document.getElementById('tutorialModal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
}


// ==================== BRAWL STORE 2.0 ЛОГІКА ====================

let userUAH = 0, userGems = 0, userPasses = 0;
let rewardMultiplier = 1.0, priceDiscountMultiplier = 1.0;
let currentLang = 'ua', musicEnabled = true, sfxEnabled = true, isLightMode = false;
let cart = [], isCustomizerUnlocked = false, isSettingsUnlocked = false, isUltraNeonUnlocked = false, isSuperPremiumUnlocked = false, isUltrametaUnlocked = false;

function saveBrawlState() {
    localStorage.setItem('brawl_store_data', JSON.stringify({
        userUAH, userGems, userPasses, rewardMultiplier, priceDiscountMultiplier,
        isCustomizerUnlocked, isSettingsUnlocked, isUltraNeonUnlocked, isSuperPremiumUnlocked, isUltrametaUnlocked
    }));
}

function loadBrawlState() {
    const data = localStorage.getItem('brawl_store_data');
    if (data) {
        try {
            const p = JSON.parse(data);
            userUAH = p.userUAH || 0;
            userGems = p.userGems || 0;
            userPasses = p.userPasses || 0;
            rewardMultiplier = p.rewardMultiplier || 1.0;
            priceDiscountMultiplier = p.priceDiscountMultiplier || 1.0;
            isCustomizerUnlocked = p.isCustomizerUnlocked || false;
            isSettingsUnlocked = p.isSettingsUnlocked || false;
            isUltraNeonUnlocked = p.isUltraNeonUnlocked || false;
            isSuperPremiumUnlocked = p.isSuperPremiumUnlocked || false;
            isUltrametaUnlocked = p.isUltrametaUnlocked || false;

            if (isCustomizerUnlocked) {
                const pb = document.getElementById('promo-banner');
                if (pb) pb.style.display = 'none';
                document.getElementById('customizer-panel').classList.remove('hidden');
                document.getElementById('promo-banner-200k').classList.remove('hidden');
            }
            if (isUltraNeonUnlocked) {
                const pb200 = document.getElementById('promo-banner-200k');
                if (pb200) pb200.style.display = 'none';
                document.querySelectorAll('.ultraneon-btn').forEach(b => b.classList.remove('hidden'));
                document.getElementById('promo-banner-500k').classList.remove('hidden');
            }
            if (isSuperPremiumUnlocked) {
                const pb500 = document.getElementById('promo-banner-500k');
                if (pb500) pb500.style.display = 'none';
                document.querySelectorAll('.super-btn').forEach(b => b.classList.remove('hidden'));
                document.getElementById('promo-banner-1m').classList.remove('hidden');
            }
            if (isUltrametaUnlocked) {
                const pb1m = document.getElementById('promo-banner-1m');
                if (pb1m) pb1m.style.display = 'none';
                document.querySelectorAll('.mega-btn').forEach(b => b.classList.remove('hidden'));
            }
            if (isSettingsUnlocked) {
                document.getElementById('settings-panel').classList.remove('hidden');
            }
        } catch(e) {}
    }
}

const translations = {
    ua: { title: "Cyber Store", settingsTitle: "Ігрові Налаштування", settingsDesc: "Керуйте мовою, звуками та темою:", langLabel: "Мова", musicLabel: "Музика", sfxLabel: "Звуки", themeModeLabel: "Тема", on: "Увімк", off: "Вимк", dark: "Темна", light: "Світла", tabGems: "Геми", tabOffers: "Акції", tabMerch: "Мерч", tabWheel: "Колесо Фортуни", wheelTitle: "Колесо Фортуни", wheelDesc: "Крути та вигравай гривні або пропуски!", spinBtn: "Крутити!", cartTitle: "Кошик", emptyCart: "Кошик порожній 🛒", totalLabel: "Разом:", checkoutStd: "Оплатити", checkoutPass: "За Пропуски 🎫", boxModalTitle: "🎁 Мега Ящики", claimRewards: "Забрати" },
    en: { title: "Cyber Store", settingsTitle: "Game Settings", settingsDesc: "Manage language and sound:", langLabel: "Language", musicLabel: "Music", sfxLabel: "SFX", themeModeLabel: "Theme", on: "On", off: "Off", dark: "Dark", light: "Light", tabGems: "Gems", tabOffers: "Offers", tabMerch: "Merch", tabWheel: "Wheel", wheelTitle: "Fortune Wheel", wheelDesc: "Spin and win!", spinBtn: "Spin!", cartTitle: "Cart", emptyCart: "Cart is empty 🛒", totalLabel: "Total:", checkoutStd: "Checkout", checkoutPass: "Buy with Passes", boxModalTitle: "🎁 Mega Box", claimRewards: "Claim" }
};

let audioCtx = null;
let musicInterval = null;

function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }

function playSound(freq, duration, type = 'sine') {
    if (!sfxEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function startCyberMusic() {
    if (!musicEnabled) return;
    stopCyberMusic();
    initAudio();
    const notes = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00];
    musicInterval = setInterval(() => {
        if (!musicEnabled) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            const note = notes[Math.floor(Math.random() * notes.length)];
            osc.frequency.setValueAtTime(note, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.6);
        } catch(e) {}
    }, 800);
}

function stopCyberMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

const storeData = {
    gems: [
        { id: 'g1', name: '30 Гемів', desc: 'Маленький набір для швидкого старту', priceValue: 49, passCost: 1, gemsReward: 30, icon: 'fa-gem' },
        { id: 'g2', name: '80 Гемів', desc: 'Популярний вибір покупців', priceValue: 129, passCost: 2, gemsReward: 80, icon: 'fa-gem' },
        { id: 'g3', name: '170 Гемів', desc: 'Вигідний набір зі знижкою 10%', priceValue: 249, passCost: 3, gemsReward: 170, icon: 'fa-gem' },
        { id: 'g4', name: '360 Гемів', desc: 'Пакет для справжніх бійців', priceValue: 499, passCost: 5, gemsReward: 360, icon: 'fa-gem' },
        { id: 'g5', name: '950 Гемів', desc: 'Мега набір гемових заощаджень', priceValue: 999, passCost: 10, gemsReward: 950, icon: 'fa-gem' },
        { id: 'g6', name: '2,000 Гемів', desc: 'Ексклюзивний ультра-набір', priceValue: 1999, passCost: 20, gemsReward: 2000, icon: 'fa-gem' },
        { id: 'g7', name: '5,000 Гемів', desc: 'Величезний запас гемів', priceValue: 3499, passCost: 35, gemsReward: 5000, icon: 'fa-gem' },
        { id: 'g8', name: '10,000 Гемів', desc: 'Гранд-пакет для колекціонерів', priceValue: 5999, passCost: 60, gemsReward: 10000, icon: 'fa-gem' },
        { id: 'g9', name: '20,000 Гемів', desc: 'Елітний запас для топ-покупок', priceValue: 10999, passCost: 110, gemsReward: 20000, icon: 'fa-gem' },
        { id: 'g10', name: '50,000 Гемів', desc: 'Космічний скарб для домінування', priceValue: 24999, passCost: 250, gemsReward: 50000, icon: 'fa-gem' }
    ],
    offers: [
        { id: 'o1', name: 'Мега Ящик х3', desc: 'Реальне відкриття 3 ящиків з унікальним дропом гривень та гемів!', priceValue: 80, passCost: 2, isGemPrice: true, isBoxOffer: true, icon: 'fa-box-open' },
        { id: 'o2', name: 'Преміум Бонус', desc: 'Подвійний досвід та нагороди на 7 днів', priceValue: 50, passCost: 1, isGemPrice: true, isBonusOffer: true, icon: 'fa-star' },
        { id: 'o3', name: 'Титульний Набір', desc: 'Ексклюзивна анімація профілю та значки', priceValue: 120, passCost: 3, isGemPrice: true, isTitleOffer: true, icon: 'fa-shield-halved' },
        { id: 'o_settings', name: 'Панель Налаштувань', desc: 'Розблоковує зміну мови, музику, звукові ефекти та теми!', priceValue: 75000, passCost: 999999, isGemPrice: true, isSettingsOffer: true, icon: 'fa-sliders' }
    ],
    merch: [
        { id: 'm1', name: 'Худі Brawl Star', desc: 'Тепле фірмове худі з принтом логотипу', priceValue: 450, passCost: 10, isGemPrice: true, icon: 'fa-shirt' },
        { id: 'm2', name: 'Кепка Spike', desc: 'Стильна кепка із зображенням Спайка', priceValue: 150, passCost: 4, isGemPrice: true, icon: 'fa-hat-cowboy' },
        { id: 'm3', name: 'Рюкзак Школяра', desc: 'Міцний міський рюкзак з кишенею', priceValue: 600, passCost: 15, isGemPrice: true, icon: 'fa-backpack' }
    ]
};

function updateBalanceUI() {
    const elUah = document.getElementById('user-uah');
    const elGems = document.getElementById('user-gems');
    const elPasses = document.getElementById('user-passes');
    if (elUah) elUah.textContent = userUAH.toLocaleString();
    if (elGems) elGems.textContent = userGems.toLocaleString();
    if (elPasses) elPasses.textContent = userPasses.toLocaleString();
    saveBrawlState();
}

function buyExclusiveOffer() {
    if (userGems < 100000) { playSound(150, 0.3, 'sawtooth'); return alert("Недостатньо гемів! Потрібно 100,000 💎"); }
    userGems -= 100000;
    playSound(600, 0.4, 'sine');
    isCustomizerUnlocked = true;
    document.getElementById('promo-banner').style.display = 'none';
    document.getElementById('customizer-panel').classList.remove('hidden');
    document.getElementById('promo-banner-200k').classList.remove('hidden');
    updateBalanceUI();
    alert("Легендарний кастомізатор активовано! 🎉");
}

function buyUltraNeonOffer() {
    if (userGems < 200000) { playSound(150, 0.3, 'sawtooth'); return alert("Недостатньо гемів! Потрібно 200,000 💎"); }
    userGems -= 200000;
    playSound(650, 0.4, 'sine');
    isUltraNeonUnlocked = true;
    document.getElementById('promo-banner-200k').style.display = 'none';
    document.querySelectorAll('.ultraneon-btn').forEach(b => b.classList.remove('hidden'));
    document.getElementById('promo-banner-500k').classList.remove('hidden');
    updateBalanceUI();
    alert("Супер Ультра Неоновий Інтерфейс придбано! 🔥");
}

function buySuperPremiumOffer() {
    if (userGems < 500000) { playSound(150, 0.3, 'sawtooth'); return alert("Недостатньо гемів! Потрібно 500,000 💎"); }
    userGems -= 500000;
    playSound(700, 0.4, 'sine');
    isSuperPremiumUnlocked = true;
    document.getElementById('promo-banner-500k').style.display = 'none';
    document.querySelectorAll('.super-btn').forEach(b => b.classList.remove('hidden'));
    document.getElementById('promo-banner-1m').classList.remove('hidden');
    updateBalanceUI();
    alert("Супер Преміум Переливання придбано! 🌟");
}

function buyUltrametaOffer() {
    if (userGems < 1000000) { playSound(150, 0.3, 'sawtooth'); return alert("Недостатньо гемів! Потрібно 1,000,000 💎"); }
    userGems -= 1000000;
    playSound(800, 0.5, 'sine');
    isUltrametaUnlocked = true;
    priceDiscountMultiplier = 0.95;
    rewardMultiplier = 1.10;
    document.getElementById('promo-banner-1m').style.display = 'none';
    document.querySelectorAll('.mega-btn').forEach(b => b.classList.remove('hidden'));

    for (const cat in storeData) {
        storeData[cat].forEach(item => {
            item.priceValue = Math.floor(item.priceValue * priceDiscountMultiplier);
        });
    }
    renderProducts();
    updateBalanceUI();
    alert("👑🔥 УЛЬТРА МЕГА АПОКАЛІПСИС АКТИВОВАНО!");
}

function setLanguage(lang) {
    playSound(400, 0.1);
    currentLang = lang;
    document.getElementById('lang-ua')?.classList.toggle('active', lang === 'ua');
    document.getElementById('lang-en')?.classList.toggle('active', lang === 'en');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function toggleMusic(status) {
    playSound(400, 0.1);
    musicEnabled = status;
    document.getElementById('music-on')?.classList.toggle('active', status);
    document.getElementById('music-off')?.classList.toggle('active', !status);
    if (status) startCyberMusic(); else stopCyberMusic();
}

function toggleSFX(status) {
    sfxEnabled = status;
    playSound(500, 0.1);
    document.getElementById('sfx-on')?.classList.toggle('active', status);
    document.getElementById('sfx-off')?.classList.toggle('active', !status);
}

function setLightDark(mode) {
    playSound(450, 0.1);
    isLightMode = (mode === 'light');
    document.getElementById('mode-dark')?.classList.toggle('active', mode === 'dark');
    document.getElementById('mode-light')?.classList.toggle('active', mode === 'light');

    if (isLightMode) document.body.classList.add('theme-light');
    else document.body.classList.remove('theme-light');
}

function setTheme(name) {
    if (!isCustomizerUnlocked) return;
    playSound(500, 0.1);
    const lightClass = isLightMode ? 'theme-light' : '';
    document.body.className = lightClass;

    if (name === 'gold') document.body.classList.add('theme-gold');
    else if (name === 'matrix') document.body.classList.add('theme-matrix');
    else if (name.startsWith('ultraneon')) document.body.classList.add('theme-' + name);
    else if (name.startsWith('ultragold') || name.startsWith('ultrarainbow') || name.startsWith('ultramatrix')) document.body.classList.add('theme-' + name);
    else if (name.startsWith('ultrameon')) document.body.classList.add('theme-' + name);
}

const wheelPrizes = [
    { text: "200 ₴", type: "uah", val: 200, color: "#121824" },
    { text: "20 ₴", type: "uah", val: 20, color: "#1a2233" },
    { text: "500 ₴", type: "uah", val: 500, color: "#121824" },
    { text: "100 🎫", type: "pass", val: 100, color: "#4d0b2b" },
    { text: "0 ₴", type: "uah", val: 0, color: "#1a2233" },
    { text: "1 🎫", type: "pass", val: 1, color: "#2b0b4d" },
    { text: "100 ₴", type: "uah", val: 100, color: "#121824" },
    { text: "40 ₴", type: "uah", val: 40, color: "#1a2233" },
    { text: "1000 ₴", type: "uah", val: 1000, color: "#121824" },
    { text: "0 ₴", type: "uah", val: 0, color: "#1a2233" }
];

let currentRotation = 0;
let isSpinning = false;

function initWheel() {
    const wheel = document.getElementById('fortune-wheel');
    if (!wheel) return;
    const sectorAngle = 360 / wheelPrizes.length;

    wheel.innerHTML = wheelPrizes.map((p, i) => `
        <div class="wheel-sector" style="transform: rotate(${i * sectorAngle}deg) skewY(-60deg); background: ${p.color};">
            <span>${p.text}</span>
        </div>
    `).join('');
}

function spinWheel() {
    if (isSpinning) return;
    playSound(300, 0.2);
    isSpinning = true;

    const res = document.getElementById('wheel-result');
    if (res) res.textContent = "Крутимо...";

    const randomIndex = Math.floor(Math.random() * wheelPrizes.length);
    const sectorAngle = 360 / wheelPrizes.length;
    currentRotation += 1800 + (360 - (randomIndex * sectorAngle + sectorAngle / 2));

    const wheel = document.getElementById('fortune-wheel');
    if (wheel) wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        const prize = wheelPrizes[randomIndex];
        let val = Math.floor(prize.val * rewardMultiplier);

        if (prize.type === "uah") userUAH += val;
        else if (prize.type === "pass") userPasses += val;

        playSound(700, 0.3);
        if (res) {
            res.textContent = val > 0 ? `Вітаємо! Ви виграли ${val} ${prize.type === 'uah' ? '₴' : 'Пропусків'}! 🎉` : "Пусто, спробуйте ще раз 😢";
        }
        updateBalanceUI();
    }, 4000);
}

function renderProducts() {
    for (const cat in storeData) {
        const grid = document.getElementById(`${cat}-grid`);
        if (!grid) continue;

        grid.innerHTML = storeData[cat].map(item => `
            <div class="product-card">
                <i class="fa-solid ${item.icon} product-icon"></i>
                <h3>${item.name}</h3>
                <p class="product-desc">${item.desc}</p>
                <div class="product-footer">
                    <div class="product-price">
                        <span>${item.priceValue} 💎</span>
                        ${item.isSettingsOffer ? '<small>Тільки геми</small>' : '<small>або ' + item.passCost + ' 🎫</small>'}
                    </div>
                    <button class="btn-buy" onclick="addToCart('${item.id}', '${cat}')">У кошик</button>
                </div>
            </div>
        `).join('');
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound(350, 0.08);
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    });
});

function addToCart(id, cat) {
    playSound(500, 0.1);
    const item = storeData[cat].find(p => p.id === id);
    if (item) {
        cart.push(item);
        updateCartUI();
    }
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const items = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');

    if (count) count.textContent = cart.length;
    if (!items || !total) return;

    if (cart.length === 0) {
        items.innerHTML = `<p class="empty-cart-text">Кошик порожній 🛒</p>`;
        total.textContent = '0 ₴ / 0 💎';
        return;
    }

    let totUah = 0, totGems = 0, totPasses = 0;
    items.innerHTML = cart.map((item, idx) => {
        if (item.isGemPrice) totGems += item.priceValue; else totUah += item.priceValue;
        if (!item.isSettingsOffer) totPasses += item.passCost;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.priceValue} 💎</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${idx})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');

    total.textContent = `${totUah} ₴ / ${totGems} 💎 (або ${totPasses} 🎫)`;
}

function removeFromCart(idx) {
    playSound(250, 0.1);
    cart.splice(idx, 1);
    updateCartUI();
}

function checkout(type) {
    if (cart.length === 0) return alert('Ваш кошик порожній!');

    let totUah = 0, totGems = 0, totPasses = 0;
    cart.forEach(item => {
        if (item.isGemPrice) totGems += item.priceValue; else totUah += item.priceValue;
        if (!item.isSettingsOffer) totPasses += item.passCost;
    });

    if (type === 'pass') {
        if (userPasses < totPasses) return alert(`Недостатньо пропусків! Потрібно ${totPasses} 🎫`);
        userPasses -= totPasses;
    } else {
        if (userUAH < totUah || userGems < totGems) return alert('Недостатньо коштів на балансі!');
        userUAH -= totUah;
        userGems -= totGems;
    }

    let hasBox = false, hasSettings = false;
    cart.forEach(item => {
        if (item.gemsReward) userGems += Math.floor(item.gemsReward * rewardMultiplier);
        if (item.isBoxOffer) hasBox = true;
        if (item.isSettingsOffer) hasSettings = true;
    });

    playSound(750, 0.4);
    alert('Успішна оплата замовлення!');

    cart = [];
    updateCartUI();
    updateBalanceUI();
    document.getElementById('cart-modal').classList.remove('open');

    if (hasBox) openBoxOpeningModal();
    if (hasSettings) {
        isSettingsUnlocked = true;
        document.getElementById('settings-panel')?.classList.remove('hidden');
    }
}

let openedBoxesCount = 0;
let accumulatedRewards = { uah: 0, gems: 0, passes: 0 };

function openBoxOpeningModal() {
    openedBoxesCount = 0;
    accumulatedRewards = { uah: 0, gems: 0, passes: 0 };

    const container = document.getElementById('boxes-container');
    const summary = document.getElementById('box-rewards-summary');
    const closeBtn = document.getElementById('close-box-modal');

    if (summary) summary.textContent = "Натисніть на кожен ящик, щоб відкрити його!";
    if (closeBtn) closeBtn.classList.add('hidden');

    if (container) {
        container.innerHTML = [0, 1, 2].map(i => `
            <div class="reward-box" id="box-${i}" onclick="openBox(${i})">
                <i class="fa-solid fa-box-open"></i>
                <span>Ящик #${i+1}</span>
            </div>
        `).join('');
    }

    document.getElementById('box-opening-modal')?.classList.add('open');
}

function openBox(index) {
    const boxEl = document.getElementById(`box-${index}`);
    if (!boxEl || boxEl.classList.contains('opened')) return;

    playSound(600, 0.2);
    boxEl.classList.add('opened');

    let rewardText = [];
    const u = Math.floor((Math.floor(Math.random() * 200) + 50) * rewardMultiplier);
    accumulatedRewards.uah += u;
    userUAH += u;
    rewardText.push(`${u} ₴`);

    const g = Math.floor((Math.floor(Math.random() * 30) + 10) * rewardMultiplier);
    accumulatedRewards.gems += g;
    userGems += g;
    rewardText.push(`${g} 💎`);

    boxEl.innerHTML = `<i class="fa-solid fa-gift" style="color:var(--primary-yellow)"></i><span>${rewardText.join('<br>')}</span>`;

    openedBoxesCount++;
    updateBalanceUI();

    if (openedBoxesCount === 3) {
        const sumEl = document.getElementById('box-rewards-summary');
        if (sumEl) sumEl.textContent = `Ви виграли: ${accumulatedRewards.uah} ₴ та ${accumulatedRewards.gems} 💎!`;
        document.getElementById('close-box-modal')?.classList.remove('hidden');
    }
}

function closeBoxModal() {
    playSound(300, 0.1);
    document.getElementById('box-opening-modal')?.classList.remove('open');
}


// ==================== YOUTUBE STUDIO TYCOON ЛОГІКА ====================

let game = {
    channelName: "",
    subscribers: 0,
    dollars: 0,
    youtuberts: 0,
    timerSeconds: 60,
    baseAdvanceBonus: 1,
    currentTimerReduction: 0,
    styleLevel: 0,
    uiThemeLevel: 0,
    superActionActive: false,
    boostx10Active: false
};

let unlockedButtons = new Set();
let notificationsHistory = [];
let unreadCount = 0;
let currentTimeLeft = 1;
let wheelIsSpinning = false;
let gameInterval = null;

function saveYtState() {
    localStorage.setItem('yt_tycoon_data', JSON.stringify({
        game,
        unlockedButtons: Array.from(unlockedButtons)
    }));
}

function loadYtState() {
    const data = localStorage.getItem('yt_tycoon_data');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            game = Object.assign(game, parsed.game || {});
            if (parsed.unlockedButtons) unlockedButtons = new Set(parsed.unlockedButtons);
        } catch(e) {}
    }
}

const playButtons = [
    { id: 'btn_silver', name: 'Срібна кнопка', threshold: 100000, icon: 'fa-play', color: 'text-gray-300 border-gray-400 bg-gray-900/80' },
    { id: 'btn_gold', name: 'Золота кнопка', threshold: 1000000, icon: 'fa-play', color: 'text-yellow-400 border-yellow-500 bg-yellow-950/40' },
    { id: 'btn_diamond', name: 'Діамантова кнопка', threshold: 10000000, icon: 'fa-play', color: 'text-cyan-400 border-cyan-500 bg-cyan-950/40' },
    { id: 'btn_ruby', name: 'Рубінова кнопка', threshold: 50000000, icon: 'fa-play', color: 'text-red-500 border-red-500 bg-red-950/40' },
    { id: 'btn_legendary', name: 'Легендарна кнопка Всесвіту', threshold: 1000000000, icon: 'fa-meteor', color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40' }
];

const youturbertsTimerShop = [
    { id: 't10', name: 'Скорочення таймера -10%', cost: 10, value: 0.1, desc: 'Зменшує час нарахування підписників на 10%' },
    { id: 't25', name: 'Скорочення таймера -25%', cost: 25, value: 0.25, desc: 'Зменшує час нарахування підписників на 25%' },
    { id: 't50', name: 'Скорочення таймера -50%', cost: 50, value: 0.5, desc: 'Зменшує час нарахування підписників на 50%' }
];

const youturbertsSubsShop = [
    { id: 'b2', name: 'Випереджений час +2', cost: 15, value: 2, desc: 'Додає +2 підписників за цикл' },
    { id: 'b5', name: 'Випереджений час +5', cost: 35, value: 5, desc: 'Додає +5 підписників за цикл' },
    { id: 'b10', name: 'Випереджений час +10', cost: 70, value: 10, desc: 'Додає +10 підписників за цикл' }
];

const dollarsShop = [
    { id: 'super1', name: '⚡ СУПЕР АКЦІЯ СТУДІЇ', cost: 5000000, type: 'super', desc: 'Нарахування рівно кожну секунду!' },
    { id: 'boost10', name: '🚀 Буст x10', cost: 50000000, type: 'boost10', desc: 'Множить кількість підписників і дохід на 10!' }
];

function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (container) {
        const notif = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-youtube' : 'bg-blue-600';
        notif.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2`;
        notif.innerHTML = `<i class="fa-solid fa-bell"></i> ${message}`;
        container.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
}

function init() {
    loadYtState();
    if (!game.channelName) {
        document.getElementById('nameModal')?.classList.remove('hidden');
    } else {
        document.getElementById('nameModal')?.classList.add('hidden');
        setupChannelUI();
    }

    renderShops();
    renderPlayButtons();
    updateYtUI();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000);
}

document.getElementById('saveChannelNameBtn')?.addEventListener('click', () => {
    const input = document.getElementById('channelNameInput');
    const name = input ? input.value.trim() : "";
    if (!name) return alert('Будь ласка, введіть назву каналу!');

    game.channelName = name;
    document.getElementById('nameModal')?.classList.add('hidden');
    setupChannelUI();
    saveYtState();
});

function setupChannelUI() {
    const nameEl = document.getElementById('displayChannelName');
    const avatarEl = document.getElementById('channelAvatar');
    if (nameEl) nameEl.textContent = game.channelName;
    if (avatarEl) avatarEl.textContent = game.channelName.charAt(0).toUpperCase();
}

function gameLoop() {
    if (!game.channelName) return;

    let effectiveTime = game.superActionActive ? 1 : Math.max(1, Math.round(60 * (1 - game.currentTimerReduction)));
    currentTimeLeft--;

    if (currentTimeLeft <= 0) {
        let earnedSubs = game.baseAdvanceBonus * (game.boostx10Active ? 10 : 1);
        game.subscribers += earnedSubs;
        game.dollars += 1 * (game.boostx10Active ? 10 : 1);
        game.youtuberts += 1;

        showNotification(`+${earnedSubs.toLocaleString()} підписників!`);
        currentTimeLeft = effectiveTime;

        checkPlayButtons();
        saveYtState();
    }

    updateYtUI();
}

function checkPlayButtons() {
    playButtons.forEach(btn => {
        if (game.subscribers >= btn.threshold && !unlockedButtons.has(btn.id)) {
            unlockedButtons.add(btn.id);
            showNotification(`🏆 Досягнення розблоковано: ${btn.name}!`);
            renderPlayButtons();
            saveYtState();
        }
    });
}

function renderPlayButtons() {
    const grid = document.getElementById('playButtonsGrid');
    if (!grid) return;

    grid.innerHTML = playButtons.map(btn => {
        const isUnlocked = game.subscribers >= btn.threshold;
        return `
            <div class="border rounded-xl p-3 flex flex-col items-center text-center ${isUnlocked ? btn.color : 'bg-ytbg/40 border-ytborder/50 text-gray-500 opacity-50'}">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 bg-white/10">
                    <i class="fa-solid ${btn.icon}"></i>
                </div>
                <div class="font-bold text-xs mb-1">${btn.name}</div>
                <div class="text-[10px]">${isUnlocked ? '✅ Отримано' : `🔒 ${(btn.threshold).toLocaleString()} підп.`}</div>
            </div>
        `;
    }).join('');
}

function updateYtUI() {
    const subEl = document.getElementById('subscribersDisplay');
    const dolEl = document.getElementById('dollarsDisplay');
    const ytEl = document.getElementById('youtubertsDisplay');
    const timerEl = document.getElementById('timerDisplay');
    const advEl = document.getElementById('advanceBonusDisplay');
    const countEl = document.getElementById('countdownDisplay');
    const barEl = document.getElementById('progressBar');

    let effectiveTime = game.superActionActive ? 1 : Math.max(1, Math.round(60 * (1 - game.currentTimerReduction)));

    if (subEl) subEl.textContent = game.subscribers.toLocaleString();
    if (dolEl) dolEl.textContent = game.dollars.toLocaleString();
    if (ytEl) ytEl.textContent = game.youtuberts.toLocaleString();
    if (timerEl) timerEl.textContent = effectiveTime + 'с';
    if (advEl) advEl.textContent = '+' + (game.baseAdvanceBonus * (game.boostx10Active ? 10 : 1)).toLocaleString();
    if (countEl) countEl.textContent = currentTimeLeft + 'с';

    if (barEl) {
        let percent = effectiveTime <= 1 ? 100 : ((effectiveTime - currentTimeLeft) / effectiveTime) * 100;
        barEl.style.width = Math.min(100, Math.max(0, percent)) + '%';
    }
}

window.renderShops = function() {
    const timerShop = document.getElementById('shopYoutubertsTimer');
    const subsShop = document.getElementById('shopYoutubertsSubs');
    const dollarsShopEl = document.getElementById('shopDollars');

    if (timerShop) {
        timerShop.innerHTML = youturbertsTimerShop.map(item => `
            <div class="bg-ytbg/60 border border-ytborder p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                    <h3 class="font-bold text-sm">${item.name}</h3>
                    <p class="text-xs text-gray-400">${item.desc}</p>
                    <div class="text-youtube font-bold text-xs mt-1">${item.cost} Ютуберок</div>
                </div>
                <button onclick="buyYtItem('${item.id}', 'timer')" class="bg-youtube hover:bg-red-700 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Купити</button>
            </div>
        `).join('');
    }

    if (subsShop) {
        subsShop.innerHTML = youturbertsSubsShop.map(item => `
            <div class="bg-ytbg/60 border border-ytborder p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                    <h3 class="font-bold text-sm">${item.name}</h3>
                    <p class="text-xs text-gray-400">${item.desc}</p>
                    <div class="text-youtube font-bold text-xs mt-1">${item.cost} Ютуберок</div>
                </div>
                <button onclick="buyYtItem('${item.id}', 'subs')" class="bg-youtube hover:bg-red-700 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Купити</button>
            </div>
        `).join('');
    }

    if (dollarsShopEl) {
        dollarsShopEl.innerHTML = dollarsShop.map(item => `
            <div class="bg-ytbg/60 border border-ytborder p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                    <h3 class="font-bold text-sm">${item.name}</h3>
                    <p class="text-xs text-gray-400">${item.desc}</p>
                    <div class="text-emerald-400 font-bold text-xs mt-1">$${item.cost.toLocaleString()}</div>
                </div>
                <button onclick="buyYtItem('${item.id}', 'dollars')" class="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Купити</button>
            </div>
        `).join('');
    }
}

window.buyYtItem = function(id, cat) {
    if (cat === 'timer') {
        const item = youturbertsTimerShop.find(i => i.id === id);
        if (game.youtuberts < item.cost) return alert('Недостатньо Ютуберок!');
        game.youtuberts -= item.cost;
        game.currentTimerReduction += item.value;
        showNotification(`Придбано ${item.name}!`);
    } else if (cat === 'subs') {
        const item = youturbertsSubsShop.find(i => i.id === id);
        if (game.youtuberts < item.cost) return alert('Недостатньо Ютуберок!');
        game.youtuberts -= item.cost;
        game.baseAdvanceBonus += item.value;
        showNotification(`Придбано ${item.name}!`);
    } else if (cat === 'dollars') {
        const item = dollarsShop.find(i => i.id === id);
        if (game.dollars < item.cost) return alert('Недостатньо Доларів!');
        game.dollars -= item.cost;
        if (item.type === 'super') game.superActionActive = true;
        if (item.type === 'boost10') game.boostx10Active = true;
        showNotification(`Успішно придбано ${item.name}!`);
    }

    updateYtUI();
    saveYtState();
}

window.switchCategory = function(cat) {
    const timerShop = document.getElementById('shopYoutubertsTimer');
    const subsShop = document.getElementById('shopYoutubertsSubs');
    const dollarsShopEl = document.getElementById('shopDollars');

    if (cat === 'youtuberts') {
        if (timerShop) timerShop.classList.remove('hidden');
        if (subsShop) subsShop.classList.add('hidden');
        if (dollarsShopEl) dollarsShopEl.classList.add('hidden');
    } else {
        if (timerShop) timerShop.classList.add('hidden');
        if (subsShop) subsShop.classList.add('hidden');
        if (dollarsShopEl) dollarsShopEl.classList.remove('hidden');
    }
}

window.switchYoutubertsTab = function(sub) {
    const timerShop = document.getElementById('shopYoutubertsTimer');
    const subsShop = document.getElementById('shopYoutubertsSubs');

    if (sub === 'timer') {
        if (timerShop) timerShop.classList.remove('hidden');
        if (subsShop) subsShop.classList.add('hidden');
    } else {
        if (timerShop) timerShop.classList.add('hidden');
        if (subsShop) subsShop.classList.remove('hidden');
    }
}

document.getElementById('spinWheelBtn')?.addEventListener('click', () => {
    if (wheelIsSpinning) return;
    wheelIsSpinning = true;

    const wheel = document.getElementById('wheel');
    const deg = Math.floor(1800 + Math.random() * 1800);
    if (wheel) wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        wheelIsSpinning = false;
        game.dollars += 50;
        showNotification('Виграно $50 Доларів у колесі!');
        updateYtUI();
        saveYtState();
    }, 3000);
});
