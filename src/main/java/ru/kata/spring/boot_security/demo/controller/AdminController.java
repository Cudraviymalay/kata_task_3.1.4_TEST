package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    final UserService userService;
    final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public String getUsers(Model model, Principal principal) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("user", userService.oneUser(principal));
        return "users";
    }

    @GetMapping("/new")
    public String newUser(Model model, Principal principal) {
        model.addAttribute("user", new User());
        model.addAttribute("user", userService.oneUser(principal));
        return "new";
    }

    @PostMapping("/new")
    public String addUser(@ModelAttribute User user, @RequestParam(value = "role") Set<Role> roles) {
        userService.save(userService.createUser(user, roles));
        return "redirect:/admin/";
    }

    @PostMapping("/update")
    public String update(@ModelAttribute("user") User user,
                         @RequestParam(value = "role", required = false) Set<Role> roleNames,
                         @RequestParam(value = "id") long id) {
        userService.update(id, userService.updateUser(id, user, roleNames));
        return "redirect:/admin/";
    }

    @PostMapping("/delete")
    public String delete(@RequestParam("id") long id) {
        userService.delete(id);
        return "redirect:/admin/";
    }

    @GetMapping("/user")
    public String user(Model model, Principal principal) {
        model.addAttribute("user", userService.oneUser(principal));
        return "userAdminInfo";
    }
}