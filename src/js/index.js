import currencyService from './CurrencyService'
import { TO_CURRENCY_VALUE_INPUT_ID, FROM_CURRENCY_SELECT_ID, TO_CURRENCY_SELECT_ID, CONVERT_BUTTON_ID, FROM_CURRENCY_VALUE_INPUT_ID } from './config'
import domHelper from './DomHelper'

function fetchingListOfCurrencies(){
     //TODO: show loading screen..
}

function listOfCurrenciesFetched(currencies){
    let selectOptions = {
        data: currencies.sort((c1, c2) => c1.trim().currencyName > c2.trim().currencyName),
        valueKey: 'id',
        textKey: 'currencyName',
        clearOptions: true
    }

    domHelper.populateSelectInput(domHelper.getElementById(FROM_CURRENCY_SELECT_ID), selectOptions)
    domHelper.populateSelectInput(domHelper.getElementById(TO_CURRENCY_SELECT_ID), selectOptions)
}

function getListOfCurrenciesFailed(error){
        //TODO: handle this
        console.error(`Fetch Currency list failed b/c of error: ${error}`)
}


function registerServiceWorker(){
    if(navigator.serviceWorker){
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
                .then(reg => console.log(`Service worker registration successful with scope: ${reg.scope}`))
                .catch(error => console.error(`Service worker failed with error: ${error}`));
     }
}

//fetch list of currencies
function main(){
    fetchingListOfCurrencies();

    currencyService.getListOfCurrencies()
            .then(currencies => listOfCurrenciesFetched(currencies))
            .catch(error => getListOfCurrenciesFailed(error));
    
    
    domHelper.addOnClickEventListener(domHelper.getElementById(CONVERT_BUTTON_ID), () => {
        let fromCurrency = domHelper.getInputValue(domHelper.getElementById(FROM_CURRENCY_SELECT_ID))
        let toCurrency = domHelper.getInputValue(domHelper.getElementById(TO_CURRENCY_SELECT_ID))
        let currentValue = domHelper.getInputValue(domHelper.getElementById(FROM_CURRENCY_VALUE_INPUT_ID))
    
        currencyService.convert(fromCurrency, toCurrency, currentValue)
            .then(result => domHelper.setInputValue(domHelper.getElementById(TO_CURRENCY_VALUE_INPUT_ID), result))
            .catch(error => { console.error(error);/*TODO: handle error*/})
    })
    
    registerServiceWorker()
}

main();
