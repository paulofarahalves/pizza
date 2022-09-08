let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item,index)=>{
    // clona a estrutura para cada pizza
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // seta o atributo data-key com o valor index de cada pizza
    pizzaItem.setAttribute('data-key',index);

    // substitui o informações de cada pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // abre janela ao clicar na pizza
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();  
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key

        // preenche os campos da pizza na janela
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        // remove a classe selected das divs size ao abrir janela
        c('.pizzaInfo--size.selected').classList.remove('selected');
        
        // adiciona a classe selected para o size grande ao abrir janela
        cs('.pizzaInfo--size').forEach((size,sizeIndex) => {    
            if(sizeIndex == 2) {
                size.classList.add('selected');
            };
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        // preenche quantidade de pizzas
        c('.pizzaInfo--qt').innerHTML = modalQt;

        // mostra janela
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';

        // transição de abertura da janela
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    // adiciona cada pizza
    c('.pizza-area').append(pizzaItem);
});

// EVENTOS DO MODAL

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;    

    // transição de fechamento da janela
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);    
}

// fecha o modal nos botôes Voltar e Cancelar
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

// diminui qt ao clicar em -
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// aumenta qt ao clicar em +
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// adiciona classe selected para o size clicado
cs('.pizzaInfo--size').forEach((size,sizeIndex) => {    
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});

// evento de click do botão Adicionar ao Carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    // cria identificador para verificar se sabor/tamanho foi adicionado ao carrinho
    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item)=>item.identifier == identifier);
    
    // caso identificador já exista no carrinho, aumenta a qt. Caso contrário, adiciona ao carrinho
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    };

    updateCart();
    closeModal();
});

// evento de abertura do carrinho
c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

// evento de fechamento do carrinho
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

// evento de atualização do carrinho
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');

        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // para cada item no carrinho, é calculado o valor subtotal e adicionado divs de sabor/tamanho
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            // evento de click no - do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i,1);
                }
                updateCart();
            });

            // evento de click no + do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart()
            });

            c('.cart').append(cartItem);
        };

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        // substitui valores de subtotal, desconto e total do carrinho
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {

        // se carrinho estiver vazio, fecha janela lateral
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    };
};