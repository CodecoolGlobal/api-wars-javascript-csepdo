function turnPage(e) {
    e.stopPropagation();
    let next_source = e.target.dataset['source'];
    fetch(next_source)
        .then((response) => response.json())
        .then((data) => {
            fillTable(data)
        });
}

function apiRequest(source) {
    let pageTurner = document.getElementById('page-turner');
    pageTurner.addEventListener('click', turnPage);
    let modalButton = document.getElementsByClassName('residents-button');
    fetch(source)
        .then((response) => response.json())
        .then((data) => {
            fillTable(data);
        })
}


function modifyPageButtons(data) {
    if (data['next'] === null) {
        document.getElementById('next-page').parentElement.classList.add('disabled');
    } else {
        document.getElementById('next-page').parentElement.classList.remove('disabled');
        document.getElementById('next-page').setAttribute('data-source', data['next']);
    }
    if (data['previous'] === null) {
        document.getElementById('previous-page').parentElement.classList.add('disabled');
    }
    else {
        document.getElementById('previous-page').parentElement.classList.remove('disabled');
        document.getElementById('previous-page').setAttribute('data-source', data['previous']);
    }
}


function fillTable(data) {
    let table_content = data['results'];
    let table = document.getElementById('tbody');
    modifyPageButtons(data);
    table.innerHTML = '';
    if (table_content) {
        let i = 0;
        for (i; i < table_content.length; i++) {
            let row = table.insertRow(i);
            let name_cell = row.insertCell(0);
            name_cell.innerHTML = table_content[i]['name'];
            let diameter_cell = row.insertCell(1);
            diameter_cell.innerHTML = table_content[i]['diameter'] + ' km';
            diameter_cell.setAttribute('class', 'number');
            group_numbers();
            let climate_cell = row.insertCell(2);
            climate_cell.innerHTML = table_content[i]['climate'];
            let terrain_cell = row.insertCell(3);
            terrain_cell.innerHTML = table_content[i]['terrain'];
            let surfacewater_cell = row.insertCell(4);
            if (table_content[i]['surface_water'] !== 'unknown') {
                surfacewater_cell.innerHTML = table_content[i]['surface_water'] + '%';
            } else {
                surfacewater_cell.innerHTML = 'unknown'
            }
            let population_cell = row.insertCell(5);
            if (table_content[i]['population'] !== 'unknown') {
                population_cell.innerHTML = table_content[i]['population'] + ' people';
                population_cell.setAttribute('class', 'number');
                group_numbers();
            } else {
                population_cell.innerHTML = 'unknown';
            }
            let residents_cell = row.insertCell(6);
            if (table_content[i]['residents'].length === 0) {
                residents_cell.innerHTML = 'No known residents';
            } else {
                let button_value = table_content[i]['residents'].length.toString();
                let button_text = ' resident(s)';
                residents_cell.innerHTML = '<input type="button" class="btn btn-dark residents-button" value=\"' + button_value + button_text + '\">';
                $(residents_cell).on('dialog');
                fillModal()
            }
            let vote_cell = row.insertCell(7);
            vote_cell.innerHTML = '<input type="button" class="btn btn-dark vote-button" value="Vote">';
            if (document.getElementById('session-user')) {
                $('.vote-button').show()
            } else {
                $('.vote-button').hide()
            }
        }
    }
}


function fillModal() {

}


function group_numbers() {
    function numberWithCommas(number) {
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    $(document).ready(function () {
        $(".number").each(function () {
            let num = $(this).text();
            let commaNum = numberWithCommas(num);
            $(this).text(commaNum);
        });
    });
}


apiRequest('https://swapi.co/api/planets/');
