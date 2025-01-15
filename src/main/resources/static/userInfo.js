const apiUrl = 'http://localhost:8080/api/user';

/**
 * Получение данных текущего пользователя из API и отображение на странице
 */
async function fetchCurrentUser() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const user = await response.json();

        // Отображение имени пользователя и ролей
        document.getElementById('usernamePlaceholder').textContent = user.username;
        document.getElementById('userRoles').textContent = user.roles
            ? user.roles.map(role => role.name.substring(5)).join(', ')
            : 'No roles';

        // Заполнение таблицы информацией о пользователе
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.surname}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles ? user.roles.map(role => role.name.substring(5)).join(', ') : 'No roles'}</td>
            </tr>
        `;
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        document.getElementById('usernamePlaceholder').textContent = 'Error fetching user';
        document.getElementById('userRoles').textContent = '';
    }
}

// Вызов функции для загрузки данных пользователя при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchCurrentUser);