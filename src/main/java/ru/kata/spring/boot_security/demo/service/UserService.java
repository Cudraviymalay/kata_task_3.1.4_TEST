package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {

    List<User> getAllUsers();

    void save(User user);

    User getOne(Long id);

    User createUser(User user, Set<Role> roles);

    public void update(Long id, User user);

    User updateUser(Long id, User userFromRequest, Set<Role> roles);

    void delete(Long id);

    public User oneUser(Principal principal);
}