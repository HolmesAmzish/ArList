package cn.arorms.list.backend;

import org.hibernate.PropertyValueException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDatabaseError(DataIntegrityViolationException e) {
//        e.printStackTrace();

//        Throwable rootCause = e.getRootCause();
//        if (rootCause instanceof SQLException) {
//            SQLException sqlException = (SQLException) rootCause;
//            String sqlState = sqlException.getSQLState();
//            return switch (sqlState) {
//                case "23502" -> ResponseEntity.badRequest().body("Not null violation.");
//                case "23503" -> ResponseEntity.internalServerError().body("Foreign key violation.");
//                default -> ResponseEntity.internalServerError().body("Internal database error.");
//            };
//        }

        if (e.getCause() instanceof PropertyValueException propertyValueException) {
            return ResponseEntity.badRequest().body("Property '" + propertyValueException.getPropertyName() + "' cannot be null.");
        }

        return ResponseEntity.internalServerError().body("Internal error.");
    }
}
