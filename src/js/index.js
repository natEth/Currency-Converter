import currencyService from './CurrencyService'
import { TO_CURRENCY_VALUE_INPUT_ID, FROM_CURRENCY_SELECT_ID, TO_CURRENCY_SELECT_ID, CONVERT_BUTTON_ID, FROM_CURRENCY_VALUE_INPUT_ID } from './config'


//TODO: START: abastract out to dom related class
function getElementById(id){
    return document.getElementById(id);
}

function createElement(type){
    return document.createElement(type);
}

function addOnClickEventListener(element, listener){
    element.onclick = listener
}

function getInputValue(element){
    return element.value
}

function setInputValue(element, value){
    element.value = value
}

function populateSelectInput(element, data, optionName, valueName){
    Object.values(data).forEach((datum) => {
        var opt = createElement('option');
        opt.value = datum[optionName];
        opt.innerHTML = datum[valueName];
        element.appendChild(opt);
    })
}

//END: abastract out to dom related class

function fetchingListOfCurrencies(){
     //TODO: show loading screen..
}

function listOfCurrenciesFetched(currencies){
    populateSelectInput(getElementById(FROM_CURRENCY_SELECT_ID), currencies, 'id', 'currencyName')
    populateSelectInput(getElementById(TO_CURRENCY_SELECT_ID), currencies, 'id', 'currencyName')
}

function getListOfCurrenciesFailed(error){
        //TODO: handle this
}


function registerServiceWorker(){
    if(navigator.serviceWorker){
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
                .then(reg => console.log(`Service worker registration successful with scope: ${reg.scope}`))
                .catch(error => console.log(`Service worker failed with error: ${error}`));
     }
}

//fetch list of currencies
function main(){
    fetchingListOfCurrencies();

    currencyService.getListOfCurrencies()
            .then(currencies => listOfCurrenciesFetched(currencies))
            .catch(error => getListOfCurrenciesFailed(error));
    
    
    addOnClickEventListener(getElementById(CONVERT_BUTTON_ID), () => {
        let fromCurrency = getInputValue(getElementById(FROM_CURRENCY_SELECT_ID))
        let toCurrency = getInputValue(getElementById(TO_CURRENCY_SELECT_ID))
        let currentValue = getInputValue(getElementById(FROM_CURRENCY_VALUE_INPUT_ID))
    
        currencyService.convert(fromCurrency, toCurrency, currentValue)
            .then(result => setInputValue(getElementById(TO_CURRENCY_VALUE_INPUT_ID), result))
            .catch(error => { console.log()/*TODO: handle error*/})
    })
    
    registerServiceWorker()
}

main();
