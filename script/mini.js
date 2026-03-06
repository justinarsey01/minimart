
        let products = [
        ];

        let cart = [];

        const productList = document.getElementById('product-list');
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartSection = document.getElementById('cart');
        const cartIcon = document.getElementById('cart-icon');
        const closeCart = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        const searchInput = document.getElementById('search-input');
        const addProductBtn = document.getElementById('add-product-btn');
        const addProductForm = document.getElementById('add-product-form');
        const cancelAddProduct = document.getElementById('cancel-add-product');
        const productImageInput = document.getElementById('product-image');

        function displayProducts(filteredProducts = products) {
            productList.innerHTML = '';
            filteredProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const cartItem = cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCart();
        }

        function updateQuantity(productId, change) {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += change;
                if (cartItem.quantity <= 0) {
                    removeFromCart(productId);
                }
                updateCart();
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        function updateCart() {
            cartItems.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <span>${item.name}</span>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                cartItems.appendChild(cartItem);
            });

            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Thank you for your purchase!');
            cart = [];
            updateCart();
            cartSection.style.display = 'none';
        }

        function searchProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        }

        function addNewProduct() {
            const name = document.getElementById('product-name').value.trim();
            const price = parseFloat(document.getElementById('product-price').value);
            const imageFile = document.getElementById('product-image').files[0];
            const imageUrl = document.getElementById('product-image-url').value.trim();

            if (!name || isNaN(price) || price <= 0) {
                alert('Please enter a valid product name and price.');
                return;
            }

            const newProduct = {
                id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
                name,
                price,
                image: "https://via.placeholder.com/150" // Default image
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    newProduct.image = e.target.result;
                    products.push(newProduct);
                    displayProducts();
                    addProductForm.style.display = 'none';
                    document.getElementById('product-name').value = '';
                    document.getElementById('product-price').value = '';
                    document.getElementById('product-image').value = '';
                    document.getElementById('product-image-url').value = '';
                };
                reader.readAsDataURL(imageFile);
            } else if (imageUrl) {
                newProduct.image = imageUrl;
                products.push(newProduct);
                displayProducts();
                addProductForm.style.display = 'none';
                document.getElementById('product-name').value = '';
                document.getElementById('product-price').value = '';
                document.getElementById('product-image').value = '';
                document.getElementById('product-image-url').value = '';
            } else {
                products.push(newProduct);
                displayProducts();
                addProductForm.style.display = 'none';
                document.getElementById('product-name').value = '';
                document.getElementById('product-price').value = '';
                document.getElementById('product-image').value = '';
                document.getElementById('product-image-url').value = '';
            }
        }

        cartIcon.addEventListener('click', () => {
            cartSection.style.display = 'block';
        });

        closeCart.addEventListener('click', () => {
            cartSection.style.display = 'none';
        });

        checkoutBtn.addEventListener('click', checkout);

        searchInput.addEventListener('input', searchProducts);

        addProductBtn.addEventListener('click', () => {
            addProductForm.style.display = 'block';
        });

        cancelAddProduct.addEventListener('click', () => {
            addProductForm.style.display = 'none';
            document.getElementById('product-name').value = '';
            document.getElementById('product-price').value = '';
            document.getElementById('product-image').value = '';
            document.getElementById('product-image-url').value = '';
        });

        displayProducts();
    