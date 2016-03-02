console.log('Homework 2-A...')

d3.csv('data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    console.log(rows);
    //rows.filter(function(d){return d.gender})
    var CF=crossfilter(rows);


//Filter
//1. console.log total number of trips in 2012
    var tripsByYear = CF.dimension(function(d){return d.startTime});

    var Trips2012 = tripsByYear.filter([new Date('January 1, 2012 00:00:00'),new Date('December 31, 2012 23:59:59')]).top(Infinity);
    console.log("2012 trips numbers:",Trips2012.length )

//2. console log total number of trips in 2012 AND taken by male, registered users
    var Trips2012Male = Trips2012.filter(function(d){return d.gender=="Male"})
    console.log("2012 trips taken by male numbers:",Trips2012Male.length )

//3. console log total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5).
    var Trips2012NEU = Trips2012.filter(function(d){return d.startStation==5})
    console.log("2012 trips taken by all users start from NEU",Trips2012NEU)

//4. console log array of top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration.
    var TripsDuration = CF.dimension(function(d){return d.duration}).filter().top(50)
    console.log("Top 50 duration trips among all trips taken by all users",TripsDuration)

//clear all filters ??????
    //Trips2012.filter(null);
    tripsByYear.filter(null);


//Group
    //By creating a group on the right dimension,
    // group all trips into 10-year age buckets i.e. trips by users between 20 and 29, 30 and 39 etc.
    // Console log these groups using group.all()
    var tripsByAge = CF.dimension(function(d){return d.age}).filter([20,30]);
 
    var TripsByAge=tripsByAge.group(function(d){return Math.floor(d / 10)})
    console.log(TripsByAge.all())
    tripsByAge.filterAll()
}

function parse(d){
    if( +d.duration>=0)
    if(d.gender.length>0){
    return {
        //gender: d.gender==(undefined) ? "Nogender":d.gender,
        gender: d.gender,
        age: 2016-(+d.birth_date),
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        type: d.subsc_type
    }
}
    else{
        return {
        //gender: d.gender==(undefined) ? "Nogender":d.gender,
        gender: "NoGender",
        age: 2016-(+d.birth_date),
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: +d.strt_statn,
        endStation: d.end_statn,
        type: d.subsc_type
    }

    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

