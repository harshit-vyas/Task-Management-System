package taskmanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

	private String firstName;
	private String lastName;
	private String username;
	private String token;
	private String role;
	private Integer roleId;
	private Long userId;
}
