// Constants
const DINGUS_PRICE = 14.25;
const WIDGET_PRICE = 9.99;
const ZERO_FORMAT = '0.00';
const DEBUG = true; // Where might this flag be used? (It's not mandatory)

// Global store (What else would you need here?)
let store = {
  orderHistory : []
};

function generateEntries() {
	// Returns an orderHistory array
	// [ID#, Date, Dingus quantity, Widget quantity]
	return [
	  [1, '01/01/2020', 1, 1], 
	  [2, '01/02/2020', 2, 2]
	]
}

let orders = store.orderHistory;

function checkEmpty() {
	if (window.localStorage.getItem('orderHistory') == null) {
		return true;
	}
	else {
		store.orderHistory = JSON.parse(window.localStorage.getItem('orderHistory'))
		return false;
	}
}

function popLocalStorage(row1, row2) {
	if (localStorage.length == 0) {
		localStorage.setItem('0', row1);
		localStorage.setItem('1', row2);
	}
}

function populateInitialTable() {
	let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
	let arr = generateEntries();
	let row1 = arr[0];
	let row2 = arr[1];

	let total1 = getTotal(row1);
	let total2 = getTotal(row2);

	row1.push(total1);
	row2.push(total2);
	let i;
	let j;
	for (i = 0; i < 2; i++) {
		var newRow = table.insertRow(-1);
		for (j = 0; j < row1.length; j++) {
			var newCell1 = newRow.insertCell(j);
			newCell1.innerHTML = arr[i][j];
			console.log(newCell1.innerHTML);
		}
	}

	store['orderHistory'].push(row1);
	store['orderHistory'].push(row2);

	popLocalStorage(row1, row2);

	return;
}

function addOrder() {
	let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
	let id = table.getElementsByTagName('tr').length + 1;

	var todayDate = new Date();
	var day = String(todayDate.getDate()).padStart(2,'0');
	var month = String(todayDate.getMonth() + 1).padStart(2,'0');
	var year = todayDate.getFullYear();
	todayDate = month + '/' + day + '/' + year;

	var dingus = +(document.getElementById("dingusInput").value);
	var widget = +(document.getElementById("widgetInput").value);

	let arr = [id, todayDate, dingus, widget];
	let total = getTotal(arr);
	arr.push(total);
	let i;

	var newRow = table.insertRow(-1);

	for (i = 0; i < arr.length; i++) {
		var newCell = newRow.insertCell(i);
		newCell.innerHTML = arr[i];
	}

	store.orderHistory = store.orderHistory.concat([arr]);

	window.localStorage.setItem('orderHistory', JSON.stringify(store.orderHistory));

	adjustScores();

	return;
}

function getTotal(rowData) {
	let dingusTotal = rowData[2] * DINGUS_PRICE;
	let widgetTotal = rowData[3] * WIDGET_PRICE;
	currTotal = dingusTotal + widgetTotal;
	return +(currTotal.toFixed(2));
}

function calculate() {
	var text1 = +(document.getElementById('dingusInput').value)
	var text2 = +(document.getElementById('@1').value);
	var text3 = +(document.getElementById('widgetInput').value);
	var text4 = +(document.getElementById('@2').value);
	var topresult = document.getElementById('result');
	var botresult = document.getElementById('result2')

	var result1final = text1 * text2;
	var result2final = text3 * text4;
	topresult.value = result1final;
	botresult.value = result2final;

	var totalbox = document.getElementById('totalValue');
	total = result1final + result2final;
	roundedtotal = +(total.toFixed(2));

	totalbox.value = roundedtotal;
	return;
}

function adjustScores() {
	var widgetCount = 0;
	var dingusCount = 0;
	var totalCost = 0;
	var a;

	let orders = store.orderHistory;

	// console.log(orders);

	for (a = 0; a < orders.length; a++) {
		widgetCount += orders[a][3];
		dingusCount += orders[a][2];
		totalCost += orders[a][4];
	}

	totalCost = +(totalCost.toFixed(2));
	document.getElementById('dingusCount').textContent = dingusCount;
	document.getElementById('widgetCount').textContent = widgetCount;
	document.getElementById('totalCount').textContent = totalCost;

	// console.log(dingusCount);
	// console.log(totalCost);
	// console.log(widgetCount);

	return;
}

function adjustTable() {
	let orders = store.orderHistory;
	let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];

	var numRows = document.getElementById("myTable").getElementsByTagName("tr").length - 3;

	// console.log(orders[0]);
	// console.log(numRows);

	for (i = numRows; i < orders.length; i++) {
		var newRow = table.insertRow(-1);
		let order = orders[i];

		for (j = 0; j < order.length; j++) {
			var newCell = newRow.insertCell(j);
			newCell.innerHTML = order[j];
		}
	}
	return;
}

function setButton() {
	var x = document.getElementById("dingusInput").value;
	var y = document.getElementById("widgetInput").value;
	if (x != '0' || y != '0') {
		document.getElementById("myOrderButton").disabled = false;
	}
	return;
}

function cancelOrder() {
	document.getElementById("myForm").reset();
}

function calculatePieChart() {
	var width=450
	var height=450
	var margin=40

	var radius = Math.min(width, height) / 2 - margin;

	var numWidgets = +(document.getElementById('widgetCount').innerHTML);
	var numDinguses = +(document.getElementById('dingusCount').innerHTML);

	var totalSold = numDinguses + numWidgets;

	var widgetPercentage = (numWidgets / totalSold) * 100;
	var dingusPercentage = (numDinguses / totalSold) * 100;

	var data = {a: numWidgets, b: numDinguses};

	var color = d3.scaleOrdinal()
					.domain(data)
					.range(["#abcfe6", "#addea7"])

	var pie = d3.pie().value(function(d) {return d.value;})

	var data_ready = pie(d3.entries(data))


	var svg = d3.select("piechart")

	// svg.selectAll('whatever').data(data_ready).enter()
	// 	.append('path').attr('d', d3.arc().innerRadius(145).outerRadius(radius))
	// 	.attr('fill', function(d) {return(color(d.data.key))})
	// 	.attr("stroke","black")
	// 	.style("stroke-width", "2px")
	// 	.style("opacity", 0.7);
	
	// svg.selectAll()
	

	
	
		



	// let blueCircle = document.getElementById('donut-segment1');
	// blueCircle.style.strokeDasharray = widgetPercentage + " " + dingusPercentage;

	// let dp = document.getElementsByClassName("dingus-percentage").innerHTML
	// let wp = document.getElementsByClassName("widget-percentage").innerHTML

	return;
}

function adjustBarChart() {
	let orders = store.orderHistory;
	var myDate = orders.length - 1;
	var currDate = new Date();
	var currDates = {};
	var numDays = 7

	for (i = 0; i < numDays; i++) {
		var todayDate = (currDate.getDay() - i) % 7;
		let dingCount = 0;
		let widgCount = 0;
		let productCount = 0;

		let xlabel = document.getElementById("day" + (7-i))
		let xbar = document.getElementById((7-i) + "bar")

		for (k = myDate; k  >= 0; k--) {
			var todayDate = new Date();
			todayDate.setDate(todayDate.getDate() - i);

			var day = String(todayDate.getDate()).padStart(2,'0');
			var month = String(todayDate.getMonth() + 1).padStart(2,'0');
			var year = todayDate.getFullYear();

			todayDate = month + '/' + day + '/' + year;

			if (todayDate == orders[k][1]) {
				widgSales = orders[k][3];
				dingSales = orders[k][2];
				productCount += widgSales + dingSales;
				dingCount += dingSales;
				myDate -= 1;
			}
			else {
				break;
			}

			let topheight = (dingCount / productCount) * 15 
			topheight += "vw"

			if (dingCount == 0) {
				topheight = "7.5vw"
			}
			xbar.style.height = topheight;
		}
	}
}


if (checkEmpty() == true) {
	console.log('yes');
	populateInitialTable();
	console.log(store.orderHistory);
}

adjustScores();

adjustTable();

function highBar() {
	var orders = store.orderHistory;

	orders = orders.slice(Math.max(orders.length - 7, 0))

	let numOrders = orders.length

	dingArr = []
	widgArr = []
	idArr = []

	for (i = 0; i < orders.length; i++) {
		idArr.push(orders[i][0]);
		dingArr.push(orders[i][2]);
		widgArr.push(orders[i][3]);
	}

	Highcharts.chart('chart1', {
		title: {
			text: 'Fruit Sales'
		},
		subtitle: {
			text: '# of Each Sold'
		},
		xAxis: {
			title: {
				text: 'Year'
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},
		yAxis: {
			min: 0,
			tickInterval: 10,
			title: {
				text: 'Number of Sales'
			}
		},
		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				},
				pointStart:2014
			}
		},
		series: [{
			name: 'Apples',
			data: [231, 251, 319, 593, 693]
		}, {
			name: 'Bananas',
			data: [251,645,547,976,435]
		}, {
			name: 'Oranges',
			data: [34, 53, 69, 123, 156]
		}, {
			name: 'Grapes',
			data: [239, 415, 450, 490, 526]
		}]
	});

	console.log(dingArr);
}

function highPie() {
	var numWidgets = +(document.getElementById('widgetCount').innerHTML);
		
	var numDinguses = +(document.getElementById('dingusCount').innerHTML);

	Highcharts.chart('chart2', {
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign:'middle',
			labelFormatter: function () {
				return +(this.percentage.toFixed(0)) + '%' + '<br>' + this.name;
			}
		},
		title: {
			text: 'Operating Costs'
		},
		plotOptions: {
			pie: {
				size: 100
			}
		},
		subtitle: {
			text: 'Dingus vs Widget'
		},
		series: [{
			type: 'pie',
			size: '80%',
			innerSize: '60%',
			showInLegend: true,
			dataLabels: {
				enabled: false
			},
			data: [{
				name: 'Dingus',
				y: numDinguses,
				color: '#abcfe6' },
				{
				name: 'Widget',
				y: numWidgets,
				color: '#addea7'
				}]
			}]
		});
	}

highPie();
highBar();

// buildPieD3();
// buildBarD3();

// console.log(store.orderHistory);