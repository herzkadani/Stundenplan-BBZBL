$(document).ready(function () {

    // load actual date
    var date = new Date();
    $("#date").text(moment(date).format('WW-YYYY'));

    // load berufe and klassen
    loadAllBerufe();
    loadAllKlassen();


    function loadAllBerufe() {
        $.ajax({
            // load berufe for select
            url: "https://sandbox.gibm.ch/berufe.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                var options = "";
                // fill select with options
                $.each(data, function (index, beruf) {
                    options += "<option value='" + beruf.beruf_id + "'>" + beruf.beruf_name + "</option>";
                });
                // append options to select
                $("#beufsgruppe-select").append(options);
                if ($.isEmptyObject(data)) {
                    // show message if no berufe are loaded
                    $("#message").hmtl("Es konnten keine Berufe geladen werden." + "<br>");
                    $("#message").css("display", "block");
                }else{
                    $("#message").css("display", "none");
                }
                // set selected beruf if it is saved in local storage
                if (localStorage.getItem("selectedBeruf") !== null && localStorage.getItem("selectedKlasse") !== null) {
                    $("#beufsgruppe-select").val(localStorage.getItem("selectedBeruf"));
                }else if(localStorage.getItem("selectedBeruf") !== null){
                    $("#beufsgruppe-select").val(localStorage.getItem("selectedBeruf"));
                    $("#beufsgruppe-select").trigger("change");
                }

            },
            error: function (error_msg) {
                // show message if no berufe are loaded
                $("#message").hmtl("Es konnten keine Berufe geladen werden." + "<br>");
                $("#message").css("display", "block");
            }
        });
    }

    function loadAllKlassen() {
        $.ajax({
            // load klassen for select
            url: "https://sandbox.gibm.ch/klassen.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                // fill select with options
                var options = "";
                $.each(data, function (index, klasse) {
                    options += "<option value='" + klasse.klasse_id + "'>" + klasse.klasse_longname + "</option>";
                });
                // append options to select
                $("#klasse-select").append(options);
                // set selected klasse if it is saved in local storage
                if ($.isEmptyObject(data)) {
                    $("#message").hmtl("Es konnten keine Klassen geladen werden."+ "<br>");
                    $("#message").css("display", "block")
                }else{
                    $("#message").css("display", "none")
                }
                // set selected klasse if it is saved in local storage
                if (localStorage.getItem("selectedBeruf") !== null && localStorage.getItem("selectedKlasse") !== null) {
                    $("#klasse-select").val(localStorage.getItem("selectedKlasse"));
                    $("#klasse-select").trigger("change");
                }

            },
            error: function (error_msg) {
                // show message if no klassen are loaded
                $("#message").hmtl("Es konnten keine Klassen geladen werden."+ "<br>");
                $("#message").css("display", "block")
            }


        });
    }

    $("#beufsgruppe-select").change(function () {
        // load klassen for selected beruf
        var selectedBeruf = $(this).val();
        if (selectedBeruf !== "") {
            // save selected beruf in local storage
            localStorage.setItem("selectedBeruf", selectedBeruf);
            $.ajax({
                url: "https://sandbox.gibm.ch/klassen.php?beruf_id=" + selectedBeruf,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    // fill select with options
                    $("#klasse-select").empty();
                    var options = "<option value=''>...</option>";
                    $.each(data, function (index, klasse) {
                        options += "<option value='" + klasse.klasse_id + "'>" + klasse.klasse_longname + "</option>";

                    });
                    $("#klasse-select").append(options);
                }
            });
        } else {
            loadAllKlassen();
        }
    });

    $("#klasse-select").change(function () {
        if ($(this).val() !== "") {
            // save selected klasse in local storage
            localStorage.setItem("selectedKlasse", $(this).val());

            $.ajax({
                url: "https://sandbox.gibm.ch/tafel.php?klasse_id=" + $(this).val() + "&woche=" + $("#date").text(),
                method: "GET",
                dataType: "json",
                success: function (data) {
                    // fill table with data
                    var table_rows = "";
                    $.each(data, function (index, tafel) {
                        table_rows += "<tr class='animation'><td>" + tafel.tafel_datum + "</td><td>" + tafel.tafel_wochentag + "</td><td>" + tafel.tafel_von + "</td><td>" + tafel.tafel_bis + "</td><td>" + tafel.tafel_lehrer + "</td><td>" + tafel.tafel_longfach + "</td><td>" + tafel.tafel_raum + "</td></tr>";

                    });
                    $("tbody").html(table_rows);
                    if ($.isEmptyObject(data)) {
                        // show message if no tafel data is loaded
                        $("#message").html("Es konnten keine Stundenplan-Daten geladen werden." + "<br>");
                        $("#message").css("display", "block")
                    } else {
                        $("#message").css("display", "none")
                    }
                },
                error: function (error_msg) {
                    // show message if no tafel data is loaded
                    $("#message").html("Es konnten keine Stundenplan-Daten geladen werden." + "<br>");
                    $("#message").css("display", "block")
                }

            });
        }
    });

    $("#page-up").click(function () {
        // load next week
        date = moment(date).add(1, 'weeks');
        $("#date").text(moment(date).format('WW-YYYY'));
        $("#klasse-select").trigger("change");
    });

    $("#page-down").click(function () {
        // load previous week
        date = moment(date).subtract(1, 'weeks');
        $("#date").text(moment(date).format('WW-YYYY'));
        $("#klasse-select").trigger("change");
    });


});