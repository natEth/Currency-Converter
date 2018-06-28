import { LIST_CURRENCIES_API_URL, CONVERT_CURRENCIES_API_URL } from './config';
import Currency from './Currency';
import localStorageService from './LocalStorageService';


export default class CurrencyService {
    
    static getListOfCurrencies(){
        return localStorageService.getAllCurrencies().then(currencies => {
            if(currencies && 0 !== currencies.length)
                return new Promise(resolve => resolve(currencies)) //TODO: again is this the best way to do this

            return this.fetchCurrenciesFromRemote()
        })
    }

    static fetchCurrenciesFromRemote(){
        return fetch(LIST_CURRENCIES_API_URL)
                    .then((fetchResponse) =>  fetchResponse.json())
                    .then(json => {
                        let results = []
                        
                        Object.values(json.results).forEach((value) => {
                            //TODO: find out if this is the best way to pass currencies (we could pass them as is)
                            let currency = new Currency(value.id, value.currencySymbol, value.currencyName);
                            localStorageService.saveCurrency(currency);
                            results.push(currency);
                        })
                        return results;
                    });
    }

    static convert(fromCurrency, toCurrency, currentValue){
       
        let conversionQuery = `${fromCurrency}_${toCurrency}`

        let requestUrl = `${CONVERT_CURRENCIES_API_URL}?q=${conversionQuery}`

        return fetch(requestUrl)
                .then(response => response.json())
                .then(json => {
                    let result = parseFloat(json.results[conversionQuery].val)
                    return result * currentValue
                })
    }
}