const url = 'http://localhost:8080/api/admin';

async function getRoles() {
    return await fetch("http://localhost:8080/api/admin/roles").then(response => response.json());
}

function listRoles() {
    let tmp = '';
    getRoles().then(roles => roles.forEach(role => {
        tmp += `<option value="${role.id}">${role.name}</option>`;
    })).then(r => {
        console.log('listRoles');
        document.getElementById('editRole').innerHTML = tmp;
        document.getElementById('deleteRole').innerHTML = tmp;
        document.getElementById('role_select').innerHTML = tmp;
    });
}

listRoles();

function getUserData() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            loadTable(data);
        });
}

function getAllUsers() {
    fetch(url).then(response => response.json()).then(user =>
        loadTable(user));
}

function loadTable(listAllUsers) {
    let res = '';
    for (let user of listAllUsers) {
        res +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.roles ? user.roles.map(role => " " + role.name.substring(5)) : ""}</td>
                <td>
                    <button class="btn btn-info" type="button"
                    data-bs-toggle="modal" data-bs-target="#editModal"
                    onclick="editModal(${user.id})">Edit</button></td>
                <td>
                    <button class="btn btn-danger" type="button"
                    data-bs-toggle="modal" data-bs-target="#deleteModal"
                    onclick="deleteModal(${user.id})">Delete</button></td>
            </tr>`;
    }
    document.getElementById('tableBodyAdmin').innerHTML = res;
}

getAllUsers();

// Новый юзер
document.getElementById('newUserForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let role = document.getElementById('role_select');
    let rolesAddUser = [];
    for (let i = 0; i < role.options.length; i++) {
        if (role.options[i].selected) {
            rolesAddUser.push({id: role.options[i].value, role: 'ROLE_' + role.options[i].innerHTML});
        }
    }
    fetch(url + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            username: document.getElementById('newName').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            roles: rolesAddUser
        })
    })
        .then((response) => {
            if (response.ok) {
                getUserData();
                document.getElementById("show-users-table").click();
            }
        });
});

//Изменение юзера
function editModal(id) {
    fetch(url + '/users/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(async u => {
            document.getElementById('editId').value = u.id;
            document.getElementById('editNameU').value = u.username;
            document.getElementById('editEmail').value = u.email;
            document.getElementById('editPassword').value = u.password;
            const allRoles = await getRoles();

            const rolesSelect = document.getElementById('editRole');
            rolesSelect.innerHTML = '';

            allRoles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                option.selected = u.roles && u.roles.some(userRole => userRole.id === role.id);
                rolesSelect.appendChild(option);
            });
        });
    });
}

async function editUser() {
    const rolesSelect = document.getElementById('editRole');

    let idValue = document.getElementById("editId").value;
    let nameValue = document.getElementById('editNameU').value;
    let emailValue = document.getElementById('editEmail').value;
    let passwordValue = document.getElementById("editPassword").value;
    let listOfRole = [];
    for (let i = 0; i < rolesSelect.options.length; i++) {
        if (rolesSelect.options[i].selected) {
            let tmp = {};
            tmp["id"] = rolesSelect.options[i].value;
            listOfRole.push(tmp);
        }
    }
    let user = {
        id: idValue,
        username: nameValue,
        email: emailValue,
        password: passwordValue,
        roles: listOfRole
    };
    await fetch(url + '/users/' + user.id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
    });
    closeModal();
    getUserData();
}

// Удаление юзера
function deleteModal(id) {
    fetch(url + '/users/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(u => {
            document.getElementById('deleteId').value = u.id;
            document.getElementById('deleteNameU').value = u.username;
            document.getElementById('deleteEmail').value = u.email;
            const rolesContainer = document.getElementById('deleteRole');
            rolesContainer.innerHTML = '';
            u.roles.forEach(role => {
                const option = document.createElement('option');
                option.textContent = role.name;
                rolesContainer.appendChild(option);
            });
        });
    });
}

async function deleteUser() {
    const id = document.getElementById("deleteId").value;
    console.log(id);
    let urlDel = url + "/users/" + id;
    let method = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    };

    fetch(urlDel, method).then(() => {
        closeModal();
        getUserData();
    });
}

function closeModal() {
    document.querySelectorAll(".btn-close").forEach((btn) => btn.click());
}

function getCurrentUser() {
    fetch('http://localhost:8080/api/user')
        .then(res => res.json())
        .then(user => {
            document.getElementById('usernamePlaceholder').textContent = user.username;
            document.getElementById('userRoles').textContent = user.roles ? user.roles.map(role => role.name.substring(5)).join(', ') : "";
        });
}

getCurrentUser();

// Обработка клика  new user
document.getElementById('show-new-user-form').addEventListener('click', function (event) {
    event.preventDefault();
    var tab = new bootstrap.Tab(this);
    tab.show();
});