
import { LIST_CURRENCIES_API_URL, CONVERT_CURRENCIES_API_URL } from './config'
import Currency from './Currency'

export default class CurrencyService {
    
    static getListOfCurrencies(){
        return new Promise((resolve, reject) => {
            fetch(LIST_CURRENCIES_API_URL).then((fetchResponse) => {
                return fetchResponse.json()
            })
            .catch((error) => reject(error))
            .then(json => {
                let results = []
                
                Object.values(json.results).forEach((value) => {
                    //TODO: find out if this is the best way to pass currencies
                     results.push(new Currency(value.id, value.currencySymbol, value.currencyName))
                })
                resolve(results)
            })
            .catch(error => reject(error))
        })
    }

    static convert(fromCurrency, toCurrency, currentValue){
       
        let conversionKey = `${fromCurrency}_${toCurrency}`

        let requestUrl = `${CONVERT_CURRENCIES_API_URL}?q=${conversionKey}`

        return new Promise((resolve, reject) => {
            fetch(requestUrl)
                .then(response => response.json() )
                .catch(error => reject(error))
                .then(json => {
                    let result = parseFloat(json.results[conversionKey].val)
                    resolve(result)
                })
                .catch(error => reject(error))
        })
    }
}