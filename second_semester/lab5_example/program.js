const marginX = 50;
const marginY = 50;
const height = 400;
const width = 800;

let svg = d3.select("svg").attr("height", height).attr("width", width);


d3.select("#showTable")
    .on('click', function () {
        let buttonValue = d3.select(this);
        let table = d3.select("div.table").select("table");

        if (buttonValue.property("value") === "Показать таблицу") {
            buttonValue.attr("value", "Скрыть таблицу");
            let table = d3.select("div.table").select("table");
            let thead = table.append("thead");
            let tbody = table.append("tbody");
            // создание строк таблицы (столько, сколько элементов в массиве books)
            let rows = table.select("tbody").selectAll("tr").data(buildings).enter().append('tr').style("display", "");
            // создание ячеек каждой строки на основе каждого элемента массива books
            let cells = rows.selectAll("td").data(d => Object.values(d)).enter().append("td").text(d => d);
            // создание шапки таблицы
            let head = table.select("thead").selectAll("th").data(d => Object.keys(buildings[0])).enter().append("td").text(d => d);
        } else {
            buttonValue.attr("value", "Показать таблицу");
            let table = d3.select("div.table").select("table");
            let thead = table.select("thead").selectAll("td").remove();
            let tbody = table.select("tbody").selectAll("tr").remove();
            table.select("tbody").remove();
            table.select("thead").remove();
        }
    });

function createArrGraph(data, key) {

    groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];
    for (let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d['Высота']));
        arrGraph.push({ labelX: entry[0], values: minMax });
    }
    return arrGraph;
}

function drawGraph(data) {
    // значения по оси ОХ
    const keyX = data.ox.value;

    // значения по оси ОУ
    const isMin = data.oy[1].checked;
    const isMax = data.oy[0].checked;

    // создаем массив для построения графика
    const arrGraph = createArrGraph(buildings, keyX);

    svg.selectAll('*').remove();

    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(arrGraph, isMin, isMax);

    // рисуем графики
    if (isMin) {
        createChart(arrGraph, scX, scY, 0, "blue")
    }
    if (isMax) {
        createChart(arrGraph, scX, scY, 1, "red")
    }
}

const createAxis = (data) => {
    let firstRange = d3.extent(data.map((d) => Number(d.values[0])));
    let secondRange = d3.extent(data.map((d) => Number(d.values[1])));
    let min = firstRange[0];
    let max = secondRange[1];

    let scaleX = d3
        .scaleBand()
        .domain(data.map((d) => d.labelX))
        .range([0, width - 2 * marginX]);

    let scaleY = d3
        .scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([height - 2 * marginY, 0]);

    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY); // вертикальная

    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", (d) => "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
};

function createChart(arrGraph, scaleX, scaleY, index, color) {
    const r = 4;
    let ident = index == 0 ? -r / 2 : r / 2;

    svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", (d) => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", (d) => scaleY(d.values[index]) + ident)
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .style("fill", color);
}

