(()=>{
const criptomonedasDiv = document.querySelector('#criptomonedas')
const formulario = document.querySelector('#formulario')
const monedaSelect = document.querySelector('#moneda')
const resultado = document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario)
    monedaSelect.addEventListener('change', leerValor)
    criptomonedasDiv.addEventListener('change', leerValor)
})

function consultarCriptomonedas(){
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas (resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(moneda => {
        const {Name, FullName} = moneda.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName

        criptomonedasDiv.appendChild(option)
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e){
    e.preventDefault()

    //Validar 
    const {moneda, criptomoneda} = objBusqueda

    if (moneda === '' || criptomoneda === ''){
        mostrarMensaje('Todos los campos son obligatorios')
        return
    }

    consultarApi()
}


function mostrarMensaje (mensaje){
    const existeError = document.querySelector('.error')

    if(!existeError){
        const divError = document.createElement('div')
        divError.classList.add('error')
        divError.textContent = mensaje

        formulario.appendChild(divError)

        setTimeout(() => {
            divError.remove()
        }, 3000);
    }
}

function consultarApi(){
    const {moneda, criptomoneda} = objBusqueda

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    spinner()

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacion(cotizacion){
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion

    limpiarHTML()

    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `El precio es de: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`
    
    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`
    
    const ultimasHoras = document.createElement('p')
    ultimasHoras.innerHTML = `Varación últimas horas: <span>${CHANGEPCT24HOUR}</span>`
    
    const ultimaActulizacion = document.createElement('p')
    ultimaActulizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActulizacion)
}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner(){
    limpiarHTML()
    const spinner = document.createElement('div')
    spinner.classList.add('sk-chase')

    spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `
    resultado.appendChild(spinner)
}


})()