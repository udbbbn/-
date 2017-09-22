/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-09-18 09:45:40
 * @version $Id$
 */

console.log('your.js: time=' + Date.parse(new Date()));

function myAlert(msg) {
	console.log('alert at ' + Date.parse(new Date()));
	alert(msg);
}

function myLog(msg) {
	console.log(msg);
}