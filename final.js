/* Crear un website donde puedan ver información sobre datos obtenidos de internet que constará de al menos 3 páginas, una página "Acerca de", una página de búsqueda, y una página principal. Las características deberán ser: 
En el menú de navegación tiene que distinguirse la página actual.
La página de búsqueda tendrá un formulario para realizar búsquedas. Al realizar la búsqueda se mostrarán los resultados y el usuario tendrá la posibilidad de indicar qué le gusta. Hacer esto añadirá esos datos a una lista de preferencias del usuario, que será visible al volver a entrar en la página.
Todas las páginas deberán utilizar el mismo archivo CSS para sus estilos.
La página deberá ser responsiva y contar con al menos dos layouts distintos (uno móvil y uno de escritorio).

Requisitos mínimos del proyecto modular:
Hacer mock-up.
Uso semántico del HTML para indicar las distintas partes de cada una de las páginas.
Clara separación entre el contenido y los elementos de estilo (HTML y CSS).
Uso de fetch para obtener información de una API web.
Indicación de error al usuario en caso de fallo en la llamada a la API.
Uso de LocalStorage para guardar la información en el navegador.
Uso de JavaScript  para seleccionar los objetos que queremos guardar en el localStorage. */

//--------------------CÓDIGO EXTERNO--------------------
//fuente para la sidebar: https://www.youtube.com/watch?v=xJnxe3diEoo- 
let togBt = document.querySelector('.toggle-button');

togBt.addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('active');
});

/* Fuente para manejar el error de la API: https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
Si la respuesta es OK, devuelv el JSON, si no devuelve error */
//FUNCIÓN MANEJAR RESPUESTA
function handleResponse(response) {
    return response.json()
        .then((json) => {
            if (!response.ok) {
                const error = Object.assign({}, json, {
                    status: response.status,
                    statusText: response.statusText,
                });

                return Promise.reject(error);
            }
            return json;
        });
}
//--------------------CÓDIGO PROPIO--------------------
//muesrta todos los elementos de la opción que selecciona el usuario
function allFromCategory (){
    if (localStorage.getItem('dataZelda')!=null){
        data = JSON.parse(localStorage.getItem('dataZelda'));
        let catSelect=document.getElementById("selectCategory").value;
            let catObject; //array con todos los elementos de una categoría
            
            if(catSelect=="creatures-food"){
                catObject=data.data.creatures.food;
            }
            else if(catSelect=="creatures-non-food"){
                catObject=data.data.creatures.non_food;
            }
            else{
                catObject=data.data[catSelect];
            }
            document.getElementById("templateCard").innerHTML="";
        //aquí recorremos todos los elementos de la categoría y los mostramos con la función "tempateCard"
        for (let i=0;i<catObject.length;i++){
            templateCard(i, catObject[i]);
        }

    }
    else{
    fetch('https://botw-compendium.herokuapp.com/api/v2').then(handleResponse)
        .then(function cogerData(data){
            let catSelect=document.getElementById("selectCategory").value;
            let catObject;
            
            if(catSelect=="creatures-food"){
                catObject=data.data.creatures.food;
            }
            else if(catSelect=="creatures-non-food"){
                catObject=data.data.creatures.non_food;
            }
            else{
                catObject=data.data[catSelect];
            }
            document.getElementById("templateCard").innerHTML="";
        for (let i=0;i<catObject.length;i++){
            templateCard(i, catObject[i]);
        }
    localStorage.setItem('dataZelda',JSON.stringify(data));
}).catch(error => {

    // This error object will have the error from the server
    // As well as the two additions we made earlier of the status and statusText
    
    document.getElementById("templateCard").innerHTML=`<div class=errDiv><h1>${error}</h1><h2>Try it again later. Ganon is waiting for you!!</h2></div>`;
})
    }

};
//función que muestra un elemento de la búsqueda
function templateCard(id, objeto){
//creamos un div y le damos forma, introducimos los datos comunes a todas las categorías (nombre, imagen y icono like)
document.getElementById("templateCard").innerHTML+="<div class=card id="+id+"></div>";
document.getElementById("templateCard").style.margin="10px";
document.getElementById("templateCard").style.marginBottom="10px";
document.getElementById("templateCard").style.fontFamily="fantasy";
document.getElementById("templateCard").style.color="#624e29";
//en el nombre del item añadimos un icono para guardar ese elemento en favoritos, el icono llama una función "addFav"
document.getElementById(id).innerHTML+="<div class=className><h1>"+objeto.name+"</h1><img onclick='addFav("+id+")' src='./img/h3.png' alt='heartLike'></div>";
document.getElementById(id).innerHTML+=`<img src=${objeto.image} alt="zelda objet">`;
//como alguna elementos la localización en la API es null, hacemos este condicional
if(objeto.common_locations!=null){
    document.getElementById(id).innerHTML+=("<p><b>Locations: </b> "+objeto.common_locations+"</p>").replace(",",", ");}
//cada categoría tiene información específica, así que dependiendo de la categoría del objeto añadimos unas cosas u otras al div
let catSelect= document.getElementById("selectCategory").value;
switch(catSelect){
    case `creatures-food`:
        document.getElementById(id).innerHTML+="<p><b>Cooking effect: </b>"+objeto.cooking_effect+"</p>";
        document.getElementById(id).style.background="#fbeddfb2";
        document.getElementById(id).style.border="solid #c58f99";            
        break;
    case `creatures-non-food`:
        document.getElementById(id).innerHTML+=("<p><b>Drop: </b>"+objeto.drops+"</p>").replace(",",", ");
        document.getElementById(id).style.background="#fbeddfb2";
        document.getElementById(id).style.border="solid #2b4173";
        break;
    case `equipment`:
        document.getElementById(id).innerHTML+="<p><b>Attack: </b>"+objeto.attack+"</p>";
        document.getElementById(id).innerHTML+="<p><b>Defense: </b>"+objeto.defense+"</p>";
        document.getElementById(id).style.background="#fbeddfb2";
        document.getElementById(id).style.border="solid #471f18";
        break;
    case `materials`:
        document.getElementById(id).innerHTML+="<p><b>Cooking effect: </b>"+objeto.cooking_effect+"</p>";
        document.getElementById(id).innerHTML+="<p><b>Hearts recovered: </b>"+objeto.hearts_recovered+"</p>";
        document.getElementById(id).style.background="#fbeddfb2";
        document.getElementById(id).style.border="solid #4c94b4";
        break;
    case `monsters`:
        document.getElementById(id).innerHTML+=("<p><b>Drop: </b>"+objeto.drops+"</p>").replace(",",", ");
        document.getElementById(id).style.background="#fbeddfb2";
        document.getElementById(id).style.border="solid #5a4c84";
        break;
    case `treasure`:
        document.getElementById(id).innerHTML+=("<p><b>Drop: </b>"+objeto.drops+"</p>").replace(",",", ");
        document.getElementById(id).style.background="#fbeddfb2";
        document.getElementById(id).style.border="solid #ba9b63";
        break;
    default: 
}
//finalemente añadimos la descripción general que comparten todos los elementos
document.getElementById(id).innerHTML+="<p>"+objeto.description+"</p>";

}
//FUNCIÓN FILTRO PARA BUSCAR POR CATEGORÍA Y FILTRAR POR NOMBRE, LOCALIZACIÓN Y DESCRIPCIÓN
function searchByCategory (tipo){ 
    //primero comprobamos si los datos están LS
    if (localStorage.getItem('dataZelda')!=null){
        //desde LS cogemos los elementos del atributo dataZelda
        data = JSON.parse(localStorage.getItem('dataZelda'))
        //leemos la categoría que ha elegido el usuario a través del valor del select
        let catSelect=document.getElementById("selectCategory").value;

            let catObject;
            //hacemos este condicional debido a la estructura de la API
            if(catSelect=="creatures-food"){
                catObject=data.data.creatures.food;
            }
            else if(catSelect=="creatures-non-food"){
                catObject=data.data.creatures.non_food;
            }
            else{
                catObject=data.data[catSelect];
            }
            //inicializamos el div de búsqueda cada vez que llamamos a la función
            document.getElementById("templateCard").innerHTML="";
    //condicional para filtrar por nombre, localización y descripción
    switch(tipo){
        case `name`:
            searchByName(catObject);
            break;
        case `location`:
            searchByLoc(catObject);
            break;
        case `description`:
            searchByDes(catObject);
            break;
        default:

    }
}   //si los datos no están en el LS haremos la llamada a la api
    else{
    //llamamos a la api para recoger una respuesta, si hay error se activará la función "handleResponse"
    fetch('https://botw-compendium.herokuapp.com/api/v2').then(handleResponse)
        .then(function cogerData(data){ //data pasa a ser el json

            let catSelect=document.getElementById("selectCategory").value;
            let catObject;
            
            if(catSelect=="creatures-food"){
                catObject=data.data.creatures.food;
            }
            else if(catSelect=="creatures-non-food"){
                catObject=data.data.creatures.non_food;
            }
            else{
                catObject=data.data[catSelect];
            }
            document.getElementById("templateCard").innerHTML="";

    switch(tipo){
        case `name`:
            searchByName(catObject);
            break;
        case `location`:
            searchByLoc(catObject);
            break;
        case `description`:
            searchByDes(catObject);
            break;
        default:  
    }
    //aquí guardamos los datos en el LS
    localStorage.setItem('dataZelda',JSON.stringify(data));
}).catch(error => {// Fuente para manejar el error de la API: https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91

    // This error object will have the error from the server
    // As well as the two additions we made earlier of the status and statusText

    document.getElementById("templateCard").innerHTML=error; //mostramos el error en la página
})
    }
}
//funciones de filtro
    function searchByName(lista){
        buscar=document.getElementById("searchNam").value;
        let prueba=false;
        //busca en toda la array si coninciden los carácteres
        for (let i=0;i<lista.length;i++){
            //si coinciden, llama al a función que muestre el resultado
            if(lista[i].name.toLowerCase().includes(buscar.toLowerCase())){
                templateCard(i,lista[i])
                prueba=true;
            }
        }
        if (prueba==false){
            document.getElementById("templateCard").innerHTML=`<div class=errDiv><h2>No items with typed name, please try again</h2></div>`;
        }
        
    }

    function searchByLoc(lista){
        buscar=document.getElementById("searchLoc").value;
        let prueba=false;
        
        for (let i=0;i<lista.length;i++){
            if(lista[i].common_locations!=null){
                for(let j=0;j<lista[i].common_locations.length;j++){
                    if(lista[i].common_locations[j].toLowerCase().includes(buscar.toLowerCase())){
                        templateCard(i,lista[i])
                        prueba=true;
                        break;}
                }           
                }
            } 
            if (prueba==false){
                document.getElementById("templateCard").innerHTML=`<div class=errDiv><h2>No items with typed location, please try again</h2></div>`;
            }
    }

    function searchByDes(lista){
        buscar=document.getElementById("searchDes").value;
        let prueba=false;
        for (let i=0;i<lista.length;i++){
            if(lista[i].description.toLowerCase().includes(buscar.toLowerCase())){
                templateCard(i,lista[i])
                prueba=true;}
        }
        if (prueba==false){
            document.getElementById("templateCard").innerHTML=`<div class=errDiv><h2>No items with typed description, please try again</h2></div>`;
        }    
    }


//funcition para añadir favoritos 
function addFav(id){
    let dat;
    dat=document.getElementById(id).outerHTML;
    //localStorage.setItem('favs',dat)
    localStorage.favs+=dat;
}
//función que resetea los elementos favoritos de la página principal
function resetFav(){
    localStorage.favs="";
    location.reload();//recarga la página cunado el usuario quiere resetear los favoritos -- https://tutobasico.com/actualizar-javascript/
}
//código que se ejecutará siempre al cargar la página. Comprueba si favs contiene elementos y si los tiene, los muestra
if (localStorage.getItem('favs')!=null){document.getElementById('templateFavs').innerHTML+=localStorage.getItem('favs');
}
else{localStorage.favs=""; //si no existe fav, lo inicializamos a un string vacío para después poder añadir favs
}


