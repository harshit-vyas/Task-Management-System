package taskmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import taskmanagementsystem.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer>{

	Role findByRole(String role);
}
