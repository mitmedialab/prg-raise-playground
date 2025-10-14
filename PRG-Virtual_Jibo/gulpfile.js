var gulp = require('gulp');
const src = 'src/**/*.{ts,js}';
require('jibo-gulp')(gulp, {
    src: src,
    tslintSrc: 'src/**/*.ts',
    tests: 'test',
    allowJs: true,
    docsReadme: './tasks/docs.md',
    commentsSrc: [
        'src/animation-animate/**',
        'src/animation-visualize/**',
        'src/geometry-info/DOFSet.js',
        'src/geometry-info/RobotInfo.js',
        'src/ifr-motion/dofs/DOFInfo.js',
        'src/ifr-core/Time.js',
        'src/ifr-core/Clock.js',
        '!src/animation-animate/timeline/**'
    ],
    releaseHeader: 'licenses/license-code.txt',
    autoTag: false,
    coverage: true,
    coverageSourceMaps: true,
    
});
