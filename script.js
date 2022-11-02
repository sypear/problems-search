const $search = document.querySelector('#search');
const $problemList = document.querySelector('#problem-list');
const $cleartBtn = document.querySelector("#clear-button");

let problmes = [];
let searchValue = null;
let searchRegExp = null;
let searchResults = [];
let levelBgColor = ['bg-blue-200', 'bg-sky-300', 'bg-green-500', 'bg-yellow-300', 'bg-rose-400', 'bg-violet-500'];
let levelTextColor = ['text-black', 'text-black', 'text-white', 'text-black', 'text-white', 'text-white'];

async function getData() {
    const response = await fetch('https://school.programmers.co.kr/api/v1/school/challenges/?page=1&perPage=20&languages[]=java&order=recent');
    const {totalPages}  = await response.json();
    
    for (let i = 1; i <= totalPages; i++) {
        let problmesResponse = await fetch(`https://school.programmers.co.kr/api/v1/school/challenges/?page=${i}&perPage=20&languages[]=java&order=recent`);
        const {result} = await problmesResponse.json();
        problmes.push(...result);
    }
}

function addItem(item) {
    const liEl = document.createElement('li');
    liEl.classList.add('border-b', 'border-stone-200', 'border-solid', 'hover:cursor-pointer', 'hover:font-bold');

    const aEl = document.createElement('a');
    aEl.classList.add('block', 'py-3', 'px-8');
    aEl.setAttribute('href', `https://school.programmers.co.kr/learn/courses/30/lessons/${item.id}`);
    aEl.setAttribute('target', '_blank');

    const strongEl = document.createElement('strong');
    strongEl.textContent = item.level;
    strongEl.classList.add(`${levelBgColor[item.level]}`, `${levelTextColor[item.level]}`, 'mr-2', 'px-1', 'text-sm');
    aEl.appendChild(strongEl);

    const spanEl = document.createElement('span');
    spanEl.textContent = item.title;
    aEl.appendChild(spanEl);

    liEl.appendChild(aEl);

    $problemList.appendChild(liEl);
}

function search() {
    searchResults = [];
    $problemList.innerHTML = '';

    if (!$search.value) {
        return;
    }

    problmes.forEach(item => {
        searchValue = event.target.value;
        searchRegExp = new RegExp(searchValue, 'g');

        if (item.title.match(searchRegExp)) {
            searchResults.push(item);
        }
    })

    searchResults.forEach(item => {
        addItem(item);
    })
}

function clear() {
    $search.value = '';
    $search.focus();
    searchResults = [];
    $problemList.innerHTML = '';
}

function init() {
    getData();
    $search.focus();
}

window.onload = init;
$search.addEventListener('keyup', search);
$cleartBtn.addEventListener('click', clear);