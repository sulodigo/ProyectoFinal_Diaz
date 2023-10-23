let pizzas;
let carrito;
main();

async function main(){
    pizzas = await obtenerPizzas();
    imprimirProductosEnHTML(pizzas);
    carrito = chequearCarritoEnStorage();
}

class PizzaCarro {
    
    constructor(pizza) {
    
        this.idPizza = pizza.idPizza;
        this.tipo = pizza.tipo;
        this.descripcion = pizza.descripcion;
        this.precio = pizza.precio;

        this.cantidad = 1;
        this.precioTotal = 0;
     }

    agregarUnidad() {
        this.cantidad++;
    }

    quitarUnidad() {
        this.cantidad--;
    }

    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    } 
}

function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

    if (contenidoEnStorage) {
        let array = [];

        for (const objeto of contenidoEnStorage) {
            let pizza = new PizzaCarro(objeto);
            pizza.actualizarPrecioTotal();

            array.push(pizza);
        }
        imprimirTabla(array);
        return array;
    }
    return [];
}

function imprimirProductosEnHTML(pizzas) {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    for (const pizzaAct of pizzas) {
        let card = document.createElement("div");

        card.innerHTML = `
            <div class="card text-center" style="width: 18rem;">
                <div class="card-body">
                <img src="${pizzaAct.img}" id="" class="card-img-top img-fluid" alt="">
                <h2 class="card-title">${pizzaAct.tipo}</h2>
                <h5 class="card-subtitle mb-2 text-muted">${pizzaAct.descripcion}</h5>
                <p class="card-text">$${pizzaAct.precio}</p>
        
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button id="agregar${pizzaAct.idPizza}" type="button" class="btn btn-warning">Agregar</button>
                </div>
                </div>
            </div>`;

            contenedor.appendChild(card);

            let boton = document.getElementById(`agregar${pizzaAct.idPizza}`);
           
            boton.addEventListener("click", () => agregarAlCarrito(pizzaAct.idPizza));
        }
    }
    function agregarAlCarrito(idPizza) {                                 
        let pizzaEnCarrito = carrito.find((PizzaCarro) => PizzaCarro.idPizza === idPizza);
    
        if (pizzaEnCarrito) {
            let index = carrito.findIndex((elemento) => elemento.idPizza === pizzaEnCarrito.idPizza);
            carrito[index].agregarUnidad();
            carrito[index].actualizarPrecioTotal();
        } else {
            let nvaPizzaCarro = new PizzaCarro(pizzas[idPizza]);
            nvaPizzaCarro.actualizarPrecioTotal();
            carrito.push(nvaPizzaCarro);
        }

        localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
        imprimirTabla(carrito);
    }
    
    function eliminarDelCarrito(idPizza) {

        Swal.fire({
            title: "¿Eliminar pizza?",
            text: "Procederás a eliminar la pizza",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Sí, eliminar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) { // si se confirma...
                
                let pizza = carrito.find((pizza) => pizza.idPizza === idPizza);
        
                let index = carrito.findIndex((element) => element.idPizza === pizza.idPizza);
            
                if (pizza.cantidad > 1) {
                    carrito[index].quitarUnidad();
                    carrito[index].actualizarPrecioTotal();
                } else {
                    carrito.splice(index, 1);
                }
                
                localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
                imprimirTabla(carrito);

               Swal.fire(
                    "¡Pizza eliminada!",
                    "pizza eliminada correctamente.",
                    "success"
                ) 
            }
        });


    }
    
    function eliminarCarrito() {
        carrito.length = 0;
        localStorage.removeItem("carritoEnStorage");
    
        document.getElementById("carrito").innerHTML = "";
        document.getElementById("acciones-carrito").innerHTML = "";
    }
    
    function obtenerPrecioTotal(array) {
        return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
    }
    
    function imprimirTabla(array) {
        let precioTotal = obtenerPrecioTotal(array);
        let contenedor = document.getElementById("carrito");
        contenedor.innerHTML = "";
    
        let tabla = document.createElement("div");
    
        tabla.innerHTML = `
            <table id="tablaCarrito" class="table table-striped">
                <thead>         
                    <tr>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                    </tr>
                </thead>
    
                <tbody id="bodyTabla">
                </tbody>
            </table>`;
    
        contenedor.appendChild(tabla);
    
        let bodyTabla = document.getElementById("bodyTabla");
    
        for (let pizza of array) {
            let datos = document.createElement("tr");
            datos.innerHTML = `
                    <td>${pizza.tipo}</td>
                    <td>${pizza.cantidad}</td>
                    <td>$${pizza.precioTotal}</td>
                    <td><button id="eliminar${pizza.idPizza}" class="btn btn-success">Eliminar</button></td>`;
    
            bodyTabla.appendChild(datos);
    
            let botonEliminar = document.getElementById(`eliminar${pizza.idPizza}`);
            botonEliminar.addEventListener("click", () => eliminarDelCarrito(pizza.idPizza));
        }
    
        let accionesCarrito = document.getElementById("acciones-carrito");
        accionesCarrito.innerHTML = `
            <h5>PrecioTotal: $${precioTotal}</h5></br>`;
    }

    async function obtenerPizzas() {

        //Esta función es asincrona pq debería hacer una llamada http.
        //por simplicidad ocupamos un array de objetos, pero mantenemos la función asincrona
        //para cumplir objetivos de la entrega.

        return [
            {
                idPizza: 0,
                tipo: "BBQ",
                descripcion: "Masa piedra, salsa BBQ y pepperoni",
                precio: 10550,
                img: "./img/pizzaBbq.jpeg",
            },
            {
                idPizza: 1,
                tipo: "Napolitana",
                descripcion: "Masa piedra, salsa de tomate, queso y jamón",
                precio: 10950,
                img: "./img/pizzaNapolitana.jpeg",
            },
            {
                idPizza: 2,
                tipo: "Hawaiana",
                descripcion: "Masa piedra, salsa, queso, jamón y piña",
                precio: 11000,
                img: "./img/pizzaHawaiana.jpeg",
            },
            {
                idPizza: 3,
                tipo: "Española",
                descripcion: "Masa piedra, salsa, queso, choricillo, y aceitunas",
                precio: 11550,
                img: "./img/pizzaEspañola.jpeg",
            },
            {
                idPizza: 4,
                tipo: "4 Estaciones",
                descripcion: "Masa, salsa, queso, champiñón, piña y jamón",
                precio: 11950,
                img: "./img/pizzaCuatroEstaciones.jpeg",
            },
            {
                idPizza: 5,
                tipo: "Americana",
                descripcion: "Masa piedra, salsa de tomate, queso y pepperoni",
                precio: 12550,
                img: "./img/pizzaAmericana.jpeg",
            },
            {
                idPizza: 6,
                tipo: "Vegetariana",
                descripcion: "Masa, salsa de tomate, aceitunas, y champiñónes",
                precio: 13000,
                img: "./img/pizzaVegetariana.jpeg",
            },
            {
                idPizza: 7,
                tipo: "Veggie",
                descripcion: "Masa, salsa, aceitunas, cebolla, champiñónes",
                precio: 13550,
                img: "./img/pizzaVeggie.jpeg",
            },
        ];
    }

   


