const carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];
const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
document.getElementById("cart-total").innerHTML = `${carrito.length}  - $${total}`;

const productos = [];
const auxiliar = [];

const buscarUnProducto = async (filter) => {
    const response = await fetch ('productos.json');
    let data = await response.json();

    let acumulador = ``;

    if(filter) { data = data.filter(producto => producto.riesgo === filter) };

    data.forEach((producto) => {
        const idButton = `add-cart${producto.id}`

        acumulador += `<div class="card">
        <h5> ${producto.nombre} </h5>
        <img src="${producto.img}">
        <div class="precio">
            <p> $${producto.precio} </p>
        </div>
        <a class= "boton botonCompra" id="${idButton}"> Agregar al Carrito </a>
    </div>`;
    })
        const contenedorDeCards = document.getElementById('seccion-card');
        contenedorDeCards.innerHTML = acumulador;

        let botonesDeCompra = Array.from(document.querySelectorAll(".botonCompra"));

        botonesDeCompra.map((producto) => {
            producto.addEventListener("click", () => {
                    let getProduct = buscarProducto(producto.id)
                    const validarProducto = carrito.find(producto => getProduct.id === producto.id);

                    if(validarProducto){
                        const indiceDelProducto = carrito.findIndex(producto => getProduct.id === producto.id);
                        carrito[indiceDelProducto].cantidad++;
                    } else {
                        getProduct = {...getProduct, cantidad: 1}
                        carrito.push(getProduct);
                    }

                    Swal.fire(
                        'Gracias por su compra!',
                        'El producto fue sumado al carrito',
                        'success'
                    )
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
                    document.getElementById("cart-total").innerHTML = `${carrito.length} - $${total}`;
                    console.log({carrito});
                })
        })

        function buscarProducto(id){
            const producto = data.find(element => "add-cart"+element.id === id)
            return producto;
        }

}

buscarUnProducto();

const buttonHome = document.querySelector('#home');
const buttonCovid = document.querySelector('#covid');
const buttonIncendio = document.querySelector('#incendio');

buttonHome.addEventListener('click', () => { buscarUnProducto() });
buttonCovid.addEventListener('click', () => { buscarUnProducto('covid19') });
buttonIncendio.addEventListener('click', () => { buscarUnProducto('incendio') });

function generarCardsCarrito() {
    const contenedorCarrito = document.getElementById("cards-modal");
    contenedorCarrito.innerHTML = null;
    
    if(carrito.length === 0){
        contenedorCarrito.innerHTML += `<p>El carrito se encuentra vacío</p>`
    } else {
        carrito.forEach((producto, index) => {
        contenedorCarrito.innerHTML += `<div>
            <p class="elemento-carrito">
            - ${producto.nombre}
            - <img src="${producto.img}" style="width:30px">
            - $${producto.precio}
            - Cantidad: ${producto.cantidad || 1}
            - Precio Total: $${producto.cantidad * producto.precio}
            - <button id="borrar${index}">Quitar Producto</button>
            </div>`;
        })
    }
    

    carrito.forEach((_, index) => {
        let buttonBorrar = document.querySelector(`#borrar${index}`);
        buttonBorrar.addEventListener('click', () => { eliminarProductoDelCarrito(index) });
    })
}

function eliminarProductoDelCarrito(id){
    if(carrito[id].cantidad === 1){
        let nuevoCarrito = carrito.filter(producto => producto.id !== carrito[id].id);

        console.log(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    } else {
        carrito[id].cantidad--;
        console.log(carrito);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    window.location.reload();
}
