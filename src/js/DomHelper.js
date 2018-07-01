
export default class DomHelper {
    static getElementById(id){
        return document.getElementById(id);
    }
    
    static createElement(type){
        return document.createElement(type);
    }
    
    static addOnClickEventListener(element, listener){
        element.onclick = listener
    }
    
    static getInputValue(element){
        return element.value
    }
    
    static setInputValue(element, value){
        element.value = value
    }
    
    static populateSelectInput(element, options){
        let {data, textKey, valueKey, clearOptions} = options
        
        if(clearOptions === true)
            element.innerHTML = ''

        Object.values(data).forEach((datum) => {
            var opt = this.createElement('option');
            opt.value = datum[valueKey];
            opt.innerHTML = datum[textKey];
            element.appendChild(opt);
        })
    }
    
}