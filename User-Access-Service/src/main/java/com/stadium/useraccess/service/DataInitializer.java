package com.stadium.useraccess.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.stadium.useraccess.domain.Role;
import com.stadium.useraccess.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        createRoleIfMissing("Super_admin", "Super administrator role with full privileges");
        createRoleIfMissing("Admin", "Administrator responsible for stadium management");
        createRoleIfMissing("Client", "End user able to reserve stadiums");
    }

    private void createRoleIfMissing(String label, String description) {
        roleRepository.findByLabelIgnoreCase(label).ifPresentOrElse(role -> {
        }, () -> {
            Role role = new Role();
            role.setLabel(label);
            role.setDescription(description);
            roleRepository.save(role);
        });
    }
}
