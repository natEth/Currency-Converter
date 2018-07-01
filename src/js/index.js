import currencyService from './CurrencyService'
import { ROOT_PATH} from './config'
import domHelper from './DomHelper'

//DOM IDS
export const FROM_CURRENCY_VALUE_INPUT_ID = 'fromCurrencyValue'
export const FROM_CURRENCY_SELECT_ID = 'fromCurrency'
export const CONVERT_BUTTON_ID = 'convert'
export const TO_CURRENCY_VALUE_INPUT_ID = 'toCurrencyValue'
export const TO_CURRENCY_SELECT_ID = 'toCurrency'
export const C_CONVERT_ERROR_MESSAGE_CONTAINER = 'convertErrorMessageContainer'
export const ID_CONVERT_ERROR_MESSAGE = 'convertErrorMessage'
export const ID_DATE_UPDATED = 'dateUpdated'

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
        navigator.serviceWorker.register(`/${ROOT_PATH}/sw.js`, {scope: `/${ROOT_PATH}/`})
                .then(function(reg){
                       
                      if(!navigator.serviceWorker.controller)
                        return

                        //just update no need to bother the user at this stage
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
            .then(result => {
                if(result.error){
                    // domHelper.getElementById(I_CONVERT_ERROR_MESSAGE).innerHTML = result.errorMessage
                    console.error(result.errorMessage);/*TODO: handle error*/
                    domHelper.setInputValue(domHelper.getElementById(TO_CURRENCY_VALUE_INPUT_ID), null)
                    return
                }
                
                domHelper.setInputValue(domHelper.getElementById(TO_CURRENCY_VALUE_INPUT_ID), result.value)
                domHelper.setText(domHelper.getElementById(ID_DATE_UPDATED), result.dateCreated && result.dateCreated.toLocaleString())
            })
    })
    
    registerServiceWorker()
}

main();
