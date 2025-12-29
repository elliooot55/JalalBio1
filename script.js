    // --- CONFIGURATION ---
        // WHATSAPP NUMBER (NO SPACES OR SYMBOLS)
        const WHATSAPP_PHONE_NUMBER = "212626743617"; 

        // --- STATE ---
        let cart = [];

        // --- MENU FUNCTION ---
        function toggleMenu() {
            const navLinks = document.getElementById('nav-links');
            navLinks.classList.toggle('active');
        }
        function closeMenu() {
            const navLinks = document.getElementById('nav-links');
            navLinks.classList.remove('active');
        }

        // --- DARK MODE FUNCTION ---
        function toggleTheme() {
            const body = document.body;
            const iconSun = document.getElementById('icon-sun');
            const iconMoon = document.getElementById('icon-moon');

            body.classList.toggle('dark-mode');

            // Toggle Icons
            if (body.classList.contains('dark-mode')) {
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
                localStorage.setItem('theme', 'dark');
            } else {
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
                localStorage.setItem('theme', 'light');
            }
        }

        // Load saved theme on startup
        window.addEventListener('load', () => {
            const savedTheme = localStorage.getItem('theme');
            const iconSun = document.getElementById('icon-sun');
            const iconMoon = document.getElementById('icon-moon');
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
            } else {
                document.body.classList.remove('dark-mode');
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
            }
        });
        
        // --- CART FUNCTIONS ---
        function addToCart(productName, productPrice) {
            cart.push({ name: productName, price: productPrice });
            updateCartCount();
        }

        function buyNow(productName, productPrice) {
            cart.push({ name: productName, price: productPrice });
            updateCartCount();
            toggleCart(true); 
        }

        function removeFromCart(index) {
            // حذف المنتج من المصفوفة بناءً على رقمه (index)
            cart.splice(index, 1);
            
            // تحديث العداد
            updateCartCount();
            
            // إعادة رسم السلة
            renderCart();
        }

        function updateCartCount() {
            const badge = document.getElementById('cart-count');
            badge.textContent = cart.length;
            
            badge.style.transform = 'scale(1.3)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }

        function toggleCart(forceOpen = null) {
            const modal = document.getElementById('cartModal');
            if (forceOpen === true) {
                modal.classList.add('open');
                renderCart();
            } else if (forceOpen === false) {
                modal.classList.remove('open');
            } else {
                modal.classList.toggle('open');
                renderCart();
            }
        }

        window.onclick = function(event) {
            const modal = document.getElementById('cartModal');
            if (event.target == modal) {
                toggleCart(false);
            }
        }

        function renderCart() {
            const listContainer = document.getElementById('cartItemsList');
            const totalDisplay = document.getElementById('cartTotalDisplay');
            const whatsappBtn = document.getElementById('whatsappBtn');

            listContainer.innerHTML = '';
            
            if (cart.length === 0) {
                listContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); padding: 20px;">السلة فارغة حالياً</p>';
                totalDisplay.textContent = '0.00 MAD';
                whatsappBtn.disabled = true;
                whatsappBtn.style.opacity = '0.5';
                whatsappBtn.style.cursor = 'not-allowed';
                return;
            }

            whatsappBtn.disabled = false;
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.cursor = 'pointer';

            let total = 0;

            cart.forEach((item, index) => {
                total += item.price;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                // تم إضافة زر الحذف هنا
                itemDiv.innerHTML = `
                    <span>${item.name} <button onclick="removeFromCart(${index})" style="color:#ff4d4d; cursor:pointer; background:none; border:none; font-size:1.2rem; margin-right:8px;">&times;</button></span>
                    <span>${item.price.toFixed(2)} MAD</span>
                `;
                listContainer.appendChild(itemDiv);
            });

            totalDisplay.textContent = total.toFixed(2) + ' MAD';
        }

        // --- WHATSAPP CHECKOUT (ARABIC) ---
        function checkoutWhatsApp() {
            if (cart.length === 0) return;

            let message = "مرحباً، أرغب في إتمام طلب من متجر جلال بيو:%0a%0a";
            let total = 0;

            cart.forEach(item => {
                message += `▪️ ${item.name} - ${item.price.toFixed(2)} درهم%0a`;
                total += item.price;
            });

            message += `%0a*المجموع الكلي: ${total.toFixed(2)} درهم*`;
            message += "%0a%0aيرجى تأكيد التوفر وطريقة الدفع.";

            const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`;
            window.open(url, '_blank');
        }

        // --- FILTER ---
        function filterProducts(category) {
            const products = document.querySelectorAll('.product-card');
            const buttons = document.querySelectorAll('.filter-btn');

            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.includes('الكل') && category === 'all') btn.classList.add('active');
                if (btn.textContent.includes('الزيتون والسمن') && category === 'olives') btn.classList.add('active');
                if (btn.textContent.includes('العسل والدبس') && category === 'honey') btn.classList.add('active');
                if (btn.textContent.includes('التين والخليع') && category === 'fig') btn.classList.add('active');
            });

            products.forEach(product => {
                const productCategory = product.getAttribute('data-category');
                if (category === 'all' || productCategory === category) {
                    product.style.display = 'flex';
                    product.style.opacity = '0';
                    setTimeout(() => product.style.opacity = '1', 50);
                } else {
                    product.style.display = 'none';
                }
            });
        }