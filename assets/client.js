$(() => {
    let Geo = false;

    // MeteoService
    function UI(data) {
        if (data) {
            $("img#icon").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            $("link#IconLink").attr('href', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        };

        window.onresize = resize = () => {
            if (window.innerWidth <= 800) {
                $("nav").removeClass("d-inline-flex");
                $("nav").addClass("d-flex flex-row");

                $("nav a").addClass("w-100");
                $("nav div").addClass("w-100");
                $("nav a").removeClass("w-auto");
                $("nav div").removeClass("w-auto");

                $("div#Body").removeClass("justify-content-around mt-11");
                $("div#Body").addClass("flex-column mt-30");
                $("div#CardGeo").addClass("mt-1");
            } else if (window.innerWidth >= 801) {
                $("nav").addClass("d-inline-flex");
                $("nav").removeClass("d-flex flex-row");

                $("nav a").removeClass("w-100");
                $("nav div").removeClass("w-100");
                $("nav a").addClass("w-auto");
                $("nav div").addClass("w-auto");

                $("div#Body").addClass("justify-content-around mt-11");
                $("div#Body").removeClass("flex-column mt-30");
                $("div#CardGeo").removeClass("mt-1");
            };
        };

        resize();

        var html = `
        <div aria-live="assertive" aria-atomic="true" class="toast" id="UIToast" data-delay="10000">
            <div class="toast-header d-flex justify-content-between">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                <strong class="text-center">UI Service</strong>
                <button type="button" class="mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body bg-success">
                The UI service has just started correctly!
            </div>
        </div>
        `;

        if ($('div#UIToast')[0] === undefined) {
            $("div#notif").append(html);
        };

        $("div#UIToast").toast('show');
    };

    function Weather(data, UV) {
        var html = ``;

        if (data.weather[0].main === "Rain") {
            html = `
            Description : ${data.weather[0].description} <br>
            Temperature : ${data.main.temp} °C <br>
            Pressure : ${data.main.pressure} hPa <br>
            Humidity : ${data.main.humidity} % <br>
            Visibility : ${data.visibility} m <br>
            UV : ${UV.value} <br>
            Wind : <br>
                - Speed : ${data.wind.speed} m/s <br>
                - Direction : ${data.wind.deg} ° <br>
                - Gust : ${data.wind.gust} m/s <br>
            Clouds : ${data.clouds.all} % <br>
            Rain :<br>
                - Volume -1h : ${data.rain["1h"]} mm
            `;
        } else if (data.weather[0].main === "Snow") {
            html = `
            Description : ${data.weather[0].description} <br>
            Temperature : ${data.main.temp} °C <br>
            Pressure : ${data.main.pressure} hPa <br>
            Humidity : ${data.main.humidity} % <br>
            Visibility : ${data.visibility} m <br>
            UV : ${UV.value} <br>
            Wind : <br>
                - Speed : ${data.wind.speed} m/s <br>
                - Direction : ${data.wind.deg} ° <br>
                - Gust : ${data.wind.gust} m/s <br>
            Clouds : ${data.clouds.all} % <br>
            Snow : <br>
                - Volume -1h : ${data.snow["1h"]} mm
            `;
        } else {
            html = `
            Description : ${data.weather[0].description} <br>
            Temperature : ${data.main.temp} °C <br>
            Pressure : ${data.main.pressure} hPa <br>
            Humidity : ${data.main.humidity} % <br>
            Visibility : ${data.visibility} m <br>
            UV : ${UV.value} <br>
            Wind : <br>
                - speed : ${data.wind.speed} m/s <br>
                - Direction : ${data.wind.deg} ° <br>
                - gust : ${data.wind.gust} m/s <br>
            Clouds : ${data.clouds.all} %`;
        };

        return html;
    }

    // First Launch Site
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function SuccessCallBack(pos) {
        $("svg#IconNotifGeo").removeClass("text-danger");
        $("svg#IconNotifGeo").addClass("text-success");
        $("p#AccuracyGeo").html(pos.coords.accuracy + " %");
        Geo = true;

        var html = `
        <div aria-live="assertive" aria-atomic="true" class="toast " id="GeoToast" data-delay="10000">
            <div class="toast-header d-flex justify-content-between">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                <strong class="text-center">Coordinate Service</strong>
                <button type="button" class="mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body bg-success">
                The coordinate service has located you correctly!
            </div>
        </div>
        `;

        $("div#notif").html(html);
        $("div#GeoToast").toast('show');

        $.post("/env", { "list": "API_OWM_*" }, (data) => {
            $.get(`${data.API_OWM_LINK}lat=${pos.coords.latitude}&lon=${pos.coords.longitude}${data.API_OWM_KEY}`, (DataJson) => {
                UI(DataJson);

                $.get(`https://restcountries.eu/rest/v2/alpha/${DataJson.sys.country}`, (DataJsonCountry) => {
                    $("img#NotifPaysFlag").attr('src', `${DataJsonCountry.flag}`);
                    $("p#NotifPays").html(DataJson.sys.country);

                    $.get(`${data.API_OWM_LINKUV}lat=${pos.coords.latitude}&lon=${pos.coords.longitude + data.API_OWM_KEY}`, (DataUV) => {
                        var htmlW = `
                        <div class="card ml-auto mr-auto w-auto" style="height: fit-content">
                            <img src="https://openweathermap.org/img/wn/${DataJson.weather[0].icon}@4x.png" class="card-img-top " alt="${DataJson.weather[0].description}">
                            <div class="card-body ">
                                <p>
                                    ${Weather(DataJson, DataUV)}
                                </p>
                            </div>
                        </div>
                        <div id="CardGeo" class="card ml-auto mr-auto w-auto" style="height: fit-content">
                            <div class="card-body ">
                                <p>
                                Coordinate : </br>
                                    - Longitude = ${DataJson.coord.lon}</br>
                                    - Latitude = ${DataJson.coord.lat}</br>
                                City :</br>
                                    - Name = ${DataJson.name}</br>
                                    - ID = ${DataJson.id}</br>
                                    - Country = ${DataJsonCountry.name} <img class="rounded" style="width: 20px;" src="${DataJsonCountry.flag}"></br>
                                </p>
                            </div>
                        </div>
                            `;

                        $("div#Body").html(htmlW);

                    });
                });
            });
        });

    };

    function ErrorCallBack(err) {
        $("svg#IconNotifGeo").addClass("text-danger");
        $("svg#IconNotifGeo").removeClass("text-success");
        $("p#AccuracyGeo").html("");
        Geo = false;
        UI(undefined);

        var html = `
        <div aria-live="assertive" aria-atomic="true" class="toast" id="GeoToast" data-delay="10000">
            <div class="toast-header d-flex justify-content-between">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
                <strong class="text-center">Coordinate Service</strong>
                <button type="button" class="mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body bg-danger">
                The coordinates service has not found you correctly!
            </div>
            <div class="toast-footer">
                <button id="RetryGeo" class="btn btn-outline-light btn-block">Retry</button>
            </div>
        </div>
                `;

        $("div#notif").html(html);
        $("div#GeoToast").toast('show');

        $("button#RetryGeo").click((e) => {
            GetGeolocation();
        });
    };

    function GetGeolocation() {
        navigator.geolocation.getCurrentPosition(SuccessCallBack, ErrorCallBack, options)
    };

    GetGeolocation();

    // UI CLIENT EVENT

    function main() {
        $.post("/env", { "list": "API_OWM_*" }, (data) => {
            if ($("input#INameVille").val() !== null || $("input#INameVille").val() !== "" || $("input#INameVille").val() !== undefined) {
                $.get((data.API_OWM_LINK + 'q=' + ($("input#INameVille").val()) + data.API_OWM_KEY), (DataJson, textStatus) => {

                    if (textStatus !== "success") {
                        $("input#INameVille").addClass("is-invalid");
                    } else {
                        UI(DataJson);

                        $.get(`https://restcountries.eu/rest/v2/alpha/${DataJson.sys.country}`, (DataJsonCountry) => {
                            $.get(`${data.API_OWM_LINKUV}lat=${DataJson.coord.lat}&lon=${DataJson.coord.lon + data.API_OWM_KEY}`, (DataUV) => {
                                var html = `
                                <div class="card ml-auto mr-auto w-auto" style="height: fit-content">
                                    <img src="https://openweathermap.org/img/wn/${DataJson.weather[0].icon}@4x.png" class="card-img-top " alt="${DataJson.weather[0].description}">
                                    <div class="card-body ">
                                        <p>
                                            ${Weather(DataJson, DataUV)}
                                        </p>
                                    </div>
                                </div>
                                <div id="CardGeo" class="card ml-auto mr-auto w-auto" style="height: fit-content">
                                    <div class="card-body ">
                                        <p>
                                        Coordinate : </br>
                                            - Longitude = ${DataJson.coord.lon}</br>
                                            - Latitude = ${DataJson.coord.lat}</br>
                                        City :</br>
                                            - Name = ${DataJson.name}</br>
                                            - ID = ${DataJson.id}</br>
                                            - Country = ${DataJsonCountry.name} <img class="rounded" style="width: 20px;" src="${DataJsonCountry.flag}"></br>
                                        </p>
                                    </div>
                                </div>
                                    `;

                                $("div#Body").html(html);

                            });
                        });
                    };
                });
            } else {
                $("input#INameVille").addClass("is-invalid");
            };
        });

    }

    $("button#nameVille").click((e) => {
        if ($('input#INameVille').val() !== undefined || $('input#INameVille').val() !== "" || $('input#INameVille').val() !== null) main()
    });

    $(window).keypress((e) => {
        if (e.key === "Enter" && ($('input#INameVille').val() !== undefined || $('input#INameVille').val() !== "" || $('input#INameVille').val() !== null)) main();
    });
});