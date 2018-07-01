


//API
export const API_URL = 'http://localhost:3000/'
// export const API_URL = 'https://free.currencyconverterapi.com/'
export const LIST_CURRENCIES_API_URL = API_URL + 'api/v5/currencies'
export const CONVERT_CURRENCIES_API_URL = API_URL +  'api/v5/convert'
export const COMPACT_QUEARY_PARAM = 'compact=ultra'

//DOM IDS
export const FROM_CURRENCY_VALUE_INPUT_ID = 'fromCurrencyValue'
export const FROM_CURRENCY_SELECT_ID = 'fromCurrency'
export const CONVERT_BUTTON_ID = 'convert'
export const TO_CURRENCY_VALUE_INPUT_ID = 'toCurrencyValue'
export const TO_CURRENCY_SELECT_ID = 'toCurrency'


//IDB
export const DATABASE_NAME = 'currencyDB'
export const CURRENCIES_STORE_NAME = 'currencies'
export const CONVERSION_RATES_STORE_NAME = 'conversionRate'

export const IDB_TRANSACTION_TYPE_READ_ONLY = 'readonly'
export const IDB_TRANSACTION_TYPE_READ_WRITE = 'readwrite'
