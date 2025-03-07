using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Exam1.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException validationException)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.Response.ContentType = "application/problem+json";

                var problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-3.1",
                    Title = "Validation Error",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = validationException.Errors.Select(e => e.ErrorMessage).FirstOrDefault() // Optional: Customize detail
                };

                await context.Response.WriteAsJsonAsync(problemDetails);
            }
            catch (ArgumentException argException)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest; // or another appropriate status code
                context.Response.ContentType = "application/problem+json";

                var problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-3.1",
                    Title = "Argument Error",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = argException.Message
                };

                await context.Response.WriteAsJsonAsync(problemDetails);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/problem+json";

                var problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-3.1",
                    Title = "Internal Server Error",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = ex.Message
                };

                await context.Response.WriteAsJsonAsync(problemDetails);
            }
        }
    }
}