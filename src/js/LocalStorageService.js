import idb from 'idb';
import {DATABASE_NAME, CURRENCIES_STORE_NAME, CONVERSION_RATES_STORE_NAME,
        IDB_TRANSACTION_TYPE_READ_WRITE, IDB_TRANSACTION_TYPE_READ_ONLY } from './config';

let dbPromise

export default class LocalStorageService {
    
    static initalize(){
        //FIXME: this certainly doesn't seem like a good approach keeping the db open
         dbPromise = idb.open(DATABASE_NAME, 1, upgradeDB => {
            switch (upgradeDB.oldVersion) {
              case 0:
                upgradeDB.createObjectStore(CURRENCIES_STORE_NAME);
                upgradeDB.createObjectStore(CONVERSION_RATES_STORE_NAME);
            }
          })

        return dbPromise;
    }

    static saveCurrency(currency){
        if(!dbPromise) return this.handleDbPromiseNotInitalizedError()
        
        return dbPromise.then(db => {
                let tx = db.transaction(CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_WRITE)
                let currencyStore = tx.objectStore(CURRENCIES_STORE_NAME)
                currencyStore.put(currency, currency.id)
                return tx.complete
            })
    }

    static getAllCurrencies(){
        if(!dbPromise) if(!dbPromise) return this.handleDbPromiseNotInitalizedError()

        return dbPromise.then(db => {
            let tx = db.transaction(CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_ONLY)
            let currencyStore = tx.objectStore(CURRENCIES_STORE_NAME)
            return currencyStore.getAll();
        })
    }

    static saveConversionRate(coversionString, conversionRate){
        
        if(!dbPromise) return this.handleDbPromiseNotInitalizedError()

        return dbPromise.then(db => {
                let tx = db.transaction(CONVERSION_RATES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_WRITE)
                let conversionStore = tx.objectStore(CONVERSION_RATES_STORE_NAME)

                let conversionDbObject = {dateCreated: new Date(), rate: conversionRate, id: coversionString}
                conversionStore.put(conversionDbObject, conversionDbObject.id)

                return tx.complete
            })
    }

    static findConversionRate(coversionString){
        if(!dbPromise) return this.handleDbPromiseNotInitalizedError()

        return dbPromise.then(db => {
                let tx = db.transaction(CONVERSION_RATES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_ONLY)
                let conversionStore = tx.objectStore(CONVERSION_RATES_STORE_NAME)

                return conversionStore.get(coversionString)
            })
    }

    static handleDbPromiseNotInitalizedError(){
        
        let errorMessage = 'LocalStorageService.initalize should be called before any db operation'
        console.error(errorMessage);
        //TODO: is it the best apporach
        return new Promise((resolve, reject) => reject(errorMessage))
    }
}