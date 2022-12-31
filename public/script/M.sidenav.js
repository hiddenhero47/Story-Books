
const menuBtn = document.querySelector('.hamburger');
const menu = document.querySelector('.mobile-demo');
const overLay = document.querySelector('.over-lay');

let showMenu = false;
let bee = false;
menuBtn.addEventListener('click', toggleMenu);

    function toggleMenu() {
        if (!showMenu) {
            menu.classList.add('show');
            overLay.classList.add('show');
            showMenu = true;

        } else {
            menu.classList.remove('show');
            overLay.classList.remove('show');
            showMenu = false;
        }
    }

    window.addEventListener('click', closeMenu);
    function closeMenu(event) {
        const iconPath = event.composedPath();
        for (let i = 0; i <= iconPath.length-3; i++) {
            if (iconPath[i].classList.contains('hamburger')) {
                bee = true;
            }
        }
        if (!event.target.matches('.mobile-demo') && !bee) {
            menu.classList.remove('show');
            overLay.classList.remove('show');
            showMenu = false;
        } 
        if (showMenu) {
            bee = false;
        }
    }