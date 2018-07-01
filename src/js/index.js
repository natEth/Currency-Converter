import currencyService from './CurrencyService'
import { TO_CURRENCY_VALUE_INPUT_ID, FROM_CURRENCY_SELECT_ID, TO_CURRENCY_SELECT_ID, CONVERT_BUTTON_ID, FROM_CURRENCY_VALUE_INPUT_ID } from './config'
import domHelper from './DomHelper'

function fetchingListOfCurrencies(){
     //TODO: show loading screen..
}

function listOfCurrenciesFetched(currencies){
    let selectOptions = {
        data: currencies.sort((c1, c2) => c1.currencyName.trim() > c2.currencyName.trim()),
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

function trackInstalling(serviceWorker){
    serviceWorker.addEventListener('statechange', function(){
        //just update no need to bother the user now
        if(serviceWorker.state == 'installed')
            serviceWorker.postMessage({action: 'skipWaiting'})
    })
}

function registerServiceWorker(){
    if(navigator.serviceWorker){
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
                .then(function(reg){
                       
                      if(!navigator.serviceWorker.controller)
                        return

                        //just update no need to bother the user now
                        if(reg.waiting){
                            reg.waiting.postMessage({action: 'skipWaiting'})
                            return
                        }
                          

                      if(reg.installing){
                          trackInstalling(reg.installing)
                          return
                      }

                      reg.addEventListener('updatefound' , () => {
                        trackInstalling(reg.installing)
                      });
                          
                
                }).catch(error => console.error(`Service worker failed with error: ${error}`));
        
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        })

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
