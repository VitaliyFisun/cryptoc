import { Marionette } from '../vendor/vendor';

export default Marionette.Object.extend({
    apiCoinsList: 'https://min-api.cryptocompare.com/data/all/coinlist',
    apiPriceList: 'https://min-api.cryptocompare.com/data/pricemultifull',
    apiHistohour: 'https://min-api.cryptocompare.com/data/histohour',
    apiHistoday: 'https://min-api.cryptocompare.com/data/histoday',

    getCoinsData() {
        return this._fetchCoins(
                (filteredCoins) => {
                    return filteredCoins;
                },
                (err) => {
                    alert(err);
                    navigator.app.exitApp();
                }
            )
            .then(
                (filteredCoins) => {
                    let qs = this._makeQueryString(filteredCoins);
                    return this._fetchRatings(qs);
                },
                (err) => {
                    alert(err);
                    navigator.app.exitApp();
                }
            )
            .then((ratings) => {
                let filteredCoins = this._getCoins();
                return this._mergeCoinsAndRatings(filteredCoins, ratings);
            })
            .then((data) => {
                return data;
            });
    },

    getDataForDayChart(fsym, type, limit) {
        return new Promise((resolve, reject) => {
            let base = type == 'day' ? this.apiHistohour : this.apiHistoday;
            let url = `${base}?fsym=${fsym}&tsym=USD&limit=${limit}`;
            $.ajax({
                    method: 'GET',
                    url: url,
                    dataType: 'json',
                    success: (resp) => {
                        if (!resp.Data) {
                            reject('Error occured');
                        }
                        let items = [];
                        resp.Data.forEach((item) => {
                            items.push(item.close);
                        });
                        resolve(items);
                    }
                })
                .fail((err) => {
                    reject('Network error!');
                    navigator.app.exitApp();
                });
        });
    },

    _fetchCoins() {
        return new Promise((resolve, reject) => {

            if (this._isCoinsFresh()) {
                resolve(this._getCoins());
            } else {

                $.ajax({
                        method: 'GET',
                        url: this.apiCoinsList,
                        dataType: 'json',
                        success: (resp) => {
                            if (!resp.Data) {
                                reject('Error occured while trying to fetch coins list');
                            }
                            let filteredCoins = this._filterCoins(resp.Data);
                            let coins = {
                                Data: filteredCoins,
                                fetched: Date.now()
                            };
                            this._setCoins(coins);
                            resolve(filteredCoins);
                        }
                    })
                    .fail((err) => {
                        reject('Network error!');
                        navigator.app.exitApp();
                    });

            }

        });
    },


    _filterCoins(coins) {
        let arr = Object.values(coins);
        let sorteddArr = arr.sort((a, b) => {
            return a.SortOrder - b.SortOrder;
        });

        return sorteddArr.slice(0, 51);
    },

    _isCoinsFresh() {
        try {
            let coins = JSON.parse(localStorage.getItem('coins'));
            if (coins.fetched + 1000 * 60 * 60 > Date.now()) {
                return true
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    _getCoins() {
        return JSON.parse(localStorage.getItem('coins')).Data;
    },

    _setCoins(coins) {
        localStorage.setItem('coins', JSON.stringify(coins));
    },

    _makeQueryString(coins) {
        let qs = '?fsyms=';
        coins.forEach(function(coin) {
            qs += coin.Symbol + ',';
        });
        qs = qs.slice(0, qs.length - 1);
        qs += '&tsyms=USD';
        return qs;
    },

    _fetchRatings(qs) {
        return new Promise((resolve, reject) => {

            if (this._isRatingsFresh()) {
                resolve(this._getRaitings());
            } else {
                $.ajax({
                        url: this.apiPriceList + qs,
                        method: 'GET',
                        dataType: 'json',
                        success: (resp) => {
                            if (resp.Response && resp.Response == 'Error') {
                                reject('Error occured while trying to fetch exchange rates');
                            }
                            let ratings = {
                                Data: resp,
                                fetched: Date.now()
                            };
                            this._setRatings(ratings);
                            resolve(resp);
                        }
                    })
                    .fail((err) => {
                        reject('Network error!');
                        navigator.app.exitApp();
                    });
            }

        });
    },

    _isRatingsFresh() {
        try {
            let ratings = JSON.parse(localStorage.getItem('ratings'));
            if (ratings.fetched + 60 * 60 * 1000 > Date.now()) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    _getRaitings() {
        return JSON.parse(localStorage.getItem('ratings')).Data;
    },

    _setRatings(ratings) {
        localStorage.setItem('ratings', JSON.stringify(ratings));
    },

    _mergeCoinsAndRatings(coins, ratings) {
        return coins.map((coin) => {
            let convertionRating = ratings.RAW[coin.Symbol].USD.PRICE;
            return Object.assign(coin, {
                Rating: convertionRating ? convertionRating : 'N/A',
                Other: ratings.RAW[coin.Symbol].USD
            });
        });
    }
});