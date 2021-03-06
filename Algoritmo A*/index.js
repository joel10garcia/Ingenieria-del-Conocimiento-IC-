$(function () {
    $("#aceptar").on("click", acceptClick);
    $("#calcular").on("click", startClick);
    $("#initSelected").prop("checked", true);
    initTable();
    acceptClick();
    let tdPd = $("td").css("padding");

});
var matrix;
var mouseDown;

function startClick() {
    if (matrix.hasInitialCoord()) {
        clearBoatIcons();
        let dFil = Number($("#filDest").prop("value")) - 1;
        let dCol = Number($("#colDest").prop("value")) - 1;
        let star = null;
        let elem = $("td.selected");
        let split = $(elem).attr("class").split(" ");
        let initCoord = new Coord(Number(split[0].slice(1)), Number(split[1].slice(1)));
        star = new AStar(initCoord, new Coord(dFil, dCol), matrix);
        star.start();
    }
    else{
        alert("No hay coordenada inicial");
    }
}

function clearBoatIcons() {
    $(".path").each(function (index, elem) {
        $(elem).removeClass("path");
    });
}

function acceptClick() {
    $("#calcular").prop("disabled", false);
    $("table").empty();
    let fils = Number($("#numFils").prop("value"));
    let cols = Number($("#numCols").prop("value"));
    let dFil = Number($("#filDest").prop("value")) - 1;
    let dCol = Number($("#colDest").prop("value")) - 1;
    if (fils > 40 || cols > 40) {
        alert("Demasiado grande");
        $("#calcular").prop("disabled", true);
    }
    else if (fils <= 0 || cols <= 0) {
        alert("Demasiado pequeño");
        $("#calcular").prop("disabled", true);
    }
    else if (dFil < 0 || dCol < 0 || dFil > fils || dCol > cols) {
        alert("Posición destino no válida");
        $("#calcular").prop("disabled", true);
    }
    else {
        matrix = new Matrix(fils, cols, dFil, dCol);
        initTable(fils, cols, dFil, dCol);
    }
}

function initTable(fils, cols, dFil, dCol) {
    let table = $("table");
    table.on("mousedown", function () {
        mouseDown = true;
    });
    table.on("mouseup", function () {
        mouseDown = false;
    });

    for (let i = 0; i < fils; i++) {
        let fila = $("<tr></tr>");
        for (let j = 0; j < cols; j++) {
            let col = $("<td></td>");
            col.addClass("f" + i);
            col.addClass("c" + j);
            if (i === dFil && j === dCol)
                col.prop("id", "destination");
            col.on("click", clickPosition);
            col.on("mouseover", function (event) {
                if (mouseDown)
                    clickPosition(event);
            })
            fila.append(col);
        }
        table.append(fila);
    }

    if (cols / 20 > 1) {
        $("td").each(function (key, elem) {
            $(this).css("padding", 20 - (cols / 7))
        });
    }

}

function clickPosition(event) {
    let fila = event.target.classList[0];
    let filaPos = fila.split('f')[1];
    let col = event.target.classList[1];
    let colPos = col.split('c')[1];
    let item = $("." + fila + "." + col);
    if (item.prop("id") !== "destination") {
        if ($("#initSelected").is(":checked")) {  //Inicio marcado
            if (!item.hasClass("block") && !item.hasClass("wind")) {
                if (!item.hasClass("selected")) {
                    if (matrix.hasInitialCoord()) {
                        alert("Ya hay una coordenada de origen");
                    }
                    else {
                        item.removeClass("path");
                        item.addClass("selected");
                        matrix.addInitialCoord(filaPos, colPos);
                    }
                }
                else {
                    item.removeClass("selected");
                    item.css("background-color", "#6495ED");
                    matrix.removeInitialCoord();
                }
            }
        }
        else if($("#blockSelected").is(":checked")){   //Bloque marcado
            if (!item.hasClass("selected") && !item.hasClass("wind")) {//no seleccionado como inicio
                if (!item.hasClass("block")) {
                    item.removeClass("path");
                    item.addClass("block");
                }
                else
                    item.removeClass("block");
            }
        }
        else{   //wind marcado
            if(!item.hasClass("selected") && !item.hasClass("block")){
                if(!item.hasClass("wind")){
                    item.removeClass("path");
                    item.addClass("wind");
                }
                else
                    item.removeClass("wind");

            }
        }
    }
}