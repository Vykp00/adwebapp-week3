// public/javascripts/app.js

document.addEventListener('DOMContentLoaded', function () {
// Function to send a POST request
function postRequest(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        callback(xhr.responseText);
    }
    };
    xhr.send(JSON.stringify(data));
}

// Function to send a GET request
function getRequest(url, callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
        callback(JSON.parse(xhr.responseText));
        } else {
        errorCallback(xhr.responseText);
        }
    }
    };
    xhr.send();
}

// Function to send a DELETE request
function deleteRequest(url, callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
        callback(xhr.responseText);
        } else {
        errorCallback(xhr.responseText);
        }
    }
    };
    xhr.send();
}

// Function to send a PUT request
function putRequest(url, data, callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
        callback(xhr.responseText);
        } else {
        errorCallback(xhr.responseText);
        }
    }
    };
    xhr.send(JSON.stringify(data));
}

// Event listener for submitting data
document.getElementById('submit-data').addEventListener('click', function (e) {
    e.preventDefault();
    var name = document.getElementById('input-name').value;
    var task = document.getElementById('input-task').value;

    // Send a POST request to the server
    postRequest('/todo', { name: name, task: task }, function (response) {
        // Parse the JSON response
        var jsonResponse = JSON.parse(response);
    // Display the server response
    document.getElementById('response-message').innerText = jsonResponse.response;
    });
});

// Event listener for searching user
document.getElementById('search').addEventListener('click', function (e) {
    e.preventDefault();
    var searchName = document.getElementById('search-name').value;

    // Send a GET request to the server
    getRequest(`/user/${searchName}`, function (data) {
    // Display user details
    var userDetails = document.getElementById('user-details');
    userDetails.innerHTML = `<p>Name: ${data.name}</p><p>Todos:</p>`;

    // Display todos and delete task buttons
    var todosList = document.getElementById('todos-list');
    todosList.innerHTML = '';
    data.todos.forEach(function (todo, index) {
        var listItem = document.createElement('li');
        listItem.innerHTML = `${todo} <button class="delete-task" data-index="${index}">Delete</button>`;
        todosList.appendChild(listItem);
    });

    // Show delete user button
    document.getElementById('delete-user').style.display = 'block';
    }, function (error) {
    // Display error message if user not found
    document.getElementById('search-results').innerText = error;

    // Hide delete user button
    document.getElementById('delete-user').style.display = 'none';
    });
});

// Event listener for delete task button clicks
document.getElementById('todos-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-task')) {
    var taskIndex = e.target.dataset.index;
    var searchName = document.getElementById('search-name').value;

    // Send a PUT request to delete the task
    putRequest('/user', { name: searchName, taskIndex: taskIndex }, function (response) {
        // Display the server response
        document.getElementById('search-results').innerText = response;

        // Refresh the todos list
        document.getElementById('search').click();
    }, function (error) {
        // Display error message if task deletion fails
        document.getElementById('search-results').innerText = error;
    });
    }
});

// Event listener for delete user button
document.getElementById('delete-user').addEventListener('click', function (e) {
    e.preventDefault();
    var searchName = document.getElementById('search-name').value;

    // Send a DELETE request to the server
    deleteRequest(`/user/${searchName}`, function (response) {
    // Display the server response
    document.getElementById('search-results').innerText = response;

    // Hide delete user button
    document.getElementById('delete-user').style.display = 'none';
    }, function (error) {
    // Display error message if user not found
    document.getElementById('search-results').innerText = error;
    });
});
});