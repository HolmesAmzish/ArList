//package cn.arorms.list.backend.authentication;
//
//import cn.arorms.list.backend.user.UserEntity;
//import cn.arorms.list.backend.user.UserRepository;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
///**
// * AuthService
// * @version 1.0 2025-07-04
// * @author Cacciatore
// */
//@Service
//public class AuthService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    public AuthService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    // Get user entity from repository then create new auth details
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        UserEntity user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//        return new AuthDetails(user);
//    }
//}
