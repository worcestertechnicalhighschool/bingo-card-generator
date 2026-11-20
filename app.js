const BOARD_ROWS = 5;
const BOARD_COLS = 5;

document.querySelector("#generate").addEventListener("click", generateCards);
let errors=[];
const printBtn = document.querySelector('#print');
printBtn.addEventListener('click', () => window.print());

const useColumnHeadingsOpt = document.getElementById("useColumnHeadings");

const columnValuesCols = document.querySelectorAll('.columnValues');
const columnLabelsInputs = document.querySelectorAll('.columnLabelInput');

function refreshUseColumnHeadingsOpt() {
    columnLabelsInputs.forEach((elem) => {
        elem.style.display = useColumnHeadingsOpt.checked ? "" : "none";
    });
}

refreshUseColumnHeadingsOpt();

useColumnHeadingsOpt.addEventListener('click', refreshUseColumnHeadingsOpt);

document.querySelector("#clearAll").addEventListener("click", () => {
    for (let col = 0; col < BOARD_COLS; col++) {
        columnValuesCols.forEach(elem => {elem.value = "";})
        columnLabelsInputs.forEach(elem => {elem.value = "";})
    }

    const resetableElements = ["headingCellsBgColor", "cardTextColor", "borderColor", "evenCellColor", "oddCellColor", "cardTitle", "startNum"];
    resetableElements.forEach(id => {
        const elem = document.getElementById(id);
        elem.value = elem.defaultValue;
    });
});

function generateCards(evt) {
    errors=[];

    const numCards = parseInt(document.querySelector('#numCards').value);
    const startNum = parseInt(document.querySelector('#startNum').value);
    const cardTitleField = document.querySelector('#cardTitle');
    const cardTitle = cardTitleField.value.length > 0 ? cardTitleField.value : 'Bingo';

    if (isNaN(startNum)) {
        errors.push('"Start numbering" must contain a number');
    }
    if (isNaN(numCards)) {
        errors.push('"Number of Cards" must contain a number');
    }
    if(numCards < 1) {
        errors.push("You must have at least 1 card");
    }

    let data = [];
    for (let card = 0; card < numCards; card++) {
        let cardRows = [];

        let columns = [];
        columnValuesCols.forEach(elem => {
            let colValues = elem.value.trim().split('\n').map(s=>s.trim());
            colValues.sort(_ => Math.random() -0.5);

            if (colValues.length != BOARD_ROWS)
                errors.push("All columns must have 5 rows of text");

            columns.push(colValues);
        });

        if (useColumnHeadingsOpt.checked) {
            columnLabelsInputs.forEach(elem => {
                if (elem.value.trim().length <= 0)
                    errors.push("All columns must have a label if the 'Use Column Headings' option is checked");
            });
        }

        for (let row = 0; row < BOARD_ROWS; row++) {
            for (let col = 0; col < BOARD_COLS; col++) {
                cardRows.push(columns[col][row]);
            }
        }

        if (document.getElementById("middleCellFree").checked)
            cardRows[12] = "FREE";
        
        data.push(cardRows);
    }

    if(errors.length>0) {
        document.querySelector('#validation').innerHTML = errors.map(e=> `<li>${e}</li>`).join('');
        return;
    }

    renderCards(data, cardTitle, startNum);
}

function renderCards(data, title, n) {
    let template = ``;

    const cardTitle = document.getElementById("cardTitle").value;
    const titleBgColor = document.getElementById("titleBgColor").value;
    const headingCellsColor = document.getElementById("headingCellsBgColor").value;
    const cardTextColor = document.getElementById("cardTextColor").value;
    const borderColor = document.getElementById("borderColor").value;
    const evenBgColor = document.getElementById("evenCellColor").value;
    const oddBgColor = document.getElementById("oddCellColor").value;
    const showCardNo = document.getElementById("showCardNo").checked;
    const useColumnHeadings = document.getElementById("useColumnHeadings").checked;

    for (let i=0;i<data.length;i++) {
        template += `<div class="page"><section class="card" style="color: ${cardTextColor}; border-color: ${borderColor} !important;">
            <header style="background-color: ${titleBgColor};">
                <h1>${cardTitle}</h1>
                ${showCardNo ? `<span class="no">Card No.: ${n+i}</span>` : ""}
            </header>
            <main>
            `
        
        if (useColumnHeadings) {
            for (let col = 0; col < BOARD_COLS; col++) {
                template += `<div class="cell" style="background-color: ${headingCellsColor}">
                    <h2>
                    ${document.getElementById(`column${col}Label`).value.trim()}
                    </h2>
                </div>`
            }
        }

        for (let j=0; j<data[i].length; j++) {
            template += `<div class="cell" style="background-color: ${j % 2 == 0 ? evenBgColor : oddBgColor}">${ data[i][j] }</div>`
        }
        template += `</main></section></div>`;
    }
    document.querySelector('#print').disabled = false;
    document.querySelector('#cards').innerHTML = template;
    // console.log(data)
}