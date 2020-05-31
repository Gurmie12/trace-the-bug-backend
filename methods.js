const apple = require('./apple.json');
const ontario = require('./ontario.json');
const googleOntario = require('./googleOntario.json');

const gta = ["vaughn", 'toronto', 'markham', 'mississauga', 'Brampton', 'Burlington', 'oakville', 'pickering', 'oshawa', 'ajax', 'richmond hill', 'milton', 'newmarket', 'whitby', 'aurora', 'caledon', 'halton hills'];

module.exports = {
    filterByTrans: function(transName){
        const filtered = [];
        apple.forEach(data =>{
            if(data.transportation_type === transName){ 
                filtered.push(data);
            }
        });

        return(
            {
                name: "result",
                response: filtered
            }
        );
    },
    filterByLocationCountry: function(location){
        const filtered = [];

        apple.forEach(data =>{
            if(data.country === ""){
                if(data.region.toLowerCase() === location.toLowerCase()){
                    filtered.push(data);
                }
            }
        });

        return(
            {
                name: "result",
                response: filtered
            }
        );
    },
    filterByLocationState: function(location){
        const filtered  = [];

        apple.forEach(data =>{
            if(data.country !== ""){
                if(data.region.toLowerCase() === location.toLowerCase()){
                    filtered.push(data);
                }
            }
        });

        return(
            {
                name: "result",
                response: filtered
            }
        )
    },
    filterByLocationCity: function(location){
        const filtered  = [];

        apple.forEach(data =>{
            if(data.country !== ""){
                if(data.region.toLowerCase() === location.toLowerCase()){
                    filtered.push(data);
                }
            }
        });

        return(
            filtered
        );
    },
    filterOntarioByCity: function(location){
        const filtered = [];

        ontario.map((data,i) =>{
            if(i !== 0){
                if(data.Reporting_PHU_City.toLowerCase() === location.toLowerCase()){
                    filtered.push(data);
                }
            }
        });

        return(
            {
                name: "result",
                response: filtered
            }
        )
    },
    correlationAlg: function(city, start){
        let isMatchGta = false;
        gta.forEach(location =>{
            if(location.toLowerCase() === city.toLowerCase()){
                isMatchGta = true;
            }
        });

        let isMatchOtt = false;
        if(city === "ottawa"){
            isMatchOtt = true;
        }

        if(isMatchGta){
            const mobility = this.filterByLocationCity('toronto');
            const applekeys = Object.keys(mobility[0]);

            const results = {
                torontoData: [],
                ontarioData: [],
                totalCases: []
            };
            const date = new Date(start.replace(/-/g, "/"));

            const firstDay = new Date();
            const lastDay = new Date();

            firstDay.setDate(date.getDate() - 5);
            lastDay.setDate(date.getDate() + 5);

            mobility.forEach(data =>{
                applekeys.forEach(key =>{
                    let reg = /\d/g;
                    if(reg.test(key)){
                        const cur = new Date(key.replace(/-/g, "/").replace('T00:00:00', ''))
                        if(cur >= firstDay && cur <= lastDay){
                            results.torontoData.push({type: data.transportation_type, date: key, value: data[key]});
                        }
                    }
                })
            });

            googleOntario.forEach(data =>{
                let curDate = new Date(data.date.replace('T00:00:00', '').replace(/-/g, "/"));
                if(curDate >= firstDay && curDate <= lastDay){
                    results.ontarioData.push(
                        {
                            date: curDate,
                            retail_change: data.grocery_and_pharmacy_percent_change_from_baseline,
                            grocery_change: data.grocery_and_pharmacy_percent_change_from_baseline,
                            parks_change: data.parks_percent_change_from_baseline,
                            transit_change: data.transit_stations_percent_change_from_baseline,
                            workplace_changes: data.workplaces_percent_change_from_baseline,
                            residential_changes: data.residential_percent_change_from_baseline
                        }
                    )
                }
            });

            ontario.forEach(location =>{
                let date = location.Accurate_Episode_Date.replace('T00:00:00', '');
                let curDate = new Date(date.replace(/-/g, "/"));
                if((location.Reporting_PHU_City.toLowerCase() === city.toLowerCase())){
                    if(curDate >= firstDay && curDate <= lastDay){
                        results.totalCases.push({date: curDate})
                    }
                }
            })

            return(
                results
            );

        }else if(isMatchOtt){
            const mobility = this.filterByLocationCity('ottawa');
            const applekeys = Object.keys(mobility[0]);

            const results = {
                ottawaData: [],
                ontarioData: [],
                totalCases: []
            };

            const date = new Date(start.replace(/-/g, "/"));

            const firstDay = new Date();
            const lastDay = new Date();

            firstDay.setDate(date.getDate() - 5);
            lastDay.setDate(date.getDate() + 5);

            mobility.forEach(data =>{
                applekeys.forEach(key =>{
                    let reg = /\d/g;
                    if(reg.test(key)){
                        const cur = new Date(key.replace(/-/g, "/").replace('T00:00:00', ''))
                        if(cur >= firstDay && cur <= lastDay){
                            results.ottawaData.push({type: data.transportation_type, date: key, value: data[key]});
                        }
                    }
                })
            });

            googleOntario.forEach(data =>{
                let curDate = new Date(data.date.replace('T00:00:00', '').replace(/-/g, "/"));
                if(curDate >= firstDay && curDate <= lastDay){
                    results.ontarioData.push(
                        {
                            date: curDate,
                            retail_change: data.grocery_and_pharmacy_percent_change_from_baseline,
                            grocery_change: data.grocery_and_pharmacy_percent_change_from_baseline,
                            parks_change: data.parks_percent_change_from_baseline,
                            transit_change: data.transit_stations_percent_change_from_baseline,
                            workplace_changes: data.workplaces_percent_change_from_baseline,
                            residential_changes: data.residential_percent_change_from_baseline
                        }
                    )
                }
            });

            ontario.forEach(location =>{
                let date = location.Accurate_Episode_Date.replace('T00:00:00', '');
                let curDate = new Date(date.replace(/-/g, "/"));
                if((location.Reporting_PHU_City.toLowerCase() === city.toLowerCase())){
                    if(curDate >= firstDay && curDate <= lastDay){
                        results.totalCases.push({date: curDate});
                    }
                }
            })

            return(
                results
            );
        }else{

            const results = {
                ontarioData: [],
                totalCases: []
            };

            const date = new Date(start.replace(/-/g, "/"));

            const firstDay = new Date();
            const lastDay = new Date();

            firstDay.setDate(date.getDate() - 5);
            lastDay.setDate(date.getDate() + 5);

            googleOntario.forEach(data =>{
                let curDate = new Date(data.date.replace('T00:00:00', '').replace(/-/g, "/"));
                if(curDate >= firstDay && curDate <= lastDay){
                    results.ontarioData.push(
                        {
                            date: curDate,
                            retail_change: data.grocery_and_pharmacy_percent_change_from_baseline,
                            grocery_change: data.grocery_and_pharmacy_percent_change_from_baseline,
                            parks_change: data.parks_percent_change_from_baseline,
                            transit_change: data.transit_stations_percent_change_from_baseline,
                            workplace_changes: data.workplaces_percent_change_from_baseline,
                            residential_changes: data.residential_percent_change_from_baseline
                        }
                    )
                }
            });

            ontario.forEach(location =>{
                let date = location.Accurate_Episode_Date.replace('T00:00:00', '');
                let curDate = new Date(date.replace(/-/g, "/"));
                if((location.Reporting_PHU_City.toLowerCase() === city.toLowerCase())){
                    if(curDate >= firstDay && curDate <= lastDay){
                        results.totalCases.push({date: curDate})
                    }
                }
            })
            
            return(
                results
            );
        }
    }
};