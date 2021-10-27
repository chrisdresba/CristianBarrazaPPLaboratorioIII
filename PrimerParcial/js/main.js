function $(valorId) {
    return document.getElementById(valorId);
}

//Variables
let localidades;
let fila;

function construirTabla(persona) {

    let tabla = $("tabla");

    let fila = document.createElement("tr");
    fila.setAttribute("id", "persona" + persona.id);
    if (persona.id % 2 == 0) {
        fila.setAttribute("class", "filaGrey");
    }
    let celda = document.createElement("td");
    celda.appendChild(document.createTextNode(persona.nombre))
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.appendChild(document.createTextNode(persona.apellido))
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.setAttribute("value", persona.localidad.id);
    celda.appendChild(document.createTextNode(persona.localidad.nombre));
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.appendChild(document.createTextNode(persona.sexo));
    fila.appendChild(celda);
    celda = document.createElement("td");
    fila.addEventListener("click", cargaFormulario);

    tabla.appendChild(fila);

}

//Carga las personas
function CargarEntidades() {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.status == 200 && this.readyState == 4) {

            $("idSpinner").style.visibility = "hidden";
            let personas = JSON.parse(xhr.responseText);

            personas.map(function (item) {
                construirTabla(item);
            })

        }
    }

    xhr.open("GET", "http://localhost:3000/personas", true);
    xhr.send();
    $("idSpinner").style.visibility = "visible";
}


function CargarLocalidades() {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.status == 200 && this.readyState == 4) {
            $("idSpinner").style.visibility = "hidden";
            localidades = JSON.parse(xhr.responseText);

            localidades.map(function (item) {
                AgregarLocalidades(item);
            })

        }
    }

    xhr.open("GET", "http://localhost:3000/localidades", true);
    xhr.send();
    $("idSpinner").style.visibility = "visible";

}


function AgregarLocalidades(localidad) {

    let opciones = $("localidad");
    let option = document.createElement("option");
    option.setAttribute("id", "loc" + localidad.id);
    option.appendChild(document.createTextNode(localidad.nombre))
    opciones.appendChild(option);
}


function cargaFormulario(e) {

    let formulario = $("formulario");

    fila = e.target.parentNode;

    if (fila.childNodes[0].childNodes[0].nodeValue != undefined) {

        formulario.style.visibility = "visible";

        let nombre = fila.childNodes[0].childNodes[0].nodeValue;
        let apellido = fila.childNodes[1].childNodes[0].nodeValue;
        let localidad = fila.childNodes[2].childNodes[0].nodeValue;
        let sexo = fila.childNodes[3].childNodes[0].nodeValue;


        $("txtNombre").value = nombre;
        $("txtApellido").value = apellido
        $("localidad").value = localidad;
        $("txtNombre").setAttribute("user", e.currentTarget.id.substring(7));

        if (sexo == "Male") {
            $("sexMasc").checked = true;
            $("sexFem").checked = false;
        } else {
            $("sexMasc").checked = false;
            $("sexFem").checked = true;
        }



    }

}

$("btnModificar").addEventListener("click", (e) => {

    let auxNombre = true;
    let auxApellido = true;
    let auxSexo = false;
    let sexo;

    if ($("txtNombre").value.length < 4) {

        $("txtNombre").style.borderColor = "red";
        auxNombre = false;
    } else {
        $("txtNombre").style.borderColor = "green";
    }

    if ($("txtApellido").value.length < 4) {

        $("txtApellido").style.borderColor = "red";
        auxNombre = false;
    } else {
        $("txtApellido").style.borderColor = "green";
    }

    if ($("sexMasc").checked || $("sexFem").checked) {
        if ($("sexMasc").checked) {
            sexo = "Masculino";
        } else {
            sexo = "Femenino";
        }
        auxSexo = true;
    }

    if (auxNombre && auxApellido && auxSexo) {

        let id = $("txtNombre").getAttribute("user");
        let nombre = $("txtNombre").value;
        let apellido = $("txtApellido").value;
        let localidad = $("localidad").value;
        let idLocalidad;

        localidades.map(function (item) {
            if (item.nombre == localidad) {
                idLocalidad = item.id;
            };
        })


        let jsonPersona = { "id": id, "nombre": nombre, "apellido": apellido, "localidad": { "id": idLocalidad, "nombre": localidad }, "sexo": sexo, "imagen": "" }

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (xhr.status == 200 && xhr.readyState == 4) {
                $("idSpinner").style.visibility = "hidden";

                fila.childNodes[0].childNodes[0].nodeValue = nombre;
                fila.childNodes[1].childNodes[0].nodeValue = apellido;
                fila.childNodes[2].childNodes[0].nodeValue = localidad;
                fila.childNodes[3].childNodes[0].nodeValue = sexo;

            }
        }

        xhr.open("POST", "http://localhost:3000/editar");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(jsonPersona));

        $("idSpinner").style.visibility = "visible";
    }

});

function FallaPeticion(){
    console.log("falla de conexion");
}

$("btnCerrar").addEventListener("click", () => {
    $("formulario").style.visibility = "hidden";
});



window.addEventListener("load", CargarEntidades);
window.addEventListener("load", CargarLocalidades);

