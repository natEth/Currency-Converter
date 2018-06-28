import idb from 'idb';
import {DATABASE_NAME, CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_WRITE, IDB_TRANSACTION_TYPE_READ_ONLY } from './config';

let dbPromise

export default class LocalStorageService {
    
    static initalize(){
         dbPromise = idb.open(DATABASE_NAME, 1, upgradeDB => {
            switch (upgradeDB.oldVersion) {
              case 0:
                upgradeDB.createObjectStore(CURRENCIES_STORE_NAME);
            }
          })

        return dbPromise;
    }

    static saveCurrency(currency){
        if(!dbPromise){
            let errorMessage = 'LocalStorageService.initalize should be called before any db operation'
            console.error(errorMessage);
            //TODO: is it the best apporach
            return new Promise((resolve, reject) => reject(errorMessage))
        }

        return dbPromise.then(db => {
                let tx = db.transaction(CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_WRITE)
                let currencyStore = tx.objectStore(CURRENCIES_STORE_NAME)
                currencyStore.put(currency, currency.id)
                return tx.complete
            })
    }

    static getAllCurrencies(){
        if(!dbPromise){
            let errorMessage = 'LocalStorageService.initalize should be called before any db operation'
            console.error(errorMessage);
            //TODO: is it the best apporach
            return new Promise((resolve, reject) => reject(errorMessage))
        }

        return dbPromise.then(db => {
            let tx = db.transaction(CURRENCIES_STORE_NAME, IDB_TRANSACTION_TYPE_READ_ONLY)
            let currencyStore = tx.objectStore(CURRENCIES_STORE_NAME)
            return currencyStore.getAll();
        })
    }
}