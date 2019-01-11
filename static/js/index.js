function apiRequest () {
    let request = new XMLHttpRequest();  // instantiate a new Request

    request.addEventListener('load', function () { // add an event listener to the load event of the request
        let responseData = JSON.parse(this.response);  // parse JSON format into JS responseDataect
        console.log(responseData);
        fillTable(responseData)
    });
    request.open('GET', 'https://swapi.co/api/planets/?page=2');  // set the method and the path
    request.send();  // actually fire the Request

}


function fillTable (responseData) {
    let table_content = responseData['results'];
    let table = document.getElementById('tbody');
    for (let i=0; i<=table_content.length; i++) {
        let row = table.insertRow(i);
        let name_cell = row.insertCell(0);
        name_cell.innerHTML = table_content[i]['name'];
        let diameter_cell = row.insertCell(1);
        diameter_cell.innerHTML = table_content[i]['diameter']+' km';
        diameter_cell.setAttribute('class', 'number');
        group_numbers();
        let climate_cell = row.insertCell(2);
        climate_cell.innerHTML = table_content[i]['climate'];
        let terrain_cell = row.insertCell(3);
        terrain_cell.innerHTML = table_content[i]['terrain'];
        let surfacewater_cell = row.insertCell(4);
            if (table_content[i]['population'] !== 'unknown') {
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
                residents_cell.innerHTML = '<input type="button" class="btn btn-dark" value=\"' + button_value +  button_text + '\">';
            }
        let vote_cell = row.insertCell(7);
        vote_cell.innerHTML = '<input type="button" class="btn btn-dark" value="Vote">';
    }

}
function group_numbers () {
    function numberWithCommas(number) {
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    $(document).ready(function() {
      $(".number").each(function() {
        let num = $(this).text();
        let commaNum = numberWithCommas(num);
        $(this).text(commaNum);
      });
    });
}

apiRequest();
