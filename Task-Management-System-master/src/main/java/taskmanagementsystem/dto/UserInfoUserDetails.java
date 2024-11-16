package taskmanagementsystem.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import taskmanagementsystem.model.User;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserInfoUserDetails implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String name;
	private String password;
	private List<GrantedAuthority> authorities;

	public UserInfoUserDetails(User userInfo) {
		name = userInfo.getUsername();
		password = userInfo.getPassword();
		authorities = Collections.singletonList(new SimpleGrantedAuthority(userInfo.getRole().getRole()));
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return name;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
