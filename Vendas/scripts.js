const cart = JSON.parse(localStorage.getItem('cart')) || [];

function openProductModal(name, image, description, colors) {
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductImage').src = image;
    document.getElementById('modalProductDescription').textContent = description;
    
    const colorSelect = document.getElementById('modalProductColor');
    colorSelect.innerHTML = '';
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        colorSelect.appendChild(option);
    });
    
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

function addToCartFromModal() {
    const name = document.getElementById('modalProductName').textContent;
    const image = document.getElementById('modalProductImage').src;
    const color = document.getElementById('modalProductColor').value;

    console.log("Adicionando ao carrinho:", { name, image, color });

    if (!name || !image || !color) {
        alert("Erro: Produto incompleto.");
        return;
    }

    cart.push({ name, image, color });
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart)); // Salva no Local Storage
    closeModal();
    alert(`${name} adicionado ao carrinho!`);
}


function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
    renderCartItems();
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cartItems');
    cartItemsList.innerHTML = ''; // Limpa a lista anterior
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name} - ${item.color}</span>
            <button class="remove-button" onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItemsList.appendChild(li);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o Local Storage
}


function toggleCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.style.display = (cartDiv.style.display === 'block') ? 'none' : 'block';
}

function openCustomerModal() {
    document.getElementById('customerModal').classList.add('show');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('show');
    clearCustomerFields(); // Limpa os campos ao fechar
}

function clearCustomerFields() {
    document.getElementById('customerName').value = '';
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('deliveryOption').value = 'entrega'; // Resetando para opção padrão
}

function toggleDeliveryFields() {
    const deliveryOption = document.getElementById('deliveryOption').value;
    const deliveryAddressField = document.getElementById('deliveryAddressField');
    deliveryAddressField.style.display = (deliveryOption === 'entrega') ? 'block' : 'none';
}

function submitOrder() {
    const name = document.getElementById('customerName').value;
    const deliveryOption = document.getElementById('deliveryOption').value;

    if (!name) {
        alert("Por favor, insira seu nome.");
        return;
    }

    const deliveryAddress = deliveryOption === 'entrega' ? 
        document.getElementById('deliveryAddress').value : 
        'Retirada na loja';

    const productsList = cart.length > 0 ? 
        cart.map(item => `${item.name}, Tamanho: ${item.color}`).join('\n') : 
        'Nenhum produto no carrinho';

    const message = `Meu pedido!\n` + 
        `Nome: ${name}\n` + 
        `Opção: ${deliveryOption}\n` + 
        `Endereço de Entrega: ${deliveryAddress}\n` + 
        `Produtos:\n` + 
        productsList;

    console.log("Mensagem do Pedido:", message);

    const emailUrl = `mailto:aux.supervisao@auxiliarservicos.com.br?subject=Novo Pedido&body=${encodeURIComponent(message)}`;
    window.location.href = emailUrl;
    closeCustomerModal();
    cart.length = 0; // Limpa o carrinho
    localStorage.removeItem('cart'); // Remove do Local Storage
    updateCartCount(); // Atualiza a contagem do carrinho
}
