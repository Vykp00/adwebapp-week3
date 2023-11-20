$(document).ready(function() {
    $('#submit-data').click(function(e) {
      e.preventDefault();

      //Get values from input fields
      const name = $('#input-name').val();
      const task = $('#input-task').val();

      // Send a POST request to the server
      $.post('/todo', { name, task }, function(response) {
        // Display the server response
        $('#response-message').html(`<p>${response.response}</p>`);
        //alert(response);
      });
    });

    $('#search').click(function(e) {
      e.preventDefault();

      // Get value from search input
      const searchName = $('#search-name').val();

      // Send a GET request to the server
      $.get(`/user/${searchName}`, function(data) {
        // Display user details
        $('#user-details').html(`<p>Name: ${data.name}</p><p>Todos:</p>`);

        // Display todos and delete task buttons
        const todosList = $('#todos-list');
        todosList.empty();

        data.todos.forEach((todo, index) => {
          const listItem = $(`<li>${todo} <button class="delete-task" data-index="${index}">Delete</button></li>`);
          todosList.append(listItem);
        });

        // Show delete user button
        $('#delete-user').show();       
      }).fail(function(xhr) {
        // Display error message if user not found
        $('#search-results').text(xhr.responseText);

        // Hide delete user button
        $('#delete-user').hide();
      });
    });

    // Handle delete task button clicks
    $('#todos-list').on('click', '.delete-task', function () {
      const taskIndex = $(this).data('index');
      const searchName = $('#search-name').val();

      // Send a PUT request to delete the task
      $.ajax({
        // Update the URL to use the correct path
        url: `/user`,
        type: 'PUT',
        data: { name: searchName, taskIndex: taskIndex },
        success: function (response) {
          // Display the server response
          $('#search-results').text(response);

          // Refresh the todos list
          $('#search').click();
        },
        error: function (xhr) {
          // Display error message if task deletion fails
          $('#search-results').text(xhr.responseText);
        }
      });
    });

    $('#delete-user').click(function(e) {
      e.preventDefault();

      // Get value from search input
      const searchName = $('#search-name').val();

      // Send a DELETE request to the server
      $.ajax({
        url: `/user/${searchName}`,
        type: 'DELETE',
        success: function(response) {
          // Display the server response
          $('#search-results').text(response);

          // Hide delete user button
          $('#delete-user').hide();
        },
        error: function(xhr) {
          // Display error message if user not found
          $('#search-results').text(xhr.responseText);
        }
      });
    });
  })