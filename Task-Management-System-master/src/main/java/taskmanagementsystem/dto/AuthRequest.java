package taskmanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {

	private String firstName;
	private String lastName;
	private String username;
	private String token;
	private Integer roleId;
	private String password;
}
