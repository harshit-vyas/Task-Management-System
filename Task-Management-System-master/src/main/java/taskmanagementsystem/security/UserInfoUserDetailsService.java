package taskmanagementsystem.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import taskmanagementsystem.dto.UserInfoUserDetails;
import taskmanagementsystem.model.User;
import taskmanagementsystem.repository.UserRepository;

import java.util.Optional;

@Component
public class UserInfoUserDetailsService implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> userInfo = userRepository.findByUsername(username);
		return userInfo.map(UserInfoUserDetails::new)
				.orElseThrow(() -> new UsernameNotFoundException("user not found " + username));

	}
}
