function $(valorId) {
    return document.getElementById(valorId);
}

//Variables
let materias;
let fila;


function construirTabla(materia) {

    let tabla = $("tabla");

    let fila = document.createElement("tr");
    fila.setAttribute("id", materia.id);
    fila.setAttribute("class", "filaStyle");
    let celda = document.createElement("td");
    celda.appendChild(document.createTextNode(materia.nombre))
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.appendChild(document.createTextNode(materia.cuatrimestre))
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.appendChild(document.createTextNode(materia.fechaFinal.toString()));
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.appendChild(document.createTextNode(materia.turno));
    fila.appendChild(celda);
    celda = document.createElement("td");
    fila.addEventListener("dblclick", cargaFormulario);

    tabla.appendChild(fila);

}



//Carga las materias
const GetMaterias = new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (xhr.readyState == 4) {

            if (xhr.status == 200) {
                let datos = JSON.parse(xhr.responseText);
                resolve(datos);
            } else {
                reject('Ocurrio un error');
            }
        }
    }

    xhr.open("GET", "http://localhost:3000/materias", true);
    xhr.send();
});


function CargarTabla() {

    materias.forEach((item) => {
        construirTabla(item);
    })

}


function cargaFormulario(e) {

    fila = e.target.parentNode; //referencia de fila seleccionada
    let formulario = $("formulario");
    let id = e.currentTarget.id;
    formulario.style.visibility = "visible";
    cargarMateriaPorId(id);

}

function cargarMateriaPorId(id) {

    materias.forEach((materia) => {

        if (materia.id.toString() == id) {
            $("txtNombre").value = materia.nombre;
            $("cuatrimestre").value = materia.cuatrimestre;
            let auxFecha = materia.fechaFinal;
            let fecha = auxFecha.substring(6, 10) + "-" + auxFecha.substring(3, 5) + "-" + auxFecha.substring(0, 2);
            $("dateFecha").value = fecha;
            $("txtNombre").setAttribute("user", materia.id);

            $("txtNombre").style.borderColor = "white";
            $("dateFecha").style.borderColor = "white";

            if (materia.turno == "Mañana") {
                $("turnoMañ").checked = true;
                $("turnoNoc").checked = false;
            } else {
                $("turnoMañ").checked = false;
                $("turnoNoc").checked = true;
            }
        };
    })

}

function ValidarCampos() {

    let retorno = true;
    let fechaActual = Date.now();
    let fecha = new Date($("dateFecha").value);

    if ($("txtNombre").value.length <= 6) {

        $("txtNombre").style.borderColor = "red";
        retorno = false;
    } else {
        $("txtNombre").style.borderColor = "green";
    }

    if (fecha <= fechaActual) {

        $("dateFecha").style.borderColor = "red";
        retorno = false;
    } else {
        $("dateFecha").style.borderColor = "green";
    }

    if (!($("turnoMañ").checked == true || $("turnoNoc").checked == true)) {
        retorno = false;
    }

    return retorno;

}


function generarJson() {

    let id = $("txtNombre").getAttribute("user");
    let nombre = $("txtNombre").value;
    let cuatrimestre = $("cuatrimestre").value;
    let fecha = new Date($("dateFecha").value);
    let turno;
    let fechaFinal;


    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    mes++;
    let año = fecha.getFullYear();
    fechaFinal = dia + "/" + mes + "/" + año;

    if (ValidarCampos()) {

        if ($("turnoMañ").checked) {
            turno = "Mañana";
        } else {
            turno = "Noche";

        }

        let jsonMateria = { "id": id, "nombre": nombre, "cuatrimestre": cuatrimestre, "fechaFinal": fechaFinal, "turno": turno };
        return jsonMateria;

    }

}

const EditarFila = (objeto) => new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Ocurrio un error");
            }
        }
    }

    xhr.open("POST", "http://localhost:3000/editar");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(objeto));

});

const EliminarFila = (objeto) => new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Ocurrio un error");
            }
        }
    }

    xhr.open("POST", "http://localhost:3000/eliminar");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(objeto));

});

function actualizarListado(object) {

    for (let i = 0; i < materias.length; i++) {
        if (object.id == materias[i].id) {
            materias[i].nombre = object.nombre;
            materias[i].fechaFinal = object.fechaFinal;
            materias[i].turno = object.turno;
        }
    };

}

function limpiarTabla() {

    let tabla = $('tabla');
    let filasCount = tabla.rows.length;
    for (var i = 1; i < filasCount; i++) {
        tabla.deleteRow(1);
    }

}

function RemoverDelListado(object) {

    for (let i = 0; i < materias.length; i++) {
        if (object.id == materias[i].id) {
            materias.splice(i, 1);
        }
    }
}

function jsonEliminar() {

    let id = $("txtNombre").getAttribute("user");

    let jsonMateria = { "id": id };

    return jsonMateria;

}

function eliminarElemento() {
    let id = $("txtNombre").getAttribute("user");
    let fila = $(id);
    let tabla = $("tabla");
    tabla.removeChild(fila);
}


function FallaPeticion(mensaje) {
    console.log(mensaje);
}


function SpinnerVisibility(x) {

    if (x == true) {
        $("idSpinner").style.visibility = "visible";
    } else {
        $("idSpinner").style.visibility = "hidden";
    }
}

window.addEventListener("load", () => {

    SpinnerVisibility(false);

    GetMaterias.then(elemento => {
        materias = elemento;
        CargarTabla(materias);
    })
        .catch(f => {
            FallaPeticion(f);
        });


    $("btnModificar").addEventListener("click", (e) => {

        if (ValidarCampos()) {
            SpinnerVisibility(true);
            EditarFila(generarJson())
                .then((datos) => {
                    actualizarListado(datos);
                    limpiarTabla();
                    CargarTabla();
                    SpinnerVisibility(false);

                })
                .catch((error) => {

                    console.error(error);
                })
                .finally(function () {
                    SpinnerVisibility(false);
                });


        }
    });

    $("btnEliminar").addEventListener("click", (e) => {

        SpinnerVisibility(true);
        EliminarFila(jsonEliminar())
            .then((datos) => {
                RemoverDelListado(datos);
                eliminarElemento();
                SpinnerVisibility(false);
            })
            .catch((error) => {

                console.error(error);
            })
            .finally(function () {
                SpinnerVisibility(false);
            });


    });

    $("btnCerrar").addEventListener("click", () => {
        $("formulario").style.visibility = "hidden";
    });

});




