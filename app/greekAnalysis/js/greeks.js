/**
 * This class prices options using Black-Scholes.  As an extension, it has the ability to calculate the five main greeks, delta, gamma, vega, theta and rho.  Each greek is called as \(greek_name)(Call|Put).
 * Also, I added the ability to calculate volatility using standard variance calculation and the exponentially weighted moving average model (EWMA) in time series fashion.
 *
 * This is mostly intended to be used as a library of option pricing functions.  Use it as you will though.
 *
 * @author Marcus Rosti marcus.rosti@axiosengineering.com
 * @class greeks
 * @constructor None so far.
 */

/**
 * BlackScholes calculation for puts and calls. Nothing too fancy.
 * Should operate as expected
 *
 *
 * @method BlackScholes
 * @param {String} PutCallFlag "c" for Call and "p" for Put
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} price of the Put/Call
 */
function BlackScholes(PutCallFlag, S, X, T, r, v) {

    var d1, d2;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    d2 = d1 - v * Math.sqrt(T);


    if (PutCallFlag === "c") return S * CND(d1) - X * Math.exp(-r * T) * CND(d2);
    else return X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);

}

/**
 * deltaPut Calculates the change in the price of a Put as the stock price changes
 * Think of it as the potential velocity of change in price.
 *
 * @method deltaPut
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The delta of the Put
 */
function deltaPut(S, X, T, r, v) {
    var d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    return -CND(-d1);
}

/**
 * deltaCall Calculates the change in the price of a Call as the stock price changes.
 * Think of it as the potential velocity of change in price.
 *
 * @method deltaCall
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The delta of the Call
 */
function deltaCall(S, X, T, r, v) {
    var d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    return CND(d1);
}

/**
 * gammaPut Calculates the change in the price of a Put as the square change in stock price.
 * Think of it as the potential acceleration of change in the price.
 *
 * @method gammaPut
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The gamma of the Put
 */
function gammaPut(S, X, T, r, v) {
    return gammaCall(S, X, T, r, v);
}

/**
 * gammaCall Calculates the change in the price of a Put as the square change in stock price.
 * Think of it as the potential acceleration of change in the option price.
 *
 * @method gammaCall
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The gamma of the Call
 */
function gammaCall(S, X, T, r, v) {
    var d1;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));

    return PDF(d1) / (S * v * Math.sqrt(T));
}

/**
 * vegaPut Calculates the change in the price of a Put as the change in volatility.
 * This measures the change in the option price as the variability in the prices in the market increase.
 *
 * @method vegaPut
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The vega of the Put
 */
function vegaPut(S, X, T, r, v) {
    return vegaCall(S, X, T, r, v);
}


/**
 * vegaCall Calculates the change in the price of a Call as the change in volatility.
 * This measures the change in the option price as the variability in the prices in the market increase.
 *
 * @method vegaCall
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The vega of the Call
 */
function vegaCall(S, X, T, r, v) {
    var d1;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    return S * Math.sqrt(T) * PDF(d1) / 100;
}


/**
 * rhoPut Calculates the change in the price of a option as the interest rate changes.
 *
 * @method rhoPut
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The rho of the Put
 */
function rhoPut(S, X, T, r, v) {
    var d1, d2;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    d2 = d1 - v * Math.sqrt(T);

    return -T * X * Math.exp(-r * T) * CND(-d2) / 100;
}

/**
 * rhoCall Calculates the change in the price of the option as the interest rate changes.
 *
 * @method rhoCall
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The rho of the Call
 */
function rhoCall(S, X, T, r, v) {
    var d1, d2;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    d2 = d1 - v * Math.sqrt(T);

    return T * X * Math.exp(-r * T) * CND(d2);
}

/**
 * thetaPut Calculates the change in option price as we approach expiration.
 *
 *
 * @method thetaPut
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The theta of the Put
 */
function thetaPut(S, X, T, r, v) {
    var d1, d2;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    d2 = d1 - v * Math.sqrt(T);

    var a, b, c;

    a = X * Math.exp(-r * T);
    b = r * CND(-d2);
    c = (v * PDF(d2)) / (2 * Math.sqrt(T));

    return a * (b - c) / 365;
}

/**
 * thetaCall Calculates the change in option price as we approach expiration.
 *
 *
 * @method thetaCall
 * @param {Number} S the current stock price
 * @param {Number} X the strike price
 * @param {Number} T the time to expiration as a decimal
 * @param {Number} r the current interest rate as a decimal
 * @param {Number} v the current volatility
 * @return {Number} The theta of the Call
 */
function thetaCall(S, X, T, r, v) {
    var d1, d2;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    d2 = d1 - v * Math.sqrt(T);

    var a, b, c;

    a = X * Math.exp(-r * T);
    b = r * CND(-d2);
    c = (v * PDF(d2)) / (2 * Math.sqrt(T));

    return -a * (b + c) / 365;
}


/**
 * CND calculates the cumulative normal distribution for a value X.
 * Think of it as the probability of something occuring given a standard normal value.
 *
 * @method CND
 * @param {Number} x the standard normal value
 * @return {Number} a value between 0 and 1 inclusive.  It's a probability.
 */
function CND(x) {

    //Integrate[E^(-t^2 / 2) / Sqrt(2 pi),{t,0,x}]

    var a1, a2, a3, a4, a5, k;

    a1 = 0.31938153;
    a2 = -0.356563782;
    a3 = 1.781477937;
    a4 = -1.821255978;
    a5 = 1.330274429;

    if (x < 0.0) return 1 - CND(-x);
    else k = 1.0 / (1.0 + 0.2316419 * x);
    return 1.0 - Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI) * k * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))));

}

/**
 * PDF calculates the standard normal probability for a value X.
 *
 * @method CND
 * @param {Number} x the standard normal value
 * @return {Number} a value between 0 and 1 inclusive.  It's a probability.
 */
function PDF(x) {
    // E^(-x^2 / 2) / Sqrt(2 pi)
    return  Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);

}

//--------------------------------------------------------------------------------------------------------------------


//historical data for variance calculations
//only works 50 times a day over a given network
function getHistoricalData(stock, begin) {
    var beg, end, url;
    end = new Date();


    //format ending date correctly.
    var endMon, endDay;
    endDay = end.getDate();
    endMon = end.getMonth() + 1;
    if (endDay < 10)
        endDay = "0" + endDay.toString();
    if (endMon < 10)
        endMon = "0" + endMon.toString();


    var stockPricesDesc = [];

    url = "http://www.quandl.com/api/v1/datasets/WIKI/" + stock.toUpperCase() + ".json?column=11&sort_order=des&collapse=daily&trim_start=" + begin + "&trim_end=" + end.getFullYear() + "-" + endMon + "-" + endDay;
    /*
     *   http://www.quandl.com/api/v1/datasets/WIKI/AAPL.json?column=4&sort_order=des&collapse=daily&trim_start=2013-01-01&trim_end=2014-07-21
     *   www.quandl.com/api/v1/datasets/WIKI/%stock%.json?column=4&sort_order=des&collapse=daily&trim_start=%start%&trim_end=%date.today%
     */
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlReq = new XMLHttpRequest();
    xmlReq.open("GET", url, false);
    xmlReq.send();
    var prices = JSON.parse(xmlReq.responseText);
    var priceArray = prices["data"];


    for (var i = 0; i < priceArray.length; i++)
        stockPricesDesc[i] = priceArray[i][1];

    //console.log(stockPricesDesc);

    return stockPricesDesc

}

//Calculating Volatility

/**
 * Calculates historical variance as the average change in square log returns and then extended to a yearly rate.
 *
 * @method variance_stock
 * @param {Object} stockPrices a list of historical daily prices where sP[0] = most recent, sP[Infinity-1]= least recent
 * @return {Number} returns the VARIANCES in log return of stock prices. NOT VOLATILITY!!!
 */
function variance_stock(stockPrices) {

    var logChange, logTot, numObs, sigmasq;
    numObs = stockPrices.length;
    logChange = [];
    logTot = 0;
    sigmasq = 0;

    for (var i = 1; i <= numObs - 1; i++) {
        logChange[i] = Math.log(stockPrices[i] / stockPrices[i - 1]);
    }

    for (var i = 1; i <= numObs - 1; i++) {
        sigmasq += Math.pow(logChange[i], 2);
    }
    sigmasq = 1 / (numObs - 1) * sigmasq;
    // console.log("Simple Volatility: "+Math.sqrt(sigmasq)*Math.sqrt(252));

    return sigmasq;

}

/**
 * Calculates historical volatility using the Exponentially Weighted Moving Average.
 * Think of it this way.  It calculates the volatility by weighting more recent fluctuations higher than more distant ones.
 *
 * @method EWMA
 * @param {Object} stockPrices a list of historical daily prices where sP[0] = most recent, sP[Infinity-1]= least recent
 * @param {Number} lambda a number between 0 and 1 exclusive where .01 would weight recent changes almost exclusively and .99 would weight things almost equally and weight the average variance more highly
 * @return {Number} returns the VARIANCES in log return of stock prices. NOT VOLATILITY!!!
 */
function EWMA(stockPrices, lambda) {

    var logChange, numObs, sigmasq, sigma_n;

    sigma_n = variance_stock(stockPrices);

    numObs = stockPrices.length;
    logChange = [];
    sigmasq = 0;
    for (var i = 1; i < numObs; i++) {
        logChange[i] = Math.log(stockPrices[i] / stockPrices[i - 1]);
    }
    //console.log(logChange);
    var check = 0;
    for (var i = 0; i <= numObs - 2; i++) {
        sigmasq += (1 - lambda) * Math.pow(lambda, i) * Math.pow(logChange[numObs - 1 - i], 2);
        check += (1 - lambda) * Math.pow(lambda, i);
        //console.log(i+": "+(1-lambda)*Math.pow(lambda,i));
    }
    check += Math.pow(lambda, numObs - 1);

    sigmasq += sigma_n * Math.pow(lambda, numObs);

    if (.99 > check || check > 1.01)
        console.log("Lambda is off. The weights have too high of an error.\n");

    // console.log("EWMA vol: "+Math.sqrt(sigmasq)*Math.sqrt(252));
    var v = Math.sqrt(sigmasq) * Math.sqrt(252);
    if (v > 1)
        console.log("Error in volatility.\nWARNING: there's a good chance there's a split in the stock or an error in your data.");

    return v;

}
//--------------------------------------------------------------------------------------------------------------------
//testing
//var goog = [584.87,579.18,571.10,576.08,571.09,582.25,584.73,582.34,582.67,575.28,577.24,576.00,578.65,564.62,564.95,556.36,554.90,553.37,543.01,544.28,551.76,551.35,558.84,560.55,562.12,556.33,553.90,544.66,544.94,553.93,559.89,560.08];
//var fb = [67.17,67.9,66.34,64.87,64.97,62.76,65.29,66.29,66.45,68.06,67.29,67.6,67.13,67.44,65.72,65.37,64.5,64.34,65.6,64.4,64.19,64.5,64.29,65.78,65.77,62.88,62.5,63.19,63.34,62.87,63.08,63.3];
//goog.reverse();
//fb.reverse();

//var aapl = getHistoricalData("AAPL","2014-01-01");


//var stock = 94;
//var strike = 91;
//var time = 9.0 / 252.0;
//var interestRate = .0002;
//var vol = .2732;
//console.log("Call Price: " + BlackScholes("c", stock, strike, time, interestRate, vol));
//console.log("Delta_Call: " + deltaCall(stock, strike, time, interestRate, vol));
//console.log("Gamma_Call: " + gammaCall(stock, strike, time, interestRate, vol));
//console.log("Vega_Call:  " + vegaCall(stock, strike, time, interestRate, vol));
//console.log("Theta_Call: " + thetaCall(stock, strike, time, interestRate, vol));
//console.log("Rho_Call:   " + rhoCall(stock, strike, time, interestRate, vol));
//console.log("");
//console.log("Put Price:  " + BlackScholes("p", stock, strike, time, interestRate, vol));
//console.log("Delta_Put:  " + deltaPut(stock, strike, time, interestRate, vol));
//console.log("Gamma_Put:  " + gammaPut(stock, strike, time, interestRate, vol));
//console.log("Vega_Put:   " + vegaPut(stock, strike, time, interestRate, vol));
//console.log("Theta_Put:  " + thetaPut(stock, strike, time, interestRate, vol));
//console.log("Rho_Put:    " + rhoPut(stock, strike, time, interestRate, vol));

//prices from least recent to most recent
//***These are backwards!!
// console.log("\nEWMA calc google:");
// EWMA(goog,.94);
// console.log("\nEWMA calc facebook:");
//// EWMA(fb,.94);
//console.log("");

//for (var k = 0; k < .03; k += .0001) {
//    //console.log("Call Price @"+k+": " + BlackSchlmoes("c", stock,k,time,interestRate,vol));
//    // console.log("Vega_Call: " + thetaCall(stock,strike,time,interestRate,vol));
//}


//--------------------------------------------------------------------------------------------------------------------