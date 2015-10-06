function whereami() {
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(function(e) {
        showAddress(e.coords.latitude + "," + e.coords.longitude)
    }, function() {
        handleNoGeolocation(!0)
    }) : handleNoGeolocation(!1)
}

function handleNoGeolocation() {
    alert("Could not determine your location.")
}

function positionSuccess(e) {
    {
        var t = e.coords || e.coordinate || e;
        new google.maps.LatLng(t.latitude, t.longitude)
    }
    showAddress(t.latitude + "," + t.longitude)
}

function load(e, t) {
    if (cookieZ = getCookie("zoom"), lastSpot = getCookie("spot"), spotname = getCookie("spotname"), mapCenter = getCookie("mapcenter"), favxy = getCookie("favxy"), checkUnits(), geocoder = new google.maps.Geocoder, mapCenter) {
        var o = mapCenter.replace("(", "").replace(")", "").split(",");
        mapCenterY = o[0], mapCenterX = o[1]
    } else mapCenterY = "49.7", mapCenterX = "-97.7";
    var n = new google.maps.LatLng(1 * mapCenterY, 1 * mapCenterX);
    if (lastSpot) {
        splitSpot = lastSpot.replace("(", "").replace(")", "").split(","), spotY = splitSpot[0], spotX = splitSpot[1];
        var a = new google.maps.LatLng(1 * spotY, 1 * spotX)
    }
    cookieZ || (cookieZ = "3");
    var s = {
        zoom: 1 * cookieZ,
        center: n,
        streetViewControl: !1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    if (map = new google.maps.Map(document.getElementById("map-canvas"), s), oms = new OverlappingMarkerSpiderfier(map), iw = new google.maps.InfoWindow, oms.addListener("click", function(e) {
            iw.setContent(e.desc), iw.open(map, e)
        }), lastSpot ? (enableSpotButtons(), mapClick(a)) : disableSpotButtons(), favxy && enableFavClickedButtons(), google.maps.event.addListener(map, "click", function(e) {
            deleteCookie("spotname"), mapClick(e.latLng)
        }), google.maps.event.addListener(map, "zoom_changed", function() {
            zoomLevel = map.getZoom(), setCookie("zoom", zoomLevel, 1, "/")
        }), google.maps.event.addListener(map, "dragend", function() {
            mapCenter = map.getCenter(), setCookie("mapcenter", mapCenter, 10, "/")
        }), e && t && addFavs(t), e && favxy) {
        var l = favxy.replace("(", "").replace(")", "").split(",");
        favy = l[0], favx = l[1], FavClicked(spotname, favx, favy)
    }
}

function mapClick(e) {
    document.getElementById("NumericalModels").innerHTML = '<img src="./img/loading.gif" alt="loading"> Finding forecasts...', deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), deleteCookie("favxy");
    var t = new google.maps.MarkerImage("target.png", new google.maps.Size(60, 53), new google.maps.Point(0, 0), new google.maps.Point(30, 25));
    marker = new google.maps.Marker({
        position: e,
        map: map,
        draggable: !0,
        raiseOnDrag: !1,
        icon: t
    }), google.maps.event.addListener(marker, "dragend", function(e) {
        endDrag(e.latLng)
    }), markersArray.push(marker), spotX = e.lng(), spotY = e.lat(), document.getElementById("address").value = Math.round(1e5 * spotY) / 1e5 + "," + Math.round(1e5 * spotX) / 1e5, enableSpotButtons(), setCookie("spot", e, 10, "/"), querycatalog(spotX, spotY)
}

function mapDblClick(e) {
    var t = new google.maps.LatLng(e.lat(), e.lng());
    map.panTo(t)
}

function endDrag(e) {
    deletePlottedPolys(), deleteStnFcsts(), document.getElementById("NumericalModels").innerHTML = '<img src="./img/loading.gif" alt="loading"> Finding forecasts...', spotX = e.lng(), spotY = e.lat(), document.getElementById("address").value = Math.round(1e5 * spotY) / 1e5 + "," + Math.round(1e5 * spotX) / 1e5, mapCenter = map.getCenter(), setCookie("mapcenter", mapCenter, 10, "/"), setCookie("spot", e, 10, "/"), deleteCookie("spotname"), querycatalog(e.lng(), e.lat())
}

function centerOnSpot() {
    if (spotX && spotY) {
        var e = new google.maps.LatLng(spotY, spotX);
        map.panTo(e), map.setZoom(8), setCookie("mapcenter", e, 10, "/")
    } else if (favxy = getCookie("favxy"), favxy) {
        var t = favxy.replace("(", "").replace(")", "").split(",");
        favy = t[0], favx = t[1];
        var e = new google.maps.LatLng(favy, favx);
        map.panTo(e), map.setZoom(8), setCookie("mapcenter", e, 10, "/")
    }
}

function showOverlays() {
    if (markersArray)
        for (i in markersArray) markersArray[i].setMap(map)
}

function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) markersArray[i].setMap(null);
        markersArray.length = 0
    }
}

function deleteFavMarkers() {
    if (favsArray)
        for (i in favsArray) favsArray[i].setMap(null)
}

function deletePlottedPolys() {
    if (plottedPolysArray) {
        for (i in plottedPolysArray) plottedPolysArray[i].setMap(null);
        plottedPolysArray.length = 0
    }
}

function deleteStnFcsts() {
    if (StnFcstsArray) {
        for (i in StnFcstsArray) StnFcstsArray[i].setMap(null);
        StnFcstsArray.length = 0
    }
}

function removeSpot() {
    deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), document.getElementById("address").value = "", document.getElementById("NumericalModels").innerHTML = "", document.getElementById("StationForecasts").innerHTML = "", document.getElementById("ZoneForecasts").innerHTML = "", document.getElementById("SpotInfo").innerHTML = "", spotX = "", spotY = "", lastSpot = "", deleteCookie("spot"), disableSpotButtons()
}

function mapdblclick(e, t) {
    map.PanTo(t)
}

function showAddress(e) {
    if (document.getElementById("NumericalModels").innerHTML = '<img src="./img/loading.gif" alt="loading"> Finding forecasts...', deleteCookie("favxy"), /\s*^\-?\d+(\.\d+)?\s*\,\s*\-?\d+(\.\d+)?\s*$/.test(e)) {
        var t = parseLatLng(e);
        if (null == t) document.getElementById("address").value = "";
        else {
            map.setCenter(t), map.setZoom(8), deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), document.getElementById("NumericalModels").innerHTML = '<img src="./img/loading.gif" alt="loading"> Finding forecasts...';
            var o = new google.maps.MarkerImage("target.png", new google.maps.Size(60, 53), new google.maps.Point(0, 0), new google.maps.Point(30, 25));
            marker = new google.maps.Marker({
                position: t,
                map: map,
                draggable: !0,
                raiseOnDrag: !1,
                icon: o
            }), markersArray.push(marker), spotX = t.lng(), spotY = t.lat(), google.maps.event.addListener(marker, "dragend", function(e) {
                endDrag(e.latLng)
            }), enableSpotButtons(), document.getElementById("address").value = Math.round(1e5 * spotY) / 1e5 + "," + Math.round(1e5 * spotX) / 1e5, setCookie("spot", t, 10, "/"), setCookie("mapcenter", t, 10, "/"), deleteCookie("spotname"), querycatalog(spotX, spotY)
        }
    } else geocoder.geocode({
        address: e
    }, function(e, t) {
        if (t == google.maps.GeocoderStatus.OK) {
            map.setCenter(e[0].geometry.location), map.setZoom(8), deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), document.getElementById("NumericalModels").innerHTML = '<img src="./img/loading.gif" alt="loading"> Finding forecasts...';
            var o = new google.maps.MarkerImage("target.png", new google.maps.Size(60, 53), new google.maps.Point(0, 0), new google.maps.Point(30, 25));
            marker = new google.maps.Marker({
                position: e[0].geometry.location,
                map: map,
                draggable: !0,
                raiseOnDrag: !1,
                icon: o
            }), markersArray.push(marker), spotX = e[0].geometry.location.lng(), spotY = e[0].geometry.location.lat(), google.maps.event.addListener(marker, "dragend", function(e) {
                endDrag(e.latLng)
            }), enableSpotButtons(), setCookie("spot", e[0].geometry.location, 10, "/"), setCookie("spotname", e[0].formatted_address, 10, "/"), setCookie("mapcenter", e[0].geometry.location, 10, "/"), querycatalog(spotX, spotY)
        } else alert("Could not find address because: " + t)
    })
}

function codeLatLng() {
    var e = document.getElementById("latlng").value,
        t = e.split(",", 2),
        o = parseFloat(t[0]),
        n = parseFloat(t[1]),
        a = new google.maps.LatLng(o, n);
    geocoder.geocode({
        latLng: a
    }, function(e, t) {
        t == google.maps.GeocoderStatus.OK ? e[1] && (map.setZoom(11), marker = new google.maps.Marker({
            position: a,
            map: map
        }), infowindow.setContent(e[1].formatted_address), infowindow.open(map, marker)) : alert("Geocoder failed due to: " + t)
    })
}

function querycatalog(e, t) {
    document.getElementById("SpotInfo").innerHTML = "", document.getElementById("NumericalModels").innerHTML = "", document.getElementById("StationForecasts").innerHTML = "", document.getElementById("ZoneForecasts").innerHTML = "", getSpotInfo(e, t), getNumericalModels(e, t), getStationForecasts(e, t), getZoneForecasts(e, t), getPolys(e, t), getNowcastPoints(e, t), getScribePoints(e, t), getMeteocodeShortZone(e, t)
}

function getSpotInfo(e, t) {
    if (xmlHttpInfo = GetXmlHttpObject(), null == xmlHttpInfo) return void alert("Browser does not support HTTP Request");
    var o = "./products/spot_info2.php?lat=" + t + "&lon=" + e;
    xmlHttpInfo.onreadystatechange = stateChanged_info, xmlHttpInfo.open("GET", o, !0), xmlHttpInfo.send(null)
}

function getNumericalModels(e, t) {
    if (xmlHttpNM = GetXmlHttpObject(), null == xmlHttpNM) return void alert("Browser does not support HTTP Request");
    var o = "./products/spotcatalog3.php?lat=" + t + "&lon=" + e + "&type=nm";
    xmlHttpNM.onreadystatechange = stateChanged_nm_table, xmlHttpNM.open("GET", o, !0), xmlHttpNM.send(null)
}

function getStationForecasts(e, t) {
    if (xmlHttpStations = GetXmlHttpObject(), null == xmlHttpStations) return void alert("Browser does not support HTTP Request");
    var o = "./products/spotcatalog3.php?lat=" + t + "&lon=" + e + "&type=point";
    xmlHttpStations.onreadystatechange = stateChanged_station_table, xmlHttpStations.open("GET", o, !0), xmlHttpStations.send(null)
}

function getZoneForecasts(e, t) {
    if (xmlHttpZone = GetXmlHttpObject(), null == xmlHttpZone) return void alert("Browser does not support HTTP Request");
    var o = "./products/spotcatalog3.php?lat=" + t + "&lon=" + e + "&type=zone";
    xmlHttpZone.onreadystatechange = stateChanged_zone_table, xmlHttpZone.open("GET", o, !0), xmlHttpZone.send(null)
}

function getPolys(e, t) {
    if (xmlHttpPoly = GetXmlHttpObject(), null == xmlHttpPoly) return void alert("Browser does not support HTTP Request");
    var o = "./products/grib_polys.php?lat=" + t + "&lon=" + e;
    xmlHttpPoly.onreadystatechange = stateChanged_polys, xmlHttpPoly.open("GET", o, !0), xmlHttpPoly.send(null)
}

function getScribePoints(e, t) {
    if (xmlHttpScribe = GetXmlHttpObject(), null == xmlHttpScribe) return void alert("Browser does not support HTTP Request");
    var o = "./products/scribe_points.php?lat=" + t + "&lon=" + e;
    xmlHttpScribe.onreadystatechange = stateChanged_scribe, xmlHttpScribe.open("GET", o, !0), xmlHttpScribe.send(null)
}

function getNowcastPoints(e, t) {
    if (xmlHttpNowcast = GetXmlHttpObject(), null == xmlHttpNowcast) return void alert("Browser does not support HTTP Request");
    var o = "./products/nowcast_points.php?lat=" + t + "&lon=" + e;
    xmlHttpNowcast.onreadystatechange = stateChanged_nowcast, xmlHttpNowcast.open("GET", o, !0), xmlHttpNowcast.send(null)
}

function getMeteocodeShortZone(e, t) {
    if (xmlHttpMCshort = GetXmlHttpObject(), null == xmlHttpMCshort) return void alert("Browser does not support HTTP Request");
    var o = "./products/mc_zone.php?lat=" + t + "&lon=" + e + "&range=short";
    xmlHttpMCshort.onreadystatechange = stateChanged_MCshort, xmlHttpMCshort.open("GET", o, !0), xmlHttpMCshort.send(null)
}

function getMeteocodeExtendedZone(e, t) {
    if (xmlHttpMCext = GetXmlHttpObject(), null == xmlHttpMCext) return void alert("Browser does not support HTTP Request");
    var o = "./products/mc_zone.php?lat=" + t + "&lon=" + e + "&range=extended";
    xmlHttpMCext.onreadystatechange = stateChanged_MCext, xmlHttpMCext.open("GET", o, !0), xmlHttpMCext.send(null)
}

function parseLatLng(e) {
    e.replace("/s//g");
    var t = e.split(","),
        o = parseFloat(t[0]),
        n = parseFloat(t[1]);
    return isNaN(o) || isNaN(n) ? null : new google.maps.LatLng(o, n)
}

function stateChanged_info() {
    document.getElementById("SpotInfo").innerHTML = 4 == xmlHttpInfo.readyState || "complete" == xmlHttpInfo.readyState ? xmlHttpInfo.responseText : '<img src="./img/loading.gif" alt="loading"> Finding Spot Information...'
}

function stateChanged_nm_table() {
    document.getElementById("NumericalModels").innerHTML = 4 == xmlHttpNM.readyState || "complete" == xmlHttpNM.readyState ? xmlHttpNM.responseText : '<p><img src="./img/loading.gif" alt="loading"> Finding Numerical Models...'
}

function stateChanged_station_table() {
    document.getElementById("StationForecasts").innerHTML = 4 == xmlHttpStations.readyState || "complete" == xmlHttpStations.readyState ? xmlHttpStations.responseText : '<p><img src="./img/loading.gif" alt="loading"> Finding Station Forecasts...'
}

function stateChanged_zone_table() {
    document.getElementById("ZoneForecasts").innerHTML = 4 == xmlHttpZone.readyState || "complete" == xmlHttpZone.readyState ? xmlHttpZone.responseText : '<p><img src="./img/loading.gif" alt="loading"> Finding Zone Forecasts...'
}

function stateChanged() {
    document.getElementById("txtHint").innerHTML = 4 == xmlHttp.readyState || "complete" == xmlHttp.readyState ? xmlHttp.responseText : '<img src="./img/loading.gif" alt="loading"> Finding forecasts...'
}

function stateChanged_polys() {
    (4 == xmlHttpPoly.readyState || "complete" == xmlHttpPoly.readyState) && plotPolys(xmlHttpPoly.responseText)
}

function stateChanged_scribe() {
    (4 == xmlHttpScribe.readyState || "complete" == xmlHttpScribe.readyState) && plotScribe(xmlHttpScribe.responseText)
}

function stateChanged_nowcast() {
    (4 == xmlHttpNowcast.readyState || "complete" == xmlHttpNowcast.readyState) && plotNowcast(xmlHttpNowcast.responseText)
}

function stateChanged_MCshort() {
    (4 == xmlHttpMCshort.readyState || "complete" == xmlHttpMCshort.readyState) && (MCShort = xmlHttpMCshort.responseText, getMeteocodeExtendedZone(spotX, spotY))
}

function stateChanged_MCext() {
    (4 == xmlHttpMCext.readyState || "complete" == xmlHttpMCext.readyState) && (MCExtended = xmlHttpMCext.responseText, MCShort.substr(0, MCShort.search("-")) != MCExtended.substr(0, MCExtended.search("-")) ? (plotMC(MCExtended), plotMC(MCShort)) : plotMC(MCShort))
}

function GetXmlHttpObject() {
    var e = null;
    try {
        e = new XMLHttpRequest
    } catch (t) {
        try {
            e = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (t) {
            e = new ActiveXObject("Microsoft.XMLHTTP")
        }
    }
    return e
}

function setCookie(e, t, o, n) {
    var a = new Date;
    a.setTime(a.getTime()), o && (o = 1e3 * o * 60 * 60 * 24);
    var s = new Date(a.getTime() + o);
    document.cookie = e + "=" + escape(t) + (o ? ";expires=" + s.toGMTString() : "") + (n ? ";path=" + n : "")
}

function getCookie(e) {
    var t = document.cookie.split(";"),
        o = "",
        n = "",
        a = "",
        s = !1;
    for (i = 0; i < t.length; i++) {
        if (o = t[i].split("="), n = o[0].replace(/^\s+|\s+$/g, ""), n == e) return s = !0, o.length > 1 && (a = unescape(o[1].replace(/^\s+|\s+$/g, ""))), a;
        o = null, n = ""
    }
    return s ? void 0 : null
}

function deleteCookie(e, t, o) {
    getCookie(e) && (document.cookie = e + "=" + (t ? ";path=" + t : "") + (o ? ";domain=" + o : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT")
}

function makeFav() {
    window.location = "./favorites.php?action=add&lat=" + spotY + "&lon=" + spotX
}

function addFavs(e) {
    var t = new google.maps.MarkerImage("target_favorite.png", new google.maps.Size(40, 35), new google.maps.Point(0, 0), new google.maps.Point(20, 17));
    if (e) {
        e = e.substr(0, e.length - 1);
        var o = e.split(";");
        for (x in o) {
            var n = o[x].split(">>>");
            myLbl = n[0];
            var a = new google.maps.LatLng(1 * n[1], 1 * n[2]),
                s = new MarkerWithLabel({
                    position: a,
                    draggable: !1,
                    map: map,
                    icon: t,
                    visible: !0,
                    title: myLbl,
                    labelContent: myLbl,
                    labelAnchor: new google.maps.Point(10, 30),
                    labelClass: "labels",
                    labelStyle: {
                        opacity: .75,
                        width: "auto"
                    }
                });
            attachCoords(s, myLbl, n[2], n[1]), favsArray.push(s)
        }
    }
}

function plotPolys(e) {
    if (e) {
        var t = e.split(":");
        for (x in t)
            if (t[x]) {
                var o = t[x].split(">>>");
                gribName = o[0], polyColor = o[1], href = o[3], desc = o[4], o[2] = o[2].replace("MULTIPOLYGON(((", ""), o[2] = o[2].replace(")))", ""), coordPairs = o[2].split(",");
                var n = new Array;
                for (y in coordPairs) polyLonLat = coordPairs[y].split(" "), n[y] = new google.maps.LatLng(1 * polyLonLat[1], 1 * polyLonLat[0]);
                var a = [n[0], n[1], n[2], n[3], n[4]];
                gribPoly = new google.maps.Polygon({
                    paths: a,
                    strokeColor: polyColor,
                    strokeOpacity: .8,
                    strokeWeight: 2,
                    fillColor: polyColor,
                    fillOpacity: .1
                }), gribPoly.setMap(map), plottedPolysArray.push(gribPoly), infowindow[x] = new google.maps.InfoWindow, attachInfoWindow(x, gribPoly, href, desc)
            }
    }
}

function plotScribe(e) {
    if (e) {
        var t = e.split(":"),
            o = t[0],
            n = (t[1], t[2]),
            a = t[3],
            s = t[4],
            l = new google.maps.LatLng(1 * n, 1 * a),
            r = new google.maps.MarkerImage("/images/scribe_point.png", new google.maps.Size(25, 25), new google.maps.Point(0, 0), new google.maps.Point(13, 13)),
            i = new google.maps.Marker({
                position: l,
                draggable: !1,
                map: map,
                icon: r,
                visible: !0,
                title: o
            });
        StnFcstsArray.push(i);
        var p = "<b>Station Forecast</b><p>Location: <b>" + o + "</b><br>Elevation: " + s + " meters<br>Environment Canada <b>SCRIBE</b> point<p>";
        for (x in t)
            if (x > 4) {
                var c = t[x].split(">>>");
                desc = c[0], href = c[1], p = p + "<a href = '" + href + "'>" + desc + "</a><br>"
            }
        i.desc = p, oms.addMarker(i)
    }
}

function plotNowcast(e) {
    if (e) {
        var t = e.split(":"),
            o = t[0],
            n = (t[1], t[2]),
            a = t[3],
            s = t[4],
            l = new google.maps.LatLng(1 * n, 1 * a),
            r = new google.maps.MarkerImage("/images/nowcast_point.png", new google.maps.Size(25, 25), new google.maps.Point(0, 0), new google.maps.Point(13, 13)),
            i = new google.maps.Marker({
                position: l,
                draggable: !1,
                map: map,
                icon: r,
                visible: !0,
                title: o
            });
        StnFcstsArray.push(i);
        var p = "<b>Station Forecast</b><p>Location: <b>" + o + "</b><br>Elevation: " + s + " meters<br>Environment Canada <b>NOWCAST</b> point<p>";
        for (x in t)
            if (x > 4) {
                var c = t[x].split(">>>");
                desc = c[0], href = c[1], p = p + "<a href = '" + href + "'>" + desc + "</a><br>"
            }
        i.desc = p, oms.addMarker(i)
    }
}

function plotMC(e) {
    if (e) {
        var t = new google.maps.KmlLayer(urlHome + "/gisdata/meteocode_zones/kmz/" + e + ".kml.kmz", {
            preserveViewport: !0
        });
        t.setMap(map), plottedPolysArray.push(t)
    }
}

function attachInfoWindow(e, t, o, n) {
    google.maps.event.addListener(t, "click", function(a) {
        polyClicked(e, t, o, n, a.latLng)
    })
}

function polyClicked(e, t, o, n, a) {
    infowindow[e].setContent("<b>Numerical Weather Model</b><p>" + n + "<br><a href='" + o + "'>View Graph</a>"), infowindow[e].setPosition(a), infowindow[e].open(map)
}

function attachCoords(e, t, o, n) {
    google.maps.event.addListener(e, "click", function() {
        FavClicked(t, 1 * o, 1 * n)
    })
}

function FavClicked(e, t, o) {
    deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), removeSpot(), setCookie("spotname", e, 10, "/"), setCookie("favxy", "(" + o + "," + t + ")", 10, "/"), enableFavClickedButtons(), querycatalog(t, o)
}

function NavFavClicked(e, t, o) {
    deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), removeSpot(), setCookie("spotname", e, 10, "/"), setCookie("favxy", "(" + o + "," + t + ")", 10, "/"), enableFavClickedButtons(), centerOnSpot(), querycatalog(t, o)
}

function FavDblClicked(e, t, o) {
    deleteOverlays(), deletePlottedPolys(), deleteStnFcsts(), removeSpot(), querycatalog(t, o)
}

function checkUnits() {
    tmpUnits = getCookie("tmpunits"), pcpUnits = getCookie("pcpunits"), presUnits = getCookie("presunits"), windUnits = getCookie("windunits"), null == tmpUnits && setCookie("tmpunits", "C", 1e3, "/"), null == pcpUnits && setCookie("pcpunits", "mm", 1e3, "/"), null == presUnits && setCookie("presunits", "mb", 1e3, "/"), null == windUnits && setCookie("windunits", "kph", 1e3, "/")
}

function enableSpotButtons() {
    document.getElementById("buttonarea").innerHTML = '<button onclick=\'centerOnSpot()\' class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-screenshot"></span> Center</button><button onclick=\'removeSpot()\' class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-remove"></span> Clear Spot </button><button onclick=\'makeFav()\' class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-star"></span> Make Favorite </button>'
}

function disableSpotButtons() {
    document.getElementById("buttonarea").innerHTML = '<button disabled class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-screenshot"></span> Center</button><button disabled class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-remove"></span> Clear Spot </button><button disabled class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-star"></span> Make Favorite </button>'
}

function enableFavClickedButtons() {
    document.getElementById("buttonarea").innerHTML = '<button onclick=\'centerOnSpot()\' class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-screenshot"></span> Center</button><button onclick=\'removeSpot()\' class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-remove"></span> Clear Spot </button><button disabled onclick=\'makeFav()\' class="btn btn-info btn-sm" type="button" style="margin:1px"><span class="glyphicon glyphicon-star"></span> Make Favorite </button>'
}

function CenterControl(e, t) {
    var o = document.createElement("div");
    o.style.backgroundColor = "#fff", o.style.border = "2px solid #fff", o.style.borderRadius = "3px", o.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)", o.style.cursor = "pointer", o.style.marginBottom = "10px", o.style.textAlign = "center", o.title = "Click to center on spot", e.appendChild(o);
    var n = document.createElement("div");
    n.style.color = "rgb(25,25,25)", n.style.fontFamily = "Roboto,Arial,sans-serif", n.style.fontSize = "14px", n.style.lineHeight = "30px", n.style.paddingLeft = "5px", n.style.paddingRight = "5px", n.innerHTML = "Center On Spot", o.appendChild(n), google.maps.event.addDomListener(o, "click", function() {
        t.setCenter(chicago)
    })
}
var map, mapKey, markersArray = [],
    favsArray = [],
    plottedPolysArray = [],
    StnFcstsArray = [],
    geocoder, spotX, spotY, cookieZ, splitSpot, mapCenterY, mapCenterX, Maxlat, Maxlng, MCShort, MCExtended, oms, urlHome = "https://spotwx.com",
    user, infowindow = new Array,
    iw;