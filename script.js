$(document).ready(function () {

    // load actual date
    var date = new Date();
    $("#date").text(moment(date).format('WW-YYYY'));

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
                $.each(data, function (index, beruf) {
                    options += "<option value='" + beruf.beruf_id + "'>" + beruf.beruf_name + "</option>";
                });
                $("#beufsgruppe-select").append(options);
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
                var options = "";
                $.each(data, function (index, klasse) {
                    options += "<option value='" + klasse.klasse_id + "'>" + klasse.klasse_longname + "</option>";
                });
                $("#klasse-select").append(options);
            }

        });
    }

    $("#beufsgruppe-select").change(function () {
        var selectedBeruf = $(this).val();
        if (selectedBeruf !== "") {
            $.ajax({
                url: "https://sandbox.gibm.ch/klassen.php?beruf_id=" + selectedBeruf,
                method: "GET",
                dataType: "json",
                success: function (data) {
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
        console.log("https://sandbox.gibm.ch/tafel.php?klasse_id=" + $(this).val() + "&woche=" + $("#date").text());
        $.ajax({
            url: "https://sandbox.gibm.ch/tafel.php?klasse_id=" + $(this).val() + "&woche=" + $("#date").text(),
            method: "GET",
            dataType: "json",
            success: function (data) {
                var table_rows = "";
                $.each(data, function (index, tafel) {
                    table_rows += "<tr><td>" + tafel.tafel_datum + "</td><td>" + tafel.tafel_wochentag + "</td><td>" + tafel.tafel_von + "</td><td>" + tafel.tafel_bis + "</td><td>" + tafel.tafel_lehrer + "</td><td>" + tafel.tafel_longfach + "</td><td>" + tafel.tafel_raum + "</td></tr>";

                });
                $("tbody").html(table_rows);
            }
        });

    });


});