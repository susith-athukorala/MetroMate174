// ======================================
// MetroMate174
// Adelaide Metro Dashboard
// ======================================

const OUTBOUND_STOP = "12501";
const INBOUND_STOP = "13278";

const REALTIME_API =
"https://metromate-tripupdates.susithathukorala-8d7.workers.dev/";
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

    if(minutes<=5){

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
            <td colspan="4">
                No Route 174 services
            </td>
        </tr>`;

        return;
    }

    buses.forEach(bus => {

        const row = document.createElement("tr");

        // Display the arrival time
        let arrival = formatTime(bus.arrival_time);

        // Find matching realtime trip
const trip = realtime.find(
    t => String(t.tripId) === String(bus.trip_id)
);

console.log(
    "Timetable trip:",
    bus.trip_id,
    "Matched:",
    trip
);

let status = "⚪ No live data";

if (trip) {

    const update = trip.updates.find(
    u => Number(u.stopSequence) === Number(bus.stop_sequence)
);

console.log(
    "Stop sequence:",
    bus.stop_sequence,
    "Update:",
    update
);


    if (update) {

        const scheduled = Math.round(
    new Date(bus.arrival_time).getTime() / 1000
);

const delay = Math.round(
    (update.arrival - scheduled) / 60
);

        if (Math.abs(delay) <= 1)
            status = "🟢 On time";
        else if (delay > 0)
            status = `🔴 +${delay} min`;
        else
            status = `🔵 ${delay} min`;

    }

}

        row.innerHTML = `
            <td>${bus.route_id}</td>
            <td>${arrival}</td>
            <td>${badge(bus.min)}</td>
            <td>${status}</td>
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

async function loadRealtime() {

    const response = await fetch(REALTIME_API);

    return await response.json();

}


// -------------------------------
// Load Dashboard
// -------------------------------

async function loadDashboard(){

    const realtime =
    await loadRealtime();

    console.log("Realtime trips:", realtime.length);
console.log(realtime[0]);

    const outbound=
        await loadStop(OUTBOUND_STOP);

    const inbound=
        await loadStop(INBOUND_STOP);

    populateTable(
        "outboundTable",
        outbound,
        realtime
    );

    populateTable(
        "inboundTable",
        inbound,
        realtime
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