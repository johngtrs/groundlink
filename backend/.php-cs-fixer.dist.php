<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in(__DIR__)
    ->exclude(['vendor', 'storage']);

return (new Config())
    ->setRules([
        '@PSR12'                 => true,
        'array_syntax'           => ['syntax' => 'short'],
        'binary_operator_spaces' => ['default' => 'align_single_space'],
        'no_unused_imports'      => true,
        'ordered_imports'        => true,
    ])
    ->setFinder($finder);
