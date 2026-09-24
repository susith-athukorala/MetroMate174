// ======================================
// MetroMate174
// Adelaide Metro Dashboard
// ======================================

const OUTBOUND_STOP = "12429";
const INBOUND_STOP = "13278";

const REALTIME_API =
"https://metromate-tripupdates.susithathukorala-8d7.workers.dev/?stop=";
const API =
    "https://api-cloudfront.adelaidemetro.com.au/stops/next-scheduled-services?stop=";


// -------------------------------
// Live Clock
// -------------------------------

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-AU");

}

setInterval(updateClock,1000);
updateClock();



// -------------------------------
// Format time
// -------------------------------

function formatTime(timeString){

    const d=new Date(timeString);

    return d.toLocaleTimeString(
        "en-AU",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}



// -------------------------------
// Badge Colour
// -------------------------------

function badge(minutes){

    let colour="grey";

    if(minutes<=3){

        colour="red";

    }
    else if(minutes<=10){

        colour="orange";

    }
    else{

        colour="green";

    }

    return `<span class="badge ${colour}">
                ${minutes} min
            </span>`;

}



// -------------------------------
// Build Table
// -------------------------------

function populateTable(tableId, buses, realtime){

    const tbody = document.querySelector(
        "#" + tableId + " tbody"
    );

    tbody.innerHTML = "";

    if(buses.length === 0){

        tbody.innerHTML = `
        <tr>
            <td colspan="3">
                No Route 174 services
            </td>
        </tr>`;

        return;
    }

    buses.forEach(bus => {

        const row = document.createElement("tr");


        let arrival = formatTime(bus.arrival_time);
        let minutes = bus.min;
    

const trip = realtime.find(
    t => String(t.tripId) === String(bus.trip_id)
);

if (trip) {

    const scheduled =
        Math.round(
            new Date(bus.arrival_time).getTime() / 1000
        );

    const delay =
        Math.round(
            (trip.arrival - scheduled) / 60
        );

    const liveMinutes =
        Math.max(
            0,
            Math.round(
                (trip.arrival * 1000 - Date.now()) / 60000
            )
        );

    minutes = liveMinutes;

    arrival = new Date(trip.arrival * 1000)
        .toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit"
        });

    if (Math.abs(delay) <= 1)
        arrival += " 🟢 On time";
    else if (delay <= 5)
        arrival += ` 🟠 ${delay} min late`;
    else if (delay > 5)
        arrival += ` 🔴 ${delay} min late`;
    else
        arrival += ` 🔵 ${Math.abs(delay)} min early`;
}


if (!trip) {

    const scheduledTime = new Date(bus.arrival_time);

    if (scheduledTime > new Date()) {
        arrival += " 🟡 Scheduled";
    } else {
        arrival += " ⚪ Live unavailable";
    }

}


        row.innerHTML = `
    <td>${bus.route_id}</td>
    <td>${arrival}</td>
    <td>${badge(minutes)}</td>
`;

        tbody.appendChild(row);

    });

}



// -------------------------------
// Load One Stop
// -------------------------------

async function loadStop(stop){

    try{

        const response=
            await fetch(API+stop);

        const json=
            await response.json();

        // API returns array
        // services are in index 2

        const services=json[2] || [];

        return services
            .filter(x=>x.route_id==="174")
            .slice(0,10);

    }

    catch(e){

        console.error(e);

        return [];

    }

}

async function loadRealtime(stop) {

    const response = await fetch(
        REALTIME_API + stop
    );

    return await response.json();

}


// -------------------------------
// Load Dashboard
// -------------------------------

function mergeRealtimeBuses(schedule, realtime) {

    const now = Date.now() / 1000;

    realtime.forEach(trip => {

        const nextStop = trip.updates.find(
            u => u.arrival > now
        );

        if (!nextStop) return;

        const exists = schedule.some(
            s => String(s.trip_id) === String(trip.tripId)
        );

        if (exists) return;

        schedule.push({

            route_id: trip.route,

            trip_id: trip.tripId,

            stop_sequence: nextStop.stopSequence,

            arrival_time:
                new Date(nextStop.arrival * 1000)
                    .toISOString(),

            min:
                Math.max(
                    0,
                    Math.round(
                        (nextStop.arrival - now) / 60
                    )
                )

        });

    });

    schedule.sort(
        (a,b) =>
            new Date(a.arrival_time) -
            new Date(b.arrival_time)
    );

    return schedule.slice(0,10);

}

async function loadDashboard(){

    const outbound =
    await loadStop(OUTBOUND_STOP);

const inbound =
    await loadStop(INBOUND_STOP);

const outboundRealtime =
    await loadRealtime(OUTBOUND_STOP);

const inboundRealtime =
    await loadRealtime(INBOUND_STOP);

populateTable(
    "outboundTable",
    outbound,
    outboundRealtime
);

populateTable(
    "inboundTable",
    inbound,
    inboundRealtime
);

    document.getElementById(
        "updated"
    ).textContent=
        "Last updated : "
        + new Date().toLocaleTimeString("en-AU");

}



// -------------------------------
// Refresh
// -------------------------------

loadDashboard();

setInterval(
    loadDashboard,
    15000
);
