"""
Structured Logging Configuration using structlog
"""
import logging
import sys
import os
from typing import Any
import structlog
from contextvars import ContextVar

# Context variable for request_id
request_id_var: ContextVar[str] = ContextVar("request_id", default="")


def add_request_id(
    logger: logging.Logger,
    method_name: str,
    event_dict: dict[str, Any]
) -> dict[str, Any]:
    """Add request_id to log event if available"""
    request_id = request_id_var.get()
    if request_id:
        event_dict["request_id"] = request_id
    return event_dict


def configure_logging(json_logs: bool = False, log_level: str = "INFO") -> None:
    """
    Configure structlog for the application.
    
    Args:
        json_logs: If True, output JSON format (for production).
                   If False, output colored console format (for development).
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    
    # Shared processors for all environments
    shared_processors: list[structlog.types.Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        add_request_id,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.UnicodeDecoder(),
    ]
    
    if json_logs:
        # Production: JSON format for log aggregation systems
        processors = shared_processors + [
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),
        ]
        # Configure standard logging to also use JSON
        logging.basicConfig(
            format="%(message)s",
            stream=sys.stdout,
            level=getattr(logging, log_level.upper()),
        )
    else:
        # Development: Colored console output
        processors = shared_processors + [
            structlog.dev.ConsoleRenderer(colors=True),
        ]
        logging.basicConfig(
            format="%(message)s",
            stream=sys.stdout,
            level=getattr(logging, log_level.upper()),
        )
    
    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, log_level.upper())
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str = __name__) -> structlog.BoundLogger:
    """Get a configured logger instance"""
    return structlog.get_logger(name)


# Auto-configure based on environment
_json_logs = os.getenv("LOG_FORMAT", "").lower() == "json"
_log_level = os.getenv("LOG_LEVEL", "INFO")
configure_logging(json_logs=_json_logs, log_level=_log_level)
