import { tasks } from '../assets/db/tasks.js';
// import { v4 as UUIDV4 } from 'uuid';
// const { v4: UUIDV4 } = require('uuid');

const divGeneral = document.querySelector('.contenedorGeneral');
const modalContainer = document.querySelector('.modalContainer')
let all = document.querySelectorAll('.divOptions > div');
let divTask = document.querySelector('.divTask');
let inputTask = document.querySelector('.addTask');
let buttonEdit = document.querySelector('.buttonEdit')
let contenedorTodoList = document.querySelector('.contenedorTodoList')
let modal = document.querySelector('.modal')

// Evento al presionar Enter
inputTask.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        let taskLength = tasks.length + 1
        // Insertar tarea
        tasks.push({
            id: taskLength + "",
            // id: UUIDV4(),
            title: "" + e.target.value,
            description: "" + e.target.value,
            status: "pending"
        })
        console.log(tasks);

        divTask.innerHTML = ""
        crearElementoDiv("all")
        e.target.value = ""
    }
});


// Evento para el div general
divGeneral.addEventListener('click', (e) => {

    // Pintar los divs de cada modulo(all, pending y completed)
    pintarAllPendingCompleted()

    // Condicional para detectar clicks dependiendo de la clase
    if (e.target.matches(".all")) {
        divTask.innerHTML = ""
        crearElementoDiv("all")
        contenedorTodoList.dataset.name = "all"
    }
    else if (e.target.matches(".pending")) {
        divTask.innerHTML = ""
        crearElementoDiv("pending")
        contenedorTodoList.dataset.name = "pending"
    }
    else if (e.target.matches(".completed")) {
        divTask.innerHTML = ""
        crearElementoDiv("completed")
        contenedorTodoList.dataset.name = "completed"
    }
    if (e.target.matches('.puntosimg')) {
        let containerImgOpcion = document.querySelector('.containerImgOpcion')
        let divImagenPadre = e.target.parentElement
        let divMenuOpciones = document.createElement('div')
        let menuOpciones = document.querySelectorAll('.MenuOpciones')

        menuOpciones.forEach(element => {
            containerImgOpcion = document.querySelector('.containerImgOpcion')
            element.remove()
        })

        divMenuOpciones.classList.toggle('MenuOpciones')
        divMenuOpciones.innerHTML = `
                <div class="edit">Editar</div>
                <div class="delete">Eliminar</div>
                <div class="Complete">Completar</div>
                `
        // console.log(divImagenPadre);
        divImagenPadre.append(divMenuOpciones)
    }
    if(e.target.matches('.edit')){
        let idEdit = e.target.parentElement.parentElement.parentElement.firstChild.nextSibling.id
    
        // const updateTask = {
        //     id: 1,
        //     titile: 'ABC',
        //     description: '123',
        //     status: 'pending'
        // }

        editarRegistroDiv(idEdit)

        modalContainer.style.display = "flex"
    }
    if(e.target.matches('.delete')){
        let idDelete = e.target.parentElement.parentElement.parentElement.firstChild.nextSibling.id

        console.log("idDelete",idDelete);
        borrarRegistroDiv(idDelete)
    }
    if(e.target.matches('.Complete')){
        let idComplete = e.target.parentElement.parentElement.parentElement.firstChild.nextSibling.id
        completarRegistroDiv(idComplete)
    }
    if(e.target.matches('.modalContainer')){
        modalContainer.style.display = "none"
    }
    // Actualizar datos
    if(e.target.matches('.buttonEdit')){
        let idActualizar = modal.dataset.name
        actualizarRegistroEditado(idActualizar)
        modalContainer.style.display = "none"
    }
})

// Crear e insertar divs con la informacion de las tareas dependiendo del objeto Tasks
const crearElementoDiv = (stat) => {
    tasks.forEach(dat => {
        let divRow = document.createElement('div');
        if (dat.status == stat || stat === "all") {
            // console.log(dat);
            divRow.classList.add('taskRow')
            divRow.innerHTML += `
                        <div id="${dat.id}" class="">${dat.title},${dat.description},${dat.status}</div>
                        <div class="containerImgOpcion"><img class="puntosimg" src="../assets/icons/3puntos.svg" alt=""></div>
                    `
        }
        divTask.append(divRow)
    })
}

// Insertar datos en inputs


/**
 * Función que edita un usuario.
 * @param {Object} task Deifinición de una tarea.
 * @returns Retorna el ID de la tarea editada.
 */
const editarRegistroDiv = (id) =>{

    let object = tasks.filter(objeto => id == objeto.id)
    let inputs = modalContainer.querySelectorAll('input, select');
    
    modal.dataset.name = id

    // Agrega los valores a los inputs, del objeto que se filtro por id
    inputs.forEach(input=>{
        if(input.classList.contains('editTitle')){
            input.value = object[0].title
        }
        else if(input.classList.contains('editDescription')){
            input.value = object[0].description
        }
        else{
            input.value = object[0].status
        }
    })

    return id
}

// Guardar registro tasks
const actualizarRegistroEditado = (id) =>{
    // let object = tasks.filter(objeto => id == objeto.id)
    let taskFound = tasks.find(objeto => id == objeto.id);

    let inputs = modalContainer.querySelectorAll('input, select');
    let paramDataset = contenedorTodoList.dataset.name

    inputs.forEach(input=>{
        if(input.classList.contains('editTitle')){
            taskFound.title = input.value
        }
        else if(input.classList.contains('editDescription')){
            taskFound.description = input.value
        }
        else{
            taskFound.status = input.value 
        }
    })
    divTask.innerHTML = ""
    crearElementoDiv(paramDataset + "")
}

const borrarRegistroDiv = (id) =>{
    const objetoFiltrado = tasks.findIndex(task=> task.id === id)
    let paramDataset = contenedorTodoList.dataset.name

    if (objetoFiltrado !== -1) {
        tasks.splice(objetoFiltrado,1);
    }
    
    console.log(tasks);
    // Refrescar elementos(Separar en una funcion)
    divTask.innerHTML = ""
    crearElementoDiv(paramDataset + "")
}

// Cambiar status a Completed 
const completarRegistroDiv = (id) =>{
    let object = tasks.filter(objeto => id == objeto.id)
    let paramDataset = contenedorTodoList.dataset.name

    // Cambia el status del objeto
    object[0].status = "completed"

    // Refrescar elementos
    divTask.innerHTML = ""
    crearElementoDiv(paramDataset + "")
}

// Pintar los divs all, pending y completed si se presiona
// focusFilter
const pintarAllPendingCompleted = () =>{
        all.forEach(boton => {
            boton.addEventListener("click", function() {
              // Remover la clase 'allClick' de todos los divs
                all.forEach(b => b.classList.remove("allClick"));
        
              // Agregar la clase 'allClick' al divs que se hizo clic
                this.classList.add("allClick");
            });
        });
}