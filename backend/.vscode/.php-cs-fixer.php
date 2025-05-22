<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in(__DIR__)
    ->exclude('vendor')
    ->name('*.php');

return (new Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12'                 => true,
        'binary_operator_spaces' => [
            'default'   => 'single_space',
            'operators' => [
                '='  => 'single_space',
                '=>' => 'align_single_space',
            ],
        ],
        'no_extra_blank_lines' => [
        'tokens' => [
            'extra',
            'throw',
            'use',
            'use_trait',
            'curly_brace_block',
            'parenthesis_brace_block',
            'square_brace_block',
            'return',
        ],
    ],
    ])
    ->setFinder($finder);
