﻿/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////
document.getElementsByTagName("head")[0].innerHTML += '<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"><\/script>';


var a;
let context_id="";
var premiumApi = {
    "access_token": "",
    "LogIn": ["Log In", "Logged In"],
    "onLoad": function () {
        console.log("onLoad")
        var url = new URL(window.location.href.replace('#', '?'))
        var query_string = url.search
        var search_params = new URLSearchParams(query_string)
        premiumApi.access_token = search_params.get('access_token')
        let logInButton = document.getElementById("LogIn")
        logInButton.innerText = (premiumApi.access_token) ? premiumApi.LogIn[1] : premiumApi.LogIn[0]
        console.log(premiumApi.access_token)
        if (premiumApi.access_token === "")
        return
    fetch('https://developer.api.autodesk.com/insights/v1/contexts', {
        headers: {
            'Authorization': `Bearer ${premiumApi.access_token}`,
            'Content-Type': 'application/json'
           
        }
    })
    
        .then(res => res.text())
        .then(data => {
            let json1 = JSON.parse(data)
          
           
           context_id = (json1[0]||'').contextId;
       
          console.log("context id is"+context_id);
        })
    },
    "getusage":   function () {
       
       
        let user = {
            'fields': ['fullName', 'productName'],
            'metrics': ['earliestUsageDate', 'latestUsageDate', 'totalUniqueDays'],
            'where': '',
            'orderBy': ''
        
       
        }
        if (premiumApi.access_token === "")
            return
         fetch('https://developer.api.autodesk.com/insights/v1/usage-queries?offset=0&limit=2000&' + context_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${premiumApi.access_token}`
            },
            body: JSON.stringify(user)
        })
        
            .then(res => res.text())
            .then(data => {
              
                let json2 = JSON.parse(data)
                const result = (json2.columns || []).length;
                if (result > 0) {
                    var temp1 = "";
                    temp1 += "<tr>";
                    temp1 += "<th>" + "Full Name" + "</th></a>";
                    temp1 += "<th>" + "Product Name" + "</th>";
                    temp1 += "<th>" + "Earliest Usage Date" + "</th>";
                    temp1 += "<th>" + "Latest Usage Date" + "</th>";
                    temp1 += "<th>" + "Total Unique Days" + "</th>";
                    temp1 += "<th>" + "Potential Flex Candidate(7 days or less)" + "</th>";
                    temp1 += "<th>" + "Active Users(60 days)" + "</th></tr>";
                 
                    document.getElementById("activeh").innerHTML = temp1;
                }
               
            
                var x = 0;
                var temp = "";
                const r1 = (json2.rows || []).length;
                if (r1 > 0) {
                    var y = 0;
                   
                    json2.rows.forEach((u) => {
                        let value;
                        var currenttime = new Date();
                        var expiretime = new Date(json2.rows[x][y + 3]);
                        var msec = Math.abs(currenttime - expiretime);
                        var min = Math.floor((msec / 1000) / 60);
                        var hours = min / 60;
                        var max_hours = 1440;
                        if (hours < max_hours) {
                            value = "Active";
                        }
                        else {
                            value = "Inactive";
                        }
                        
                        let potential_flex;
                        //check unique day is greater than or equal to 7
                        if (json2.rows[x][y + 4] >= 7) {
                            potential_flex = "No";
                        }
                        else {
                            potential_flex = "Yes";
                        }
                        var earliest_ud = new Date(json2.rows[x][y + 2]);
                        var latest_ud = new Date(json2.rows[x][y + 3]);
                        if (value == 'Active') {
                            temp += "<tr>";
                            temp += "<td>" + json2.rows[x][y] + "</td>";
                            temp += "<td>" + json2.rows[x][y + 1] + "</td></a>";
                            temp += "<td>" + earliest_ud.toDateString() + "</td>";
                            temp += "<td>" + latest_ud.toDateString() + "</td>";
                            temp += "<td>" + json2.rows[x][y + 4] + "</td>";
                            temp += "<td>" + potential_flex + "</td>";
                            temp += "<td>" + value + "</td></tr>";
                        }
                        x = x + 1;
                    })
                    
                }
                document.getElementById("active").innerHTML = temp;
              

                if (result > 0) {
                    var temp1 = "";
                    temp1 += "<tr>";
                    temp1 += "<th>" + "Full Name" + "</th>";
                    temp1 += "<th>" + "Product Name" + "</th></a>";
                    temp1 += "<th>" + "Earliest Usage Date" + "</th>";
                    temp1 += "<th>" + "Latest Usage Date " + "</th>";
                    temp1 += "<th>" + "Total Unique Days" + "</th>";
                    temp1 += "<th>" + "Potential Flex Candidate(7 days or less)" + "</th>";
                    temp1 += "<th>" + "Inactive Users(60 days)" + "</th></tr>";
                  
                    document.getElementById("inactiveh").innerHTML = temp1;
                }
            
                var x = 0;
                var temp = "";
                if (r1 > 0) {
                    var y = 0;
                    json2.rows.forEach((u) => {
                        let value;
                        var currenttime = new Date();
                        var expiretime = new Date(json2.rows[x][y + 3]);
                        var msec = Math.abs(currenttime - expiretime);
                        var min = Math.floor((msec / 1000) / 60);
                        var hours = min / 60;
                        var max_hours = 1440;
                        if (hours < max_hours) {
                            value = "Active";
                        }
                        else {
                            value = "Inactive";
                        }
                    
                        let potential_flex;
                        //check unique day is greater than or equal to 7
                        if (json2.rows[x][y + 4] >= 7) {
                            potential_flex = "No";
                        }
                        else {
                            potential_flex = "Yes";
                        }
                        var earliest_ud = new Date(json2.rows[x][y + 2]);
                        var latest_ud = new Date(json2.rows[x][y + 3]);
                        if (value == 'Inactive') {
                            temp += "<tr>";
                            temp += "<td>" + json2.rows[x][y] + "</td>";
                            temp += "<td>" + json2.rows[x][y + 1] + "</td></a>";
                            temp += "<td>" + earliest_ud.toDateString() + "</td>";
                            temp += "<td>" + latest_ud.toDateString() + "</td>";
                            temp += "<td>" + json2.rows[x][y + 4] + "</td>";
                            temp += "<td>" + potential_flex + "</td>";
                            temp += "<td>" + value + "</td></tr>";
                        }
                        x = x + 1;
                    })
                   
                }
                document.getElementById("inactive").innerHTML = temp;
         
            
            // let user1 = {
            //     'fields': ['fullName', 'productName','usageMonth','tokens'],
            //     'metrics': ['totalUniqueDays'],
            //     'where': '',
            //     'orderBy': ''
                
               
            // };
            // if (premiumApi.access_token === "")
            //     return
            //  fetch('https://developer.api.autodesk.com/insights/v1/usage-queries?offset=0&limit=2000&' + context_id, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${premiumApi.access_token}`
            //     },
            //     body: JSON.stringify(user1)
            // })

            //     .then(res => res.text())
            //     .then(data => {
            //         let json3 = JSON.parse(data)
            //         const result3 = (json3.columns || []).length;
                
             
            //         if (result3 > 0) {
            //             var temp1 = "";
            //             temp1 += "<tr>";
            //             temp1 += "<th>" + "Full Name" + "</th></a>";
            //             temp1 += "<th>" + "Product Name" + "</th>";
            //             temp1 += "<th>" + "Usage Month" + "</th>";
            //             temp1 += "<th>" + "Tokens" + "</th>";
                  
                       
            //             temp1 += "<th>" + "Total Unique Days" + "</th>";
            //             temp1 += "<th>" + "Identify Flex users that are exceeding the value of Flex (usage more than 7 days per month)" + "</th></tr>";
                        
            //             console.log(temp1)
            //             document.getElementById("get206").innerHTML = temp1;
            //         }
                   
    
            //         var x = 0;
            //         var temp = "";
            //         const r3 = (json3.rows || []).length;
            //         if (r3 > 0) {
            //             var y = 0;
    
                     
            //             json3.rows.forEach((u) => {
                          
            //                 var usage_Month = new Date(json3.rows[x][y + 2]);
                   
            //                 let potential_flex;
            //                 //check unique day is greater than or equal to 7
            //                 if (json3.rows[x][y + 4] > 7) {
            //                     potential_flex = "No";
            //                 }
            //                 else {
            //                     potential_flex = "Yes";
            //                 }
                           
            //                 if(potential_flex=='No')
            //                 {
                           
                          
            //                     temp += "<tr>";
            //                     temp += "<td>" + json3.rows[x][y] + "</td>";
            //                     temp += "<td>" + json3.rows[x][y + 1] + "</td></a>";
            //                     temp += "<td>" + usage_Month.toDateString() + "</td></a>";
            //                     temp += "<td>" + json3.rows[x][y + 3] + "</td></a>";
                         
            //                     temp += "<td>" + json3.rows[x][y + 4] + "</td>";
            //                     temp += "<td>" + potential_flex + "</td></tr>";
                             
            //             }
            //                 x = x + 1;
            //             })
                      
            //         }
            //         document.getElementById("get205").innerHTML = temp;
                    
                
                let user2 = {
                    'fields': ['fullName','productName','childProductName'],
                    'metrics': [],
                    'where': '',
                    'orderBy': ''
                    
                    
                };
                if (premiumApi.access_token === "")
                    return
                fetch('https://developer.api.autodesk.com/insights/v1/usage-queries?offset=0&limit=2000&' + context_id, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${premiumApi.access_token}`
                    },
                    body: JSON.stringify(user2)
                })
                    .then(res => res.text())
                    .then(data => {
                        let json4 = JSON.parse(data)   
                        const result4 = (json4.columns || []).length;                 
                        if (result4 > 0) {
                            var temp3 = "";
                            temp3 += "<tr>";
                            temp3 += "<th>" + "Users who can be moved to a collection" + "</th></a>";
                           
                            temp3 += "<th>" + "Product Name" + "</th>";
                            temp3 += "<th>" + "Child Product Name" + "</th></tr>";
                            document.getElementById("getData402").innerHTML = temp3;
                        }
                        var x = 0;
                        var temp5 = "";
                        const r4 = (json4.rows || []).length;
                        if (r4 > 0) {
                            var y = 0;
                            var z = 0;
                          
                            json4.rows.forEach((u) => {
                                if(json4.rows[x][y + 1]==json4.rows[x][y + 2])
                                {
                                        temp5 += "<tr>";
                                        temp5 += "<td>" + json4.rows[x][y] + "</td></a>";
                                        
                                        temp5 += "<td>" + json4.rows[x][y + 1] + "</td>";
                                      
                                        temp5 += "<td>" + json4.rows[x][y + 2] + "</td></tr>";
                                }
                                    
                                
                                x = x + 1;
                            })
                        }
                        document.getElementById("getData403").innerHTML = temp5;
                    
                    let user3 = {
                        'fields': ['fullName','productName'],
                        'metrics': ['totalUniqueDays', 'uniqueProducts'],
                        'where': '',
                        'orderBy': ''
                        
                    
                    };
                    if (premiumApi.access_token === "")
                        return
                     fetch('https://developer.api.autodesk.com/insights/v1/usage-queries?offset=0&limit=2000&' + context_id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${premiumApi.access_token}`
                        },
                        body: JSON.stringify(user3)
                    })
                        .then(res => res.text())
                        .then(data => {
                            let json5 = JSON.parse(data)    
                            const result5 = (json5.columns || []).length;                    
                            if (result5>0) {
                                var temp3 = "";
                                temp3 += "<tr>";
                                temp3 += "<th>" + "Users who are only utilizing one product from a collection." + "</th></a>";                          
                                temp3 += "<th>" + "Child Product Name" + "</th>";
                                temp3 += "<th>" + "Total Unique Days" + "</th>";
                                temp3 += "<th>" + "Unique Products" + "</th></tr>";
                                document.getElementById("get208").innerHTML = temp3;
                            }
                            var x = 0;
                            var temp5 = "";
                            const r5 = (json5.rows || []).length;
                            if (r5 > 0) {
                                var y = 0;
                                var z = 0;
                               
                                json5.rows.forEach((u) => {
                                    if (json5.rows[x][y + 2] <= 5) {
                                        if (json5.rows[x][y + 3] ==1) {
                                            temp5 += "<tr>";
                                            temp5 += "<td>" + json5.rows[x][y] + "</td></a>";                                 
                                            temp5 += "<td>" + json5.rows[x][y + 1] + "</td>";
                                            temp5 += "<td>" + json5.rows[x][y + 2] + "</td>";                                         
                                            temp5 += "<td>" + json5.rows[x][y + 3] + "</td></tr>";
                                        
                                        }
                                    }
                                    x = x + 1;
                                })
                            }
                            document.getElementById("get209").innerHTML = temp5;
                        
                     
                            })
                        })
                    })
                
        
    },
   
   
    
    "viewallexport":  async function () {
      

      
        if (premiumApi.access_token === "")
            return
       await fetch('https://developer.api.autodesk.com/insights/v1/exports',
         {
              headers: {
                'Authorization': `Bearer ${premiumApi.access_token}`
               
                
            },
            'outputFormat': 'EXCEL',
            'reports': ['USAGE', 'USERS', 'SUBSCRIPTIONS']
          
        })
      
           
      
      
      
 
            .then(res => res.text())
            .then(data => {
                let json = JSON.parse(data)
           
              
                document.getElementById("d").innerHTML=json.exports[0].downloads[0].downloadURL   
              
                        
             //download this file in order to save it in share point location which can be used in PowerBI integration
                console.log(json.exports[0].downloads[0].downloadURL)
                var dlAnchorElem = document.getElementById('downloadAnchorElem');
                 dlAnchorElem.setAttribute("href",json.exports[0].downloads[0].downloadURL);
                 dlAnchorElem.setAttribute("download", "scene.xlsx");
                dlAnchorElem.click();
                if (json.exports.length > 0) {
                    var temp1 = "";
                    json.exports.forEach((u) => {
                        temp1 += "<tr>";
                        temp1 += "<th>" + "Usage Id" + "</th>";
                        temp1 += "<th>" + "Usage TimeStamp" + "</th>";
                        temp1 += "<th>" + "Download URL" + "</th></a>";
                        temp1 += "<th>" + "Status" + "</th>";
                        temp1 += "<th>" + "Output Format" + "</th></tr>";
                    })
                    console.log(temp1)
                    document.getElementById("data7").innerHTML = temp1;
                }
                if (json.exports.length > 0) {
                    var temp = "";
                    json.exports.forEach((u) => {
                        temp += "<tr>";
                        temp += "<td>" + u.id + "</td>";
                        temp += "<td>" + u.timestamp + "</td>";
                        temp += "<td>" + u.downloads[0].downloadURL + "</td></a>";
                        temp += "<td>" + u.status + "</td>";
                        temp += "<td>" + u.outputFormal + "</td></tr>";
                    })
                    console.log(temp)
                    document.getElementById("data8").innerHTML = temp;
                }
            })
    },
    "logIn": function () {
        console.log("logIn")
        let clientId = a;
     
        let scopes = "data:read+data:write+bucket:read"
        let redirectUri = encodeURI("https://deepalics0044.github.io/forge-premium-remote-private/")
        window.open(`https://developer.api.autodesk.com/authentication/v1/authorize` +
            `?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`, "_self")
    },
    "showInfo": function (text) {
        let logInButton = document.getElementById("Info")
        logInButton.value = text
    },
    "logOut": function () {
        console.log("logOut")
        if (premiumApi.access_token === "")
            return
        let url = "https://deepalics0044.github.io/forge-premium-remote-private/";
        location.href = url;
    },

     "client_id_value": function() {
         a = prompt("Please enter client_id value");
        if (a != null) {
        document.getElementById("para").innerHTML = a;
       
        }
      }
}      

