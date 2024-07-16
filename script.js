let ip = document.getElementById("ipAddress");
let map = document.getElementsByClassName("mapContainer")[0];
let time = document.querySelector("#timezone");
let latitude = document.querySelector("#latitude");
let city = document.querySelector("#city");
let organisation = document.querySelector("#organisation");
let longitude = document.querySelector("#longitude");
let region = document.querySelector("#region");
let hostname = document.querySelector("#hostname");
let dateTime = document.querySelector("#dateTime");
let pincode = document.querySelector("#pincode");
let noOfPincode = document.querySelector("#noOfPincode");
let ipHeading = document.querySelector(".ipAddress");
let cards = document.querySelector('.cards');
let startBtn = document.querySelector('#startBtn');
let mainC = document.querySelector('.maincontainer');
let secondC = document.querySelector('.secondContainer');
let search = document.querySelector("#search");
// let card=document.querySelectorAll('.card');
$(document).ready(() => {
    $.getJSON("https://api.ipify.org?format=json",
        function (data) {

            // Displayin IP address on screen
            ip.innerHTML = data.ip;
            ipHeading.innerHTML = `Your Current IP Address is ${data.ip}`;
            startBtn.addEventListener("click", getpost)
            function getpost() {
                mainC.style.display = 'none'
                secondC.style.display = 'block'
                fetch(`https://ipapi.co/${data.ip}/json/`).then(e => {
                    return e.json()
                }).then(e => {
                    let timezone = new Date().toLocaleString("en-US", { timeZone: `${e.timezone}` });
                    let lat = e.latitude;
                    let lon = e.longitude;
                    latitude.innerHTML = lat;
                    city.innerHTML = e.city;
                    organisation.innerHTML = e.org;
                    longitude.innerHTML = lon;
                    region.innerHTML = e.region;
                    hostname.innerHTML = e.org;
                    dateTime.innerHTML = timezone;
                    pincode.innerHTML = e.postal;
                    noOfPincode.innerHTML = 1;
                    time.innerHTML = e.timezone;
                    map.innerHTML += `<iframe class="map" src="https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed" width="360" height="270" frameborder="0" style="border:0"></iframe>`;
                    fetch(`https://api.postalpincode.in/pincode/${e.postal}`)
                        .then(response => response.json())
                        .then(data => {
                            const postOffices = data[0].PostOffice;
                            displaycard(postOffices)
                            search.addEventListener("keydown", (event) => {
                                if (event.key === "Enter") {
                                    displaycard(postOffices, search.value)
                                }
                            });
                        })
                        .catch(error => console.error("Error:", error));
                })
            }
        })
});
function displaycard(postOffices, searchVal) {
    cards.innerHTML = '';
    if (undefined || searchVal == null || searchVal == '') {
        postOffices.forEach((element) => {
            display(element)
        });
    }
    else {
        postOffices.forEach((element, index) => {
            searchVal = searchVal.toLowerCase()
            if (element.Name.toLowerCase().includes(searchVal) || element.BranchType.toLowerCase().includes(searchVal) || element.District.toLowerCase().includes(searchVal) || element.Division.toLowerCase().includes(searchVal)) {
                display(element)
            }
        });
    }
}
function display(element) {
    cards.innerHTML += `<div class="card">
                    <div class="var">
                        <p>Name : </p>
                        <p>${element.Name}</p>
                    </div>
                    <div class="var">
                        <p>Branch Type : </p>
                        <p>${element.BranchType}</p>
                    </div>
                    <div class="var">
                        <p>Delivery Status : </p>
                        <p>${element.DeliveryStatus}</p>
                    </div>
                    <div class="var">
                        <p>District : </p>
                        <p>${element.District}</p>
                    </div>
                    <div class="var">
                        <p>Division : </p>
                        <p>${element.Division}</p>
                    </div>
                </div>`
}