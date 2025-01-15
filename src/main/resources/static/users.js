$(document).ready(function() {
    // Fetch user info
// Fetch user info
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            $('#username').text(data.username);

            // Если roles - это массив объектов, возьмите нужное свойство
            let roleNames = data.roles.map(role => role.name.substring(5)); // Преобразуем в массив строк
            $('#userRoles').text(roleNames.join(', '));  // Отображаем роли как строку
        });


    // Fetch all users
    fetch('/api/admin/users')
        .then(response => response.json())
        .then(users => {
            let tableBody = $('#userTableBody');
            users.forEach(user => {
                // Если roles - это массив объектов, возьмите нужное свойство (например, user.roles[i].name)
                let roles = user.roles.map(role => role.name.substring(5)); // Преобразуем каждый объект в строку
                tableBody.append(`
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.surname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${roles.join(', ')}</td>
                        <td>
                            <button class="btn btn-primary editUserBtn" data-id="${user.id}">Edit</button>
                        </td>
                        <td>
                            <button class="btn btn-danger deleteUserBtn" data-id="${user.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });

            // Edit user button click
            $('.editUserBtn').click(function() {
                const userId = $(this).data('id');
                fetch(`/api/admin/users/${userId}`)
                    .then(response => response.json())
                    .then(user => {
                        $('#editName').val(user.username);
                        $('#editLastName').val(user.surname);
                        $('#editAge').val(user.age);
                        $('#editEmail').val(user.email);
                        $('#editRoles').val(user.roles);
                        $('#editUserForm').submit(function(e) {
                            e.preventDefault();
                            // Submit updated user data
                            fetch(`/api/admin/users/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    username: $('#editName').val(),
                                    surname: $('#editLastName').val(),
                                    age: $('#editAge').val(),
                                    email: $('#editEmail').val(),
                                    roles: $('#editRoles').val()
                                })
                            }).then(() => {
                                location.reload();
                            });
                        });
                    });
            });

            // Delete user button click
            $('.deleteUserBtn').click(function() {
                const userId = $(this).data('id');
                fetch(`/api/admin/users/${userId}`)
                    .then(response => response.json())
                    .then(user => {
                        $('#deleteUserForm').submit(function(e) {
                            e.preventDefault();
                            // Submit delete request
                            fetch(`/api/admin/users/${userId}`, {
                                method: 'DELETE'
                            }).then(() => {
                                location.reload();
                            });
                        });
                    });
            });
        });

    // Logout button click
    $('#logoutButton').click(function() {
        fetch('/logout', {
            method: 'POST'
        }).then(() => {
            window.location.href = '/';
        });
    });
});