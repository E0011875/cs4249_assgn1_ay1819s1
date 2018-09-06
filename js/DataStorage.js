var DataStorage = (function () {
    var module = {};
    
    module.setItem = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    module.getItem = function (key) {
        return JSON.parse(localStorage.getItem(key));
    }

    module.removeAllItem = function () {
        localStorage.clear();
    }

    return module;
})();
