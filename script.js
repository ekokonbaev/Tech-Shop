// Глобальные переменные
let cart = [];
const modal = document.querySelector('.modal');
const cartIcon = document.querySelector('.cart-icon');
const closeModal = document.querySelector('.close-modal');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const addToCartButtons = document.querySelectorAll('.cyber-button');
const catalogButton = document.querySelector('.hero .cyber-button');

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .category-card').forEach(el => {
    observer.observe(el);
});

// Эффект глитча для заголовков
function createGlitchEffect(element) {
    const text = element.textContent;
    let glitchInterval;

    element.addEventListener('mouseover', () => {
        glitchInterval = setInterval(() => {
            element.textContent = text
                .split('')
                .map(char => Math.random() > 0.9 ? String.fromCharCode(char.charCodeAt(0) + 1) : char)
                .join('');
        }, 50);
    });

    element.addEventListener('mouseout', () => {
        clearInterval(glitchInterval);
        element.textContent = text;
    });
}

document.querySelectorAll('.cyber-title, .cyber-text').forEach(createGlitchEffect);

// Управление корзиной
function updateCart() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-specs">${item.specs}</p>
                <p>${item.price} ₽</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector('.cart-total span').textContent = `${total} ₽`;
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    showNotification('Товар добавлен в корзину');
}

function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(id);
        return;
    }
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Товар удален из корзины');
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cyber-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Фильтрация товаров
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.textContent.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (category === 'все' || product.dataset.category === category) {
                product.style.display = 'block';
                setTimeout(() => product.classList.add('animate-in'), 100);
            } else {
                product.style.display = 'none';
                product.classList.remove('animate-in');
            }
        });
    });
});

// Обработчики событий
cartIcon.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Добавление товаров в корзину
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.classList.contains('cyber-button') && !e.target.closest('.modal')) {
            const productCard = e.target.closest('.product-card');
            const specs = Array.from(productCard.querySelectorAll('.spec-item span'))
                .map(spec => spec.textContent)
                .join(', ');
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                price: parseInt(productCard.querySelector('.price').textContent),
                image: productCard.querySelector('img').src,
                specs: specs
            };
            addToCart(product);
        }
    });
});

// Анимация сетки на главном экране
const cyberGrid = document.querySelector('.cyber-grid');
let gridOffset = 0;

function animateGrid() {
    gridOffset = (gridOffset + 0.5) % 50;
    cyberGrid.style.backgroundPosition = `${gridOffset}px ${gridOffset}px`;
    requestAnimationFrame(animateGrid);
}

animateGrid();

// Добавление стилей для уведомлений
const style = document.createElement('style');
style.textContent = `
    .cyber-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--dark-bg);
        color: var(--primary-color);
        padding: 1rem 2rem;
        border: 1px solid var(--primary-color);
        border-radius: 5px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
    }

    .cyber-notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .product-card, .category-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card.animate-in, .category-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Плавная прокрутка к каталогу
catalogButton.addEventListener('click', () => {
    const featuredSection = document.querySelector('.featured');
    featuredSection.scrollIntoView({ behavior: 'smooth' });
}); 