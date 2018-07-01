import idb from 'idb';
import {DATABASE_NAME, CURRENCIES_STORE_NAME, CONVERSION_RATES_STORE_NAME,
        IDB_TRANSACTION_TYPE_READ_WRITE, IDB_TRANSACTION_TYPE_READ_ONLY } from './config';

export default class LocalStorageService {
    
    static open(){
         return idb.open(DATABASE_NAME, 1, upgradeDB => {
            //TODO: use key path
            switch (upgradeDB.oldVersion) {
              case 0:
                upgradeDB.createObjectStore(CURRENCIES_STORE_NAME, {keyPath: 'id'});
                upgradeDB.createObjectStore(CONVERSION_RATES_STORE_NAME);
                   
            }
        })
    }

    static saveCurrency(currency, db = null){
         
        return (db ? db : this.open()).then(db => {
                let tx = db.transaction(CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_WRITE)
                let currencyStore = tx.objectStore(CURRENCIES_STORE_NAME)
                currencyStore.put(currency)
                return tx.complete
            })
    }

    static getAllCurrencies(db = null){
        
        return (db ? db : this.open()).then(db => {
            let tx = db.transaction(CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_ONLY)
            let currencyStore = tx.objectStore(CURRENCIES_STORE_NAME)
            return currencyStore.getAll();
        })
    }

    static saveConversionRate(coversionString, conversionRate, db = null){
        
        return (db ? db : this.open()).then(db => {
                let tx = db.transaction(CONVERSION_RATES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_WRITE)
                let conversionStore = tx.objectStore(CONVERSION_RATES_STORE_NAME)

                let conversionDbObject = {dateCreated: new Date(), rate: conversionRate, id: coversionString}
                conversionStore.put(conversionDbObject, conversionDbObject.id)

                return tx.complete
            })
    }

    static findConversionRate(coversionString, db = null){
        
        return (db ? db : this.open()).then(db => {
                let tx = db.transaction(CONVERSION_RATES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_ONLY)
                let conversionStore = tx.objectStore(CONVERSION_RATES_STORE_NAME)

                return conversionStore.get(coversionString)
            })
    }
}