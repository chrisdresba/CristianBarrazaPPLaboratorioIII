function $(valorId) {
    return document.getElementById(valorId);
}

function construirTabla(persona) {

    let tabla = $("tabla");

    let fila = document.createElement("tr");
    fila.setAttribute("id", "fila" + persona.id);
    let celda = document.createElement("td");
    celda.appendChild(document.createTextNode(persona.nombre))
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.appendChild(document.createTextNode(persona.apellido))
    fila.appendChild(celda);
    celda = document.createElement("td");
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


function CargarLocalidades(){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.status == 200 && this.readyState == 4) {
            $("idSpinner").style.visibility = "hidden";  
            let localidades = JSON.parse(xhr.responseText);

            localidades.map(function (item) {
                AgregarLocalidades(item);
            })

        }
    }

    xhr.open("GET", "http://localhost:3000/localidades", true);
    xhr.send();
    $("idSpinner").style.visibility = "visible";  

}


function AgregarLocalidades(localidad){
    
    let opciones = $("localidad");
    let option = document.createElement("option");
    option.setAttribute("value", option);
    option.setAttribute("id", localidad.id);
    option.appendChild(document.createTextNode(localidad.nombre))
    opciones.appendChild(option);
}

function cargaFormulario(e) {

    let formulario = $("formulario");
    formulario.style.visibility = "visible";
    CargarLocalidades();

    let fila = e.target.parentNode;
    let nombre = fila.childNodes[0].childNodes[0].nodeValue;
    let apellido = fila.childNodes[1].childNodes[0].nodeValue;
    let localidad = fila.childNodes[2].childNodes[0].nodeValue;
    let sexo = fila.childNodes[3].childNodes[0].nodeValue;



    $("txtNombre").value = nombre;
    $("txtApellido").value = apellido
    $("localidad").value = localidad;


    if (sexo == "Male") {
        $("sexMasc").checked = true;
        $("sexFem").checked = false;
    } else {
        $("sexMasc").checked = false;
        $("sexFem").checked = true;
    }

}

$("btnModificar").addEventListener("click", () => {

    let auxNombre = true;
    let auxApellido = true;
    let auxSexo = false;
    let sexo;

    if ($("txtNombre").value.length < 4) {

        $("txtNombre").style.borderColor = "red";
        auxNombre = false;
    }else{
        $("txtNombre").style.borderColor = "green";
    }

    if ($("txtApellido").value.length < 4) {

        $("txtApellido").style.borderColor = "red";
        auxNombre = false;
    }else{
        $("txtApellido").style.borderColor = "green";
    }

    if ($("sexMasc").checked || $("sexMasc").checked) {
        if ($("sexMasc").checked) {
            sexo = "Masculino";
        } else {
            sexo = "Femenino";
        }
        auxSexo = true;
    }

    if (auxNombre && auxApellido && auxSexo) {

        let nombre = $("txtNombre").value;
        let apellido = $("txtApellido").value;
        let localidad = $("localidad").value;

        let jsonPersona = { "id": id, "nombre": nombre, "apellido": apellido, "localidad": {"id": 17,"nombre":localidad}, "sexo": sexo ,"imagen": ""}

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



$("btnCerrar").addEventListener("click", () => {
    $("formulario").style.visibility = "hidden";
});



window.addEventListener("load", CargarEntidades);