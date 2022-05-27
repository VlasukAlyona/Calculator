const DAY_STRING = ['день', 'дня', 'дней'];

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [[2, 7], [3, 10], [7, 14]],
    deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button');
const firstScreen = document.querySelector('.first-screen');
const mainForm = document.querySelector('.main-form');
const formCalculate = document.querySelector('.form-calculate');
const endButton = document.querySelector('.end-button');
const total = document.querySelector('.total');
const fastRange = document.querySelector('.fast-range');
const totalPriceSum = document.querySelector('.total_price__sum');
const adapt = document.getElementById('adapt');
const adaptValue = document.querySelector('.adapt_value');
const mobileTemplates = document.getElementById('mobileTemplates');
const mobileTemplatesValue = document.querySelector('.mobileTemplates_value');
const typeSite = document.querySelector('.type-site');
const maxDeadline = document.querySelector('.max-deadline');
const rangeDeadline = document.querySelector('.range-deadline');
const deadlineValue = document.querySelector('.deadline-value');
const desktopTemplates = document.getElementById('desktopTemplates');
const desktopTemplatesValue = document.querySelector('.desktopTemplates_value');
const editable = document.getElementById('editable');
const editableValue = document.querySelector('.editable_value');
const calcDescription = document.querySelector('.calc-description');
const metrikaYandex = document.getElementById('metrikaYandex');
const analyticsGoogle = document.getElementById('analyticsGoogle');
const sendOrder = document.getElementById('sendOrder');
const cardHead = document.querySelector('.card-head');
const totalPrice = document.querySelector('.total_price');
const firstFieldset = document.querySelector('.first-fieldset');

const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

function showElem(elem) {
    elem.style.display = 'block';
}

function hideElem(elem) {
    elem.style.display = 'none';
}

dopOptionsString = () => {
    let str = '';

    if(metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked){
        str += 'Подключим ';

        if(metrikaYandex.checked){
            str += 'Яндекс Метрику';

            if(analyticsGoogle.checked && sendOrder.checked){
                str += ', Гугл Аналитику и отправку заявок на почту.';
                return str;
            }

            if(analyticsGoogle.checked || sendOrder.checked){
                str += 'и ';
            }
        }

        if(analyticsGoogle.checked){
            str += 'Гугл Аналитику ';

            if(sendOrder.checked){
                str += 'и ';
            }
        }

        if(sendOrder.checked){
            str += ' отправку заявок на почту';
        }
        str += '.';
    }

    return str;
}

renderTextContent = (total, site, maxDay, minDay) => {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site} ${adapt.checked ?', адаптированный под мобильные устройства и планшеты' : ''}.
    ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.' : ''}
    ${dopOptionsString()}
    `;
}

//Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.

priceCalculation = (elem = {}) => {

    let result  = 0;
    let index = 0;
    let options = [];
    let site = '';
    let maxDeadlineDay = DATA.deadlineDay[index][1];
    let minDeadlineDay = DATA.deadlineDay[index][0];
    let overPercent = 0;

    if(elem.name === 'whichSite'){
        for( const item of formCalculate.elements){
            if(item.type === 'checkbox'){
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }

    for( const item of formCalculate.elements){
        if(item.name === 'whichSite' && item.checked){
            index = DATA.whichSite.indexOf(item.value);
            site = item.dataset.site;
            maxDeadlineDay = DATA.deadlineDay[index][1];
            minDeadlineDay = DATA.deadlineDay[index][0];
        }else if(item.classList.contains('calc-handler') && item.checked){
            options.push(item.value);
        }else if(item.classList.contains('want-faster') && item.checked){
            const overDay = maxDeadlineDay - rangeDeadline.value;
            overPercent = overDay * (DATA.deadlinePercent[index] / 100);
        }
    }

    result += DATA.price[index];

    options.forEach((key) => {
        if(typeof(DATA[key]) === 'number'){
            if(key === 'sendOrder'){
                result += DATA[key];
            }else{
                result += DATA.price[index] * DATA[key] / 100;
            }
        }else{
            if(key === 'desktopTemplates'){
                result += DATA.price[index] * DATA[key][index] / 100;
            }else{
                result += DATA[key][index];
            }
        }
    })

    result += result * overPercent;

    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
}

const handlerCallBackForm = (e) => {
    const target = e.target;

    if(adapt.checked){
        mobileTemplates.disabled = false;
    }else{
        mobileTemplates.disabled = true;
        mobileTemplates.checked = false;
    }

    if(target.classList.contains('want-faster')){
        target.checked ? showElem(fastRange) : hideElem(fastRange);
        priceCalculation(target);
    }

    if(target.classList.contains('calc-handler')){
        priceCalculation(target);
    }
}

const moveBackTotal = () => {
    if(document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200){
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPrice);
        window.addEventListener('scroll', moveTotal);
        window.removeEventListener('scroll', moveBackTotal);
    }
}

const moveTotal = () => {
    if(document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200){
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
}

startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
    window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', () => {
    for( const elem of formCalculate.elements){
        if(elem.tagName === 'FIELDSET'){
            hideElem(elem);
        }
    }

    cardHead.textContent = 'Заявка на разработку сайта';
    hideElem(totalPrice);

    showElem(total);
});

formCalculate.addEventListener('change', handlerCallBackForm);

priceCalculation();