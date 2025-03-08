/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9978632478632479, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Report generation Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Ratchets Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Legal Law Firms Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Difficult Creditors Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Fee Split Profiles Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Settlement predictions Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Fee Split Profiles Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Debt Brackets Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Adminstrators Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Debt Brackets Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Ratchets Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Debt Brackets Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Faq Questions Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Sales Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Messages Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Adminstrators Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Messages Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Adminstrators Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Settlement predictions Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Settlement predictions Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Report generation Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase Reports Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Report generation Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Lending supervisor commissions Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Tiers Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Lending supervisor commissions Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Faq Categories Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiator Commissions Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Legal Law Firms Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiator Commissions Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Graduation Review Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Tiers Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Legal Law Firms Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Employees Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Assignments Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Assignments Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Prescreening page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Graduation Review Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiator Commissions Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Loan Specialist Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Loan Specialist Page Request-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Login Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Tiers Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Prescreening page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Graduation Review Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Prescreening page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Messages Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Distribution Flags Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiator Inquiry Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Employees Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Employees Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Distribution Flags Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Faq Questions Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Faq Questions Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Lending supervisor commissions Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Distribution Flags Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Faq Categories Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Loan Specialist Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Difficult Creditors Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Faq Categories Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Difficult Creditors Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Commissions Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase Reports Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Settings Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Settings Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase Reports Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sales Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Sales Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiation Assignments Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Commissions Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Commissions Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Settings Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Logout Request"], "isController": false}, {"data": [1.0, 500, 1500, "Ratchets Page Request"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiator Inquiry Page Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Negotiator Inquiry Page Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Fee Split Profiles Page Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 468, 0, 0.0, 237.01923076923086, 107, 627, 222.0, 379.0, 408.0, 460.13000000000005, 15.489508175018203, 487.4985196742404, 9.340661613821407], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Report generation Page Request", 6, 0, 0.0, 368.0, 309, 428, 365.5, 428.0, 428.0, 428.0, 0.29695619896065334, 14.109962725810444, 0.2710498638950755], "isController": false}, {"data": ["Ratchets Page Request-1", 6, 0, 0.0, 249.33333333333331, 191, 292, 258.5, 292.0, 292.0, 292.0, 0.2992667963489451, 13.860183176218266, 0.13511817921093322], "isController": false}, {"data": ["Legal Law Firms Page Request", 6, 0, 0.0, 347.6666666666667, 302, 389, 351.0, 389.0, 389.0, 389.0, 0.3008423586040915, 14.293929251905336, 0.2745969965904533], "isController": false}, {"data": ["Difficult Creditors Page Request", 6, 0, 0.0, 353.16666666666663, 304, 378, 369.5, 378.0, 378.0, 378.0, 0.30099327781679547, 14.301393818350556, 0.2759105046653958], "isController": false}, {"data": ["Fee Split Profiles Page Request-1", 6, 0, 0.0, 235.83333333333334, 202, 315, 212.0, 315.0, 315.0, 315.0, 0.29889409186011756, 13.842921814287136, 0.1349499041048122], "isController": false}, {"data": ["Settlement predictions Page Request", 6, 0, 0.0, 375.1666666666667, 315, 423, 393.5, 423.0, 423.0, 423.0, 0.29750099166997224, 14.1358487145478, 0.27358082730067435], "isController": false}, {"data": ["Fee Split Profiles Page Request-0", 6, 0, 0.0, 114.83333333333333, 109, 134, 111.0, 134.0, 134.0, 134.0, 0.30009002700810244, 0.35977590152045613, 0.1392996023807142], "isController": false}, {"data": ["Debt Brackets Page Request-0", 6, 0, 0.0, 112.66666666666667, 109, 119, 111.5, 119.0, 119.0, 119.0, 0.3048315805517452, 0.3654605179596606, 0.14001216150993243], "isController": false}, {"data": ["Adminstrators Page Request", 6, 0, 0.0, 332.16666666666663, 307, 368, 329.5, 368.0, 368.0, 368.0, 0.29663321303208584, 14.093940030652098, 0.2681479272754239], "isController": false}, {"data": ["Debt Brackets Page Request-1", 6, 0, 0.0, 233.66666666666666, 201, 296, 218.5, 296.0, 296.0, 296.0, 0.30202355783751134, 13.987957597150912, 0.1363628498439545], "isController": false}, {"data": ["Ratchets Page Request-0", 6, 0, 0.0, 124.5, 111, 135, 125.5, 135.0, 135.0, 135.0, 0.30137123913807823, 0.3613119380682104, 0.1369512532020694], "isController": false}, {"data": ["Debt Brackets Page Request", 6, 0, 0.0, 347.0, 311, 416, 332.0, 416.0, 416.0, 416.0, 0.3003003003003003, 14.268174424424425, 0.2735157032032032], "isController": false}, {"data": ["Faq Questions Page Request", 6, 0, 0.0, 326.83333333333337, 305, 348, 323.0, 348.0, 348.0, 348.0, 0.29843322556577967, 14.179464063665755, 0.2718151579209152], "isController": false}, {"data": ["Sales Page Request", 6, 0, 0.0, 371.5, 302, 418, 393.5, 418.0, 418.0, 418.0, 0.29754525167369206, 14.137467455988098, 0.27129695636002976], "isController": false}, {"data": ["Messages Page Request-1", 6, 0, 0.0, 221.5, 200, 291, 209.5, 291.0, 291.0, 291.0, 0.30004500675101264, 13.89627389420913, 0.13546953918087712], "isController": false}, {"data": ["Adminstrators Page Request-0", 6, 0, 0.0, 121.0, 113, 132, 118.5, 132.0, 132.0, 132.0, 0.29983509070011494, 0.3594702601069412, 0.13566757033631502], "isController": false}, {"data": ["Messages Page Request-0", 6, 0, 0.0, 119.0, 109, 133, 118.0, 133.0, 133.0, 133.0, 0.3014772384684956, 0.3614390199477439, 0.13699942216862626], "isController": false}, {"data": ["Adminstrators Page Request-1", 6, 0, 0.0, 210.66666666666669, 191, 236, 210.5, 236.0, 236.0, 236.0, 0.29841838257236647, 13.820987049885606, 0.13473512260021883], "isController": false}, {"data": ["Settlement predictions Page Request-1", 6, 0, 0.0, 245.16666666666666, 192, 295, 258.5, 295.0, 295.0, 295.0, 0.2994908655286014, 13.871340595986823, 0.13521934586203455], "isController": false}, {"data": ["Settlement predictions Page Request-0", 6, 0, 0.0, 129.66666666666666, 118, 142, 130.0, 142.0, 142.0, 142.0, 0.30123506376142184, 0.36114867833115777, 0.1410078195601968], "isController": false}, {"data": ["Report generation Page Request-0", 6, 0, 0.0, 120.83333333333333, 111, 135, 116.0, 135.0, 135.0, 135.0, 0.30079711234772144, 0.36062362134656845, 0.13874658469945356], "isController": false}, {"data": ["Purchase Reports Page Request", 6, 0, 0.0, 353.6666666666667, 329, 401, 349.0, 401.0, 401.0, 401.0, 0.2967652586803838, 14.101566364130973, 0.27116539098822834], "isController": false}, {"data": ["Report generation Page Request-1", 6, 0, 0.0, 246.83333333333334, 198, 315, 238.0, 315.0, 315.0, 315.0, 0.29862631893290864, 13.831297904638664, 0.1348290053255027], "isController": false}, {"data": ["Lending supervisor commissions Page Request-0", 6, 0, 0.0, 118.16666666666666, 111, 133, 114.0, 133.0, 133.0, 133.0, 0.3030456083640588, 0.36331932799636346, 0.14422287741805143], "isController": false}, {"data": ["Negotiation Tiers Page Request-1", 6, 0, 0.0, 227.16666666666666, 189, 255, 231.5, 255.0, 255.0, 255.0, 0.3018260475879069, 13.978810082247596, 0.13627367448060768], "isController": false}, {"data": ["Lending supervisor commissions Page Request-1", 6, 0, 0.0, 237.83333333333331, 203, 272, 244.5, 272.0, 272.0, 272.0, 0.3010385831117355, 13.94233935201445, 0.13591813632030506], "isController": false}, {"data": ["Faq Categories Page Request", 6, 0, 0.0, 333.83333333333337, 323, 343, 333.0, 343.0, 343.0, 343.0, 0.2982848620432513, 14.17241486452896, 0.27197132115336814], "isController": false}, {"data": ["Negotiator Commissions Page Request-1", 6, 0, 0.0, 242.33333333333334, 202, 302, 243.5, 302.0, 302.0, 302.0, 0.29997000299970006, 13.89314193580642, 0.13543567518248176], "isController": false}, {"data": ["Legal Law Firms Page Request-1", 6, 0, 0.0, 232.0, 192, 275, 229.0, 275.0, 275.0, 275.0, 0.302571860816944, 14.013351771306104, 0.13661040721129603], "isController": false}, {"data": ["Negotiator Commissions Page Request-0", 6, 0, 0.0, 125.5, 110, 135, 132.5, 135.0, 135.0, 135.0, 0.3015378429992964, 0.36151167830937786, 0.14114955020605086], "isController": false}, {"data": ["Graduation Review Page Request-0", 6, 0, 0.0, 124.66666666666666, 110, 135, 128.5, 135.0, 135.0, 135.0, 0.30272452068617556, 0.3629343781533804, 0.14022688572149344], "isController": false}, {"data": ["Negotiation Tiers Page Request-0", 6, 0, 0.0, 127.66666666666666, 109, 161, 123.5, 161.0, 161.0, 161.0, 0.30327537403962795, 0.36359479250909826, 0.14048204988879903], "isController": false}, {"data": ["Legal Law Firms Page Request-0", 6, 0, 0.0, 115.33333333333333, 110, 122, 113.0, 122.0, 122.0, 122.0, 0.3048780487804878, 0.36551622840447157, 0.14062896976626016], "isController": false}, {"data": ["Employees Page Request", 6, 0, 0.0, 348.8333333333333, 310, 432, 338.0, 432.0, 432.0, 432.0, 0.2968239833778569, 14.102955794869892, 0.2691899797170278], "isController": false}, {"data": ["Negotiation Assignments Page Request-1", 6, 0, 0.0, 225.5, 191, 275, 218.5, 275.0, 275.0, 275.0, 0.3027397951460719, 14.021129503254453, 0.1366862291235683], "isController": false}, {"data": ["Negotiation Assignments Page Request-0", 6, 0, 0.0, 118.66666666666666, 108, 140, 114.0, 140.0, 140.0, 140.0, 0.3037974683544304, 0.3642207278481013, 0.14250395569620253], "isController": false}, {"data": ["Prescreening page Request", 2, 0, 0.0, 359.5, 359, 360, 359.5, 360.0, 360.0, 360.0, 2.890173410404624, 137.33686325867052, 2.613574783236994], "isController": false}, {"data": ["Graduation Review Page Request", 6, 0, 0.0, 354.5, 306, 388, 362.5, 388.0, 388.0, 388.0, 0.2991772625280479, 14.214815507354775, 0.2736614933931688], "isController": false}, {"data": ["Negotiator Commissions Page Request", 6, 0, 0.0, 368.6666666666667, 313, 436, 377.5, 436.0, 436.0, 436.0, 0.29797377830750893, 14.157925326529599, 0.2740156001688518], "isController": false}, {"data": ["Loan Specialist Page Request-0", 6, 0, 0.0, 121.16666666666667, 108, 135, 120.0, 135.0, 135.0, 135.0, 0.3026329062846767, 0.36282454226772926, 0.14313984792696458], "isController": false}, {"data": ["Loan Specialist Page Request-1", 6, 0, 0.0, 232.5, 195, 259, 241.0, 259.0, 259.0, 259.0, 0.300782033286545, 13.930408515264688, 0.13580230474233004], "isController": false}, {"data": ["Login Request", 6, 0, 0.0, 514.8333333333334, 443, 627, 480.0, 627.0, 627.0, 627.0, 0.28790786948176583, 13.33677910568618, 0.10131133037428024], "isController": false}, {"data": ["Negotiation Tiers Page Request", 6, 0, 0.0, 355.3333333333333, 314, 399, 360.0, 399.0, 399.0, 399.0, 0.2994011976047904, 14.225455339321359, 0.2738663298403194], "isController": false}, {"data": ["Prescreening page Request-0", 2, 0, 0.0, 115.5, 115, 116, 115.5, 116.0, 116.0, 116.0, 4.4543429844097995, 5.224283129175946, 2.040123886414254], "isController": false}, {"data": ["Graduation Review Page Request-1", 6, 0, 0.0, 229.66666666666666, 196, 254, 239.5, 254.0, 254.0, 254.0, 0.30117458086537496, 13.948637969330388, 0.13597953895191245], "isController": false}, {"data": ["Prescreening page Request-1", 2, 0, 0.0, 243.0, 242, 244, 243.0, 244.0, 244.0, 244.0, 3.472222222222222, 160.9225802951389, 1.5496148003472223], "isController": false}, {"data": ["Messages Page Request", 6, 0, 0.0, 341.0, 313, 413, 327.0, 413.0, 413.0, 413.0, 0.2983738624496494, 14.176594979238152, 0.27030418593664524], "isController": false}, {"data": ["Negotiation Distribution Flags Page Request", 6, 0, 0.0, 345.5, 308, 391, 347.5, 391.0, 391.0, 391.0, 0.3002852710074571, 14.267460337320454, 0.2784872191081527], "isController": false}, {"data": ["Negotiator Inquiry Page Request", 6, 0, 0.0, 358.66666666666663, 321, 418, 340.0, 418.0, 418.0, 418.0, 0.299311583358276, 14.221538508305898, 0.27758421256110943], "isController": false}, {"data": ["Employees Page Request-1", 6, 0, 0.0, 224.16666666666669, 199, 293, 214.0, 293.0, 293.0, 293.0, 0.2985520226899537, 13.827127882892968, 0.13479546076528834], "isController": false}, {"data": ["Employees Page Request-0", 6, 0, 0.0, 124.33333333333333, 110, 138, 125.0, 138.0, 138.0, 138.0, 0.30120481927710846, 0.36111241842369474, 0.13716977284136544], "isController": false}, {"data": ["Negotiation Distribution Flags Page Request-0", 6, 0, 0.0, 119.83333333333333, 110, 138, 115.0, 138.0, 138.0, 138.0, 0.3037052034824863, 0.3641101121178376, 0.1445367862927718], "isController": false}, {"data": ["Faq Questions Page Request-1", 6, 0, 0.0, 205.83333333333334, 192, 217, 208.0, 217.0, 217.0, 217.0, 0.300270243218897, 13.906754360174157, 0.13557123285957362], "isController": false}, {"data": ["Faq Questions Page Request-0", 6, 0, 0.0, 120.66666666666667, 112, 133, 118.0, 133.0, 133.0, 133.0, 0.30158331239004776, 0.36156619125408396, 0.13852019979894445], "isController": false}, {"data": ["Lending supervisor commissions Page Request", 6, 0, 0.0, 356.33333333333337, 318, 405, 356.0, 405.0, 405.0, 405.0, 0.29935638377488405, 14.223326098887393, 0.2776257608641421], "isController": false}, {"data": ["Negotiation Distribution Flags Page Request-1", 6, 0, 0.0, 225.5, 197, 255, 225.0, 255.0, 255.0, 255.0, 0.3022517757291824, 13.99852730970732, 0.13646588962772657], "isController": false}, {"data": ["Faq Categories Page Request-0", 6, 0, 0.0, 119.83333333333333, 113, 127, 121.0, 127.0, 127.0, 127.0, 0.3014923873172202, 0.36145718179990954, 0.1387728631727049], "isController": false}, {"data": ["Loan Specialist Page Request", 6, 0, 0.0, 354.0, 306, 393, 365.5, 393.0, 393.0, 393.0, 0.29877502240812664, 14.19565523540982, 0.2762112837366796], "isController": false}, {"data": ["Difficult Creditors Page Request-1", 6, 0, 0.0, 239.83333333333331, 194, 266, 254.5, 266.0, 266.0, 266.0, 0.30272452068617556, 14.02071770938446, 0.13667933274470231], "isController": false}, {"data": ["Faq Categories Page Request-1", 6, 0, 0.0, 213.66666666666666, 208, 217, 215.0, 217.0, 217.0, 217.0, 0.3001350607773498, 13.900493503326498, 0.13551019833925268], "isController": false}, {"data": ["Difficult Creditors Page Request-0", 6, 0, 0.0, 113.0, 110, 116, 113.0, 116.0, 116.0, 116.0, 0.3050640634533252, 0.36573924013626197, 0.14190642795403702], "isController": false}, {"data": ["Commissions Page Request", 6, 0, 0.0, 352.33333333333337, 322, 434, 337.5, 434.0, 434.0, 434.0, 0.296545247862403, 14.090098400509069, 0.2695163841249444], "isController": false}, {"data": ["Purchase Reports Page Request-1", 6, 0, 0.0, 235.83333333333331, 215, 266, 232.0, 266.0, 266.0, 266.0, 0.29844807003581375, 13.823722113758457, 0.1347485264126542], "isController": false}, {"data": ["Settings Page Request-0", 6, 0, 0.0, 140.5, 107, 241, 121.0, 241.0, 241.0, 241.0, 0.3027092477675193, 0.36291606755461375, 0.13755928056102112], "isController": false}, {"data": ["Settings Page Request-1", 6, 0, 0.0, 231.83333333333331, 195, 290, 217.5, 290.0, 290.0, 290.0, 0.30012004801920766, 13.90014013417867, 0.13550342011804722], "isController": false}, {"data": ["Dashboard Page Request", 6, 0, 0.0, 325.5, 318, 341, 322.5, 341.0, 341.0, 341.0, 0.29663321303208584, 14.093940030652098, 0.2661201611707124], "isController": false}, {"data": ["Purchase Reports Page Request-0", 6, 0, 0.0, 117.33333333333334, 110, 134, 114.0, 134.0, 134.0, 134.0, 0.3002552169343943, 0.3599739466046139, 0.138789846369414], "isController": false}, {"data": ["Sales Page Request-0", 6, 0, 0.0, 126.0, 110, 142, 125.5, 142.0, 142.0, 142.0, 0.30152268958239103, 0.36149351098045124, 0.13878681089501985], "isController": false}, {"data": ["Sales Page Request-1", 6, 0, 0.0, 245.0, 192, 284, 262.5, 284.0, 284.0, 284.0, 0.29932651534048393, 13.863241300823146, 0.13514514218009477], "isController": false}, {"data": ["Negotiation Assignments Page Request", 6, 0, 0.0, 344.6666666666667, 304, 393, 338.0, 393.0, 393.0, 393.0, 0.3006162633398467, 14.283186782904956, 0.2767391903401974], "isController": false}, {"data": ["Commissions Page Request-1", 6, 0, 0.0, 229.16666666666666, 194, 295, 224.5, 295.0, 295.0, 295.0, 0.29822555793031463, 13.812396320020875, 0.13464806277647995], "isController": false}, {"data": ["Commissions Page Request-0", 6, 0, 0.0, 122.66666666666666, 111, 138, 121.0, 138.0, 138.0, 138.0, 0.2999250187453137, 0.35957807423144217, 0.13717273806548363], "isController": false}, {"data": ["Settings Page Request", 6, 0, 0.0, 372.6666666666667, 302, 452, 374.0, 452.0, 452.0, 452.0, 0.2983293556085919, 14.174868781697496, 0.27026386609984093], "isController": false}, {"data": ["Logout Request", 6, 0, 0.0, 117.66666666666667, 110, 135, 112.5, 135.0, 135.0, 135.0, 0.30004500675101264, 0.35972192703905587, 0.11613070085512826], "isController": false}, {"data": ["Ratchets Page Request", 6, 0, 0.0, 374.6666666666667, 306, 428, 386.5, 428.0, 428.0, 428.0, 0.2972504334902155, 14.123169277929156, 0.2692864441416894], "isController": false}, {"data": ["Dashboard Page Request-0", 6, 0, 0.0, 120.5, 111, 135, 117.5, 135.0, 135.0, 135.0, 0.2994759171449962, 0.35903964936361366, 0.13345785500374344], "isController": false}, {"data": ["Dashboard Page Request-1", 6, 0, 0.0, 204.16666666666669, 191, 224, 204.0, 224.0, 224.0, 224.0, 0.29835902536051717, 13.818237972401791, 0.13470832297364496], "isController": false}, {"data": ["Negotiator Inquiry Page Request-1", 6, 0, 0.0, 234.83333333333334, 201, 301, 216.0, 301.0, 301.0, 301.0, 0.30137123913807823, 13.958089384825959, 0.1360683296499071], "isController": false}, {"data": ["Negotiator Inquiry Page Request-0", 6, 0, 0.0, 123.5, 110, 136, 121.5, 136.0, 136.0, 136.0, 0.30339805825242716, 0.36374187778114886, 0.14439061235841424], "isController": false}, {"data": ["Fee Split Profiles Page Request", 6, 0, 0.0, 352.3333333333333, 312, 427, 328.0, 427.0, 427.0, 427.0, 0.29689742194071944, 14.106396747736158, 0.2718660312237122], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 468, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
