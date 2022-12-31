const label = document.querySelector('.test');
const input = document.getElementById('title');

input.addEventListener('focus', (e)=>{
     if (e) {
        label.classList.add('color');
     } 
});

window.addEventListener('click', (event)=>{
    if (!event.target.matches('#title')) {
        label.classList.remove('color');
    } 
});

// For when input is entered

input.onchange = (e)=>{
    console.log(e.target.value);
    if (e.target.value !== '') {
        input.classList.add('on-input');
    } 
    else {
        input.classList.remove('on-input')
    }
};
