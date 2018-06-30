import { LIST_CURRENCIES_API_URL, CONVERT_CURRENCIES_API_URL, COMPACT_QUEARY_PARAM } from './config';
import Currency from './Currency';
import localStorageService from './LocalStorageService';


const ONE_HOUR_IN_MS = 60 * 60 * 1000;

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
        let reverseConversionQuery = `${toCurrency}_${fromCurrency}`
        
        return localStorageService.findConversionRate(conversionQuery).then(currency =>{
                //b/c the server refreshes prices every one hour
                if(currency && (new Date().getTime() - currency.dateCreated) < ONE_HOUR_IN_MS)
                    return currency.rate * currentValue
                 
                return this.convertCurrenciesFromRemote(conversionQuery, reverseConversionQuery, currentValue)
        })

    }

    static convertCurrenciesFromRemote(conversionQuery, reverseConversionQuery, currentValue){
        let requestUrl = `${CONVERT_CURRENCIES_API_URL}?q=${conversionQuery},${reverseConversionQuery}&${COMPACT_QUEARY_PARAM}`

        return fetch(requestUrl)
                .then(response => response.json())
                .then(json => {
                    localStorageService.saveConversionRate(conversionQuery, json[conversionQuery])
                    localStorageService.saveConversionRate(reverseConversionQuery, json[reverseConversionQuery])

                    let result = json[conversionQuery]
                    return result * currentValue
                })
    }
}