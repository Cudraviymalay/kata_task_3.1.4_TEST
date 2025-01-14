package ru.kata.spring.boot_security.demo.init_postconstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.DAO.RoleDAO;
import ru.kata.spring.boot_security.demo.DAO.UserDAO;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class InitializationTable {

    private final UserDAO userDAO;
    private final RoleDAO roleDAO;

    @Autowired
    public InitializationTable(UserDAO userDAO, RoleDAO roleDAO) {
        this.userDAO = userDAO;
        this.roleDAO = roleDAO;
    }

    User admin = new User("admin", "admin", 28, "$2a$12$Y03tCK62VmaaZLeWlU8cnelB.m/Y4LOMgnC24UpxsJzOv2UE/Uc0K", "admin@mail.ru");
    User user = new User("user", "user", 28, "$2a$12$oQKP9KHR5an3eHvvK2sGcOEW5Z0zomeLv2mopUN5DqOCJ7u5R9qCa", "user@mail.ru");

    Role roleAdmin = new Role("ROLE_ADMIN");
    Role roleUser = new Role("ROLE_USER");
    Set<Role> setAdmin = new HashSet<>();
    Set<Role> setUser = new HashSet<>();

    @PostConstruct
    public void initializationTable() {
        roleDAO.save(roleAdmin);
        roleDAO.save(roleUser);

        setAdmin.add(roleAdmin);
        admin.setRoles(setAdmin);
        userDAO.save(admin);

        setUser.add(roleUser);
        user.setRoles(setUser);
        userDAO.save(user);
    }
}