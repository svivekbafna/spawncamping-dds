function toggleUpdating() {
    var lockButton = document.getElementById("lockButton");
    if (document.checkingForUpdate == true) {
        lockButton.className = "locked";
        lockButton.title = "Unlock Vizboard"
        document.checkingForUpdate = false;
        clearInterval(document.updater);
        document.updater = null;
    } else {
        lockButton.className = "unlocked"
        lockButton.title = "Lock Vizboard"
        document.updater = setInterval("checkForUpdate()",100);
        document.checkingForUpdate = true;
    }
}

$(document).ready(toggleUpdating);

function checkForUpdate() {
    $.ajax({
        url: "/chart/update",
        success: function(response) {
            if (response != "{}") {
                var servable = JSON.parse(response);
                doAndRedoOnResize(function() {
                    if (document.lastServed) {
                        document.lastServed.clear();
                    }
                    document.getElementById("content").innerHTML = "";
                    if (servable.type == "chart") {
                        document.lastServed = new C3Chart()
                            .header("header")
                            .content("content")
                            .margin({top: 15, right: 15, left: 60})
                            .width(window.innerWidth)
                            .height(window.innerHeight)
                            .data(servable.content)
                            .draw();
                    } else if (servable.type == "table") {
                        document.lastServed = new Table()
                            .header("header")
                            .content("content")
                            .margin({top: 30, right: 0, bottom: 0, left: 0})
                            .width(window.innerWidth)
                            .height(window.innerHeight)
                            .data(servable.content)
                            .draw();
                    } else if (servable.type == "histogram") {
                        document.lastServed = new Histogram()
                            .header("header")
                            .content("content")
                            .margin({top: 30, right: 60, bottom: 60, left: 60})
                            .width(window.innerWidth)
                            .height(window.innerHeight)
                            .data(servable.content)
                            .draw();
                    } else if (servable.type == "graph") {
                        document.lastServed = new Graph()
                            .header("header")
                            .content("content")
                            .width(window.innerWidth)
                            .height(window.innerHeight)
                            .data(servable.content)
                            .draw();
                    } else if (servable.type == "points-2d") {
                        document.lastServed = new Scatter2D()
                            .header("header")
                            .content("content")
                            .margin({top: 20, right: 15, bottom: 60, left: 60})
                            .width(window.innerWidth)
                            .height(window.innerHeight)
                            .data(servable.content)
                            .draw();
                    } else if (servable.type == "matrix") {
                        document.lastServed = new Matrix()
                            .header("header")
                            .content("content")
                            .margin({top: 20, right: 15, bottom: 60, left: 60})
                            .width(window.innerWidth)
                            .height(window.innerHeight)
                            .data(servable.content)
                            .draw();
                    } else {
                        console.log("Unrecognized response: " + response);
                    }
                });
            }
        }
    });
}
