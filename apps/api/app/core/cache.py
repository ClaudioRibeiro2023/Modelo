"""
TechDados BFF - Cache (In-Memory TTL)
Simple in-memory cache with TTL support
"""
import time
import hashlib
import json
from typing import Any, Optional
from dataclasses import dataclass

from .settings import get_settings
from .logging import get_logger

logger = get_logger(__name__)


@dataclass
class CacheEntry:
    """Cache entry with value and expiration"""
    value: Any
    expires_at: float


class InMemoryCache:
    """
    Simple in-memory cache with TTL support.
    
    Thread-safe for basic operations (Python GIL).
    For production, consider Redis.
    """
    
    def __init__(self):
        self._cache: dict[str, CacheEntry] = {}
    
    def _generate_key(
        self,
        endpoint: str,
        params: dict = None,
        scope_key: str = "global",
    ) -> str:
        """
        Generate cache key from endpoint, params, and scope.
        
        Key includes scope_key to prevent data leakage between users
        with different access levels.
        """
        # Normalize params
        sorted_params = json.dumps(params or {}, sort_keys=True)
        
        # Create hash for key
        key_data = f"{endpoint}:{sorted_params}:{scope_key}"
        key_hash = hashlib.md5(key_data.encode()).hexdigest()[:16]
        
        return f"cache:{endpoint}:{key_hash}"
    
    def get(
        self,
        endpoint: str,
        params: dict = None,
        scope_key: str = "global",
    ) -> Optional[Any]:
        """
        Get value from cache if exists and not expired.
        
        Args:
            endpoint: Endpoint name
            params: Query parameters
            scope_key: User scope key for RBAC isolation
        
        Returns:
            Cached value or None
        """
        key = self._generate_key(endpoint, params, scope_key)
        entry = self._cache.get(key)
        
        if entry is None:
            return None
        
        if time.time() > entry.expires_at:
            del self._cache[key]
            logger.debug("cache_expired", key=key)
            return None
        
        logger.debug("cache_hit", key=key)
        return entry.value
    
    def set(
        self,
        endpoint: str,
        value: Any,
        ttl_seconds: int,
        params: dict = None,
        scope_key: str = "global",
    ) -> None:
        """
        Set value in cache with TTL.
        
        Args:
            endpoint: Endpoint name
            value: Value to cache
            ttl_seconds: Time to live in seconds
            params: Query parameters
            scope_key: User scope key for RBAC isolation
        """
        key = self._generate_key(endpoint, params, scope_key)
        expires_at = time.time() + ttl_seconds
        
        self._cache[key] = CacheEntry(value=value, expires_at=expires_at)
        logger.debug("cache_set", key=key, ttl=ttl_seconds)
    
    def invalidate(
        self,
        endpoint: str,
        params: dict = None,
        scope_key: str = "global",
    ) -> bool:
        """
        Invalidate a specific cache entry.
        
        Returns:
            True if entry was found and removed
        """
        key = self._generate_key(endpoint, params, scope_key)
        if key in self._cache:
            del self._cache[key]
            logger.debug("cache_invalidated", key=key)
            return True
        return False
    
    def clear(self) -> int:
        """
        Clear all cache entries.
        
        Returns:
            Number of entries cleared
        """
        count = len(self._cache)
        self._cache.clear()
        logger.info("cache_cleared", count=count)
        return count
    
    def cleanup_expired(self) -> int:
        """
        Remove all expired entries.
        
        Returns:
            Number of entries removed
        """
        now = time.time()
        expired_keys = [
            k for k, v in self._cache.items()
            if now > v.expires_at
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        if expired_keys:
            logger.debug("cache_cleanup", removed=len(expired_keys))
        
        return len(expired_keys)
    
    @property
    def size(self) -> int:
        """Current number of entries in cache"""
        return len(self._cache)


# Global cache instance
_cache = InMemoryCache()


def get_cache() -> InMemoryCache:
    """Get the global cache instance"""
    return _cache
