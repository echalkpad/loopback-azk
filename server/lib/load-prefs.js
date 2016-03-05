'use strict';
module.exports = (data, prefs) => {
  return data.map((item) => {
    var items = prefs.filter(function (pref) {
      return item.id === pref.idTypes;
    });

    return {
      categoria: require('./strings').captalize(item.nome),
      marcas: items.map((itemPref) => itemPref.name)
    };

  });
};


