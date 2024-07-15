function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if (evt) {  // Garante que o evento é verificado antes de usar
        evt.currentTarget.className += " active";
    }
}

// Configuração adequada para quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    openTab(null, 'Login');  // Abre a aba 'Login' por padrão quando a página carrega
});
