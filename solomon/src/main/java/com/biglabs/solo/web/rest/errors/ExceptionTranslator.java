package com.biglabs.solo.web.rest.errors;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.Error;
import com.biglabs.solo.web.rest.util.HeaderUtil;

import com.google.common.base.Strings;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.NativeWebRequest;
import org.zalando.problem.DefaultProblem;
import org.zalando.problem.Problem;
import org.zalando.problem.ProblemBuilder;
import org.zalando.problem.Status;
import org.zalando.problem.spring.web.advice.ProblemHandling;
import org.zalando.problem.spring.web.advice.validation.ConstraintViolationProblem;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller advice to translate the server side exceptions to client-friendly json structures.
 * The error response follows RFC7807 - Problem Details for HTTP APIs (https://tools.ietf.org/html/rfc7807)
 */
@ControllerAdvice
public class ExceptionTranslator implements ProblemHandling {

    /**
     * Post-process Problem payload to add the message key for front-end if needed
     */
    @Override
    public ResponseEntity<Problem> process(@Nullable ResponseEntity<Problem> entity, NativeWebRequest request) {
        if (entity == null || entity.getBody() == null) {
            return entity;
        }
        Problem problem = entity.getBody();
        if (!(problem instanceof ConstraintViolationProblem || problem instanceof DefaultProblem)) {
            return entity;
        }
        ProblemBuilder builder = Problem.builder()
            .withType(Problem.DEFAULT_TYPE.equals(problem.getType()) ? ErrorConstants.DEFAULT_TYPE : problem.getType())
            .withStatus(problem.getStatus())
            .withTitle(problem.getTitle())
//            .with("error", problem.getTitle())
            .with("path", request.getNativeRequest(HttpServletRequest.class).getRequestURI());

        if (problem instanceof ConstraintViolationProblem) {
            List<Error> errors = ((ConstraintViolationProblem) problem).getViolations().stream()
                .map(v -> new Error(v.getField() + " " + v.getMessage())).collect(Collectors.toList());
            builder
                .with("errors", errors)
                .with("message", ErrorConstants.ERR_VALIDATION);
            return new ResponseEntity<>(builder.build(), entity.getHeaders(), entity.getStatusCode());
        } else {
            builder
                .withCause(((DefaultProblem) problem).getCause())
                .withDetail(problem.getDetail())
                .withInstance(problem.getInstance());
            problem.getParameters().forEach(builder::with);
            if (!problem.getParameters().containsKey("message") && problem.getStatus() != null) {
                builder.with("message", "error.http." + problem.getStatus().getStatusCode());
            }
            if (!problem.getParameters().containsKey("errors") &&
                !problem.getParameters().containsKey("error")) {
                builder.with("error", problem.getTitle());
            }
            return new ResponseEntity<>(builder.build(), entity.getHeaders(), entity.getStatusCode());
        }
    }

    @Override
    public ResponseEntity<Problem> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, @Nonnull NativeWebRequest request) {
        BindingResult result = ex.getBindingResult();
        List<FieldErrorVM> fieldErrors = result.getFieldErrors().stream()
            .map(f -> new FieldErrorVM(f.getObjectName(), f.getField(), Strings.isNullOrEmpty(f.getDefaultMessage())  ? f.getCode() : f.getDefaultMessage()))
            .collect(Collectors.toList());

        Problem problem = Problem.builder()
            .withType(ErrorConstants.CONSTRAINT_VIOLATION_TYPE)
            .withTitle("Method argument not valid")
            .withStatus(defaultConstraintViolationStatus())
            .with("message", ErrorConstants.ERR_VALIDATION)
            .with("errors", fieldErrors.stream().map(f -> new Error(f.getField() + " " + f.getMessage())).collect(Collectors.toList()))
            .build();
        return create(ex, problem, request);
    }

    @ExceptionHandler(BadRequestAlertException.class)
    public ResponseEntity<Problem> handleBadRequestAlertException(BadRequestAlertException ex, NativeWebRequest request) {
        return create(ex, request, HeaderUtil.createFailureAlert(ex.getEntityName(), ex.getErrorKey(), ex.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Problem> handleNotFoundException(NotFoundException ex, NativeWebRequest request) {
        Problem p = Problem.builder()
            .withStatus(Status.BAD_REQUEST)
            .with("message", ex.getMessage())
            .with("error", ex.getMessage())
            .build();

        return create(ex, p, request);
    }

    @ExceptionHandler(ConcurrencyFailureException.class)
    public ResponseEntity<Problem> handleConcurrencyFailure(ConcurrencyFailureException ex, NativeWebRequest request) {
        Problem problem = Problem.builder()
            .withStatus(Status.CONFLICT)
            .with("message", ErrorConstants.ERR_CONCURRENCY_FAILURE)
            .with("error", ex.getMessage())
            .build();
        return create(ex, problem, request);
    }

    @ExceptionHandler(BlockCypherException.class)
    public ResponseEntity<Problem> handleConcurrencyFailure(BlockCypherException ex, NativeWebRequest request) {
        HttpStatus httpStatus = ex.getInternalException().getStatusCode();
        Status status = httpStatus.is4xxClientError() ? Status.BAD_REQUEST : Status.INTERNAL_SERVER_ERROR;
        Problem problem = Problem.builder()
            .withStatus(status)
            .with("message", ex.getMessage())
            .with("errors", ex.getBlockCypherError() != null ? ex.getBlockCypherError().getErrors() : Collections.emptyList())
            .build();
        return create(ex, problem, request);
    }

    @ExceptionHandler(JsonRpcException.class)
    public ResponseEntity<Problem> handleConcurrencyFailure(JsonRpcException ex, NativeWebRequest request) {
        Status status = Status.INTERNAL_SERVER_ERROR;
        Error error = new Error();
        error.setError(ex.getRpcError().getMessage());
        Problem problem = Problem.builder()
            .withStatus(status)
            .with("message", ex.getMessage())
            .with("errors", Arrays.asList(error))
            .build();
        return create(ex, problem, request);
    }
}
