//@ts-check

/**
 * Funcion que crea un effecto de scroll añadiendo o eliminando el color de fondo de la barra de navegación 
 * dependiendo de que punto en el eje Y se encuentre el scroll
 * @function effectScrollNav
 * @param {object} nav elemento que adquiere la barra de navegación
 * @param {object} togglerBtn elemento que adquiere el boton de despliegue de la barra de navegación en modo responsive
 */
function effectScrollNav() {
    let nav = document.querySelector('nav');
    let togglerBtn = document.querySelector('.navbar-toggler');
    togglerBtn.addEventListener('click', function(){
        if(!togglerBtn.classList.contains('collapsed')){
            nav.classList.add('bg-primary', 'shadow');
        }else if(togglerBtn.classList.contains('collapsed') && window.pageYOffset == 0){
            nav.classList.remove('bg-primary', 'shadow');
        }
    })  
    window.addEventListener("scroll", function(){
        if(window.pageYOffset > 580 ){
            nav.classList.add('bg-primary', 'shadow');
        }else if(window.pageYOffset == 0){
            nav.classList.remove('bg-primary', 'shadow');
        }
    })
        
}

effectScrollNav();





    



