<?php
// Router for PHP built-in server
// Routes all requests to index.php

// If the request is for an actual file that exists, serve it
if (php_sapi_name() === 'cli-server') {
    $file = __DIR__ . $_SERVER['REQUEST_URI'];
    if (is_file($file)) {
        return false; // Serve the file directly
    }
}

// Otherwise, route to index.php
require_once __DIR__ . '/index.php';
